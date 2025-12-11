package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Booking;
import com.goodinnez.goodinnez.entity.Room;
import com.goodinnez.goodinnez.repository.BookingRepository;
import com.goodinnez.goodinnez.repository.PaymentRepository;
import com.goodinnez.goodinnez.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RoomRepository roomRepository; // 1. Add RoomRepository

    // 2. Update Constructor
    public BookingController(BookingRepository bookingRepository, PaymentRepository paymentRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.roomRepository = roomRepository;
    }

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
    public ResponseEntity<?> create(@RequestBody com.goodinnez.goodinnez.entity.Booking booking) {
        try {
            // --- VALIDATION ---
            if (booking.getRoom() == null || booking.getRoom().getRoomID() == null) {
                return ResponseEntity.badRequest().body("Room ID is required.");
            }
            if (booking.getCheckinTime() == null || booking.getCheckoutTime() == null) {
                return ResponseEntity.badRequest().body("Check-in and Check-out times are required.");
            }
            if (booking.getGuest() == null || booking.getGuest().getGuestID() == null) {
                return ResponseEntity.badRequest().body("Guest ID is required.");
            }

            // --- AVAILABILITY CHECK ---
            boolean isOccupied = bookingRepository.existsByRoomAndDates(
                    booking.getRoom().getRoomID(),
                    booking.getCheckinTime(),
                    booking.getCheckoutTime()
            );

            if (isOccupied) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Sorry, this room is already booked for the selected dates.");
            }

            // --- PRICE CALCULATION (NEW) ---
            // 1. Fetch the Room to get the Price Per Night
            Room room = roomRepository.findById(booking.getRoom().getRoomID())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            // 2. Calculate number of nights
            long nights = ChronoUnit.DAYS.between(booking.getCheckinTime(), booking.getCheckoutTime());
            if (nights < 1) nights = 1; // Minimum charge of 1 night

            // 3. Calculate Total: PricePerNight * Nights
            BigDecimal pricePerNight = room.getRoomType().getPricePerNight();
            BigDecimal calculatedTotal = pricePerNight.multiply(BigDecimal.valueOf(nights));

            // 4. Set the calculated price (Overrides whatever the frontend sent)
            booking.setTotalPrice(calculatedTotal);

            // --- SET DEFAULT STATUS ---
            booking.setStatus("PENDING"); 
            
            com.goodinnez.goodinnez.entity.Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(toDTO(savedBooking));
        } catch (Exception e) {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            if (!bookingRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
            }
            // Delete related payments first
            var payments = paymentRepository.findByBookingID(id);
            paymentRepository.deleteAll(payments);
            
            bookingRepository.deleteById(id);
            return ResponseEntity.ok("Booking cancelled successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}