package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Booking; // Your DTO with public fields
import com.goodinnez.goodinnez.entity.Guest;
import com.goodinnez.goodinnez.entity.Room;
import com.goodinnez.goodinnez.repository.BookingRepository;
import com.goodinnez.goodinnez.repository.GuestRepository;
import com.goodinnez.goodinnez.repository.PaymentRepository;
import com.goodinnez.goodinnez.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RoomRepository roomRepository;
    private final GuestRepository guestRepository;

    public BookingController(BookingRepository bookingRepository, 
                             PaymentRepository paymentRepository, 
                             RoomRepository roomRepository,
                             GuestRepository guestRepository) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.roomRepository = roomRepository;
        this.guestRepository = guestRepository;
    }

    // --- 1. Custom Request Class ---
    // This catches the JSON from React safely
    public static class BookingRequest {
        public Integer guestId;
        public Integer roomId;       
        public Integer room_number; 
        public String checkInDate;   
        public String checkOutDate;  
        public BigDecimal totalPrice;
        public String status;
        public String paymentStatus;
    }

    // --- 2. Fixed DTO Converter ---
    // Uses direct field access because your model.Booking has public fields
    private Booking toDTO(com.goodinnez.goodinnez.entity.Booking b) {
        Booking dto = new Booking();
        dto.bookingID = b.getBookingID();
        dto.checkinTime = b.getCheckinTime();
        dto.checkoutTime = b.getCheckoutTime();
        dto.totalPrice = b.getTotalPrice();
        dto.guestID = b.getGuest() != null ? b.getGuest().getGuestID() : null;
        dto.roomID = b.getRoom() != null ? b.getRoom().getRoomID() : null;
        dto.status = b.getStatus();
        return dto;
    }

    @GetMapping
    public List<Booking> getAll() {
        return bookingRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Booking getById(@PathVariable Integer id) {
        return bookingRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BookingRequest request) {
        try {
            // 1. Resolve Room ID
            Integer finalRoomId = request.roomId != null ? request.roomId : request.room_number;

            if (finalRoomId == null) {
                return ResponseEntity.badRequest().body("Error: Room ID is missing.");
            }
            if (request.guestId == null) {
                return ResponseEntity.badRequest().body("Error: Guest ID is missing.");
            }

            // 2. Fetch Entities
            Room room = roomRepository.findById(finalRoomId)
                    .orElseThrow(() -> new RuntimeException("Room not found with ID: " + finalRoomId));

            Guest guest = guestRepository.findById(request.guestId)
                    .orElseThrow(() -> new RuntimeException("Guest not found with ID: " + request.guestId));

            // 3. Handle Dates
            LocalDate inDate = LocalDate.parse(request.checkInDate);
            LocalDate outDate = LocalDate.parse(request.checkOutDate);
            
            LocalDateTime checkInDateTime = inDate.atTime(14, 0); 
            LocalDateTime checkOutDateTime = outDate.atTime(12, 0);

            // 4. Availability Check
            boolean isOccupied = bookingRepository.existsByRoomAndDates(
                    finalRoomId,
                    checkInDateTime,
                    checkOutDateTime
            );

            if (isOccupied) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Sorry, this room is already booked for these dates.");
            }

            // 5. Build & Save
            com.goodinnez.goodinnez.entity.Booking newBooking = new com.goodinnez.goodinnez.entity.Booking();
            newBooking.setRoom(room);
            newBooking.setGuest(guest);
            newBooking.setCheckinTime(checkInDateTime);
            newBooking.setCheckoutTime(checkOutDateTime);
            newBooking.setStatus("Pending");
            
            // Recalculate Price
            long nights = ChronoUnit.DAYS.between(inDate, outDate);
            if (nights < 1) nights = 1;
            BigDecimal calculatedPrice = room.getRoomType().getPricePerNight().multiply(BigDecimal.valueOf(nights));
            newBooking.setTotalPrice(calculatedPrice);

            com.goodinnez.goodinnez.entity.Booking savedBooking = bookingRepository.save(newBooking);
            
            return ResponseEntity.ok(toDTO(savedBooking));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating booking: " + e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public Booking update(@PathVariable Integer id, @RequestBody com.goodinnez.goodinnez.entity.Booking details) {
        return bookingRepository.findById(id).map(b -> {
            b.setCheckinTime(details.getCheckinTime());
            b.setCheckoutTime(details.getCheckoutTime());
            b.setTotalPrice(details.getTotalPrice());
            b.setGuest(details.getGuest());
            b.setRoom(details.getRoom());
            b.setStatus(details.getStatus());
            return toDTO(bookingRepository.save(b));
        }).orElse(null);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody java.util.Map<String, String> payload) {
        try {
            String newStatus = payload.get("status");
            
            return bookingRepository.findById(id).map(booking -> {
                booking.setStatus(newStatus);
                com.goodinnez.goodinnez.entity.Booking updated = bookingRepository.save(booking);
                return ResponseEntity.ok(toDTO(updated));
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            if (!bookingRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
            }
            var payments = paymentRepository.findByBookingID(id);
            paymentRepository.deleteAll(payments);
            
            bookingRepository.deleteById(id);
            return ResponseEntity.ok("Booking cancelled.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}