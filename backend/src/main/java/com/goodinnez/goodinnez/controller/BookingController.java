package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Booking;
import com.goodinnez.goodinnez.repository.BookingRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    private Booking toDTO(com.goodinnez.goodinnez.entity.Booking b) {
        Booking dto = new Booking();
        dto.bookingID = b.getBookingID();
        dto.checkinTime = b.getCheckinTime();
        dto.checkoutTime = b.getCheckoutTime();
        dto.totalPrice = b.getTotalPrice();
        dto.guestID = b.getGuest() != null ? b.getGuest().getGuestID() : null;
        dto.roomID = b.getRoom() != null ? b.getRoom().getRoomID() : null;
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

    // --- UPDATED CREATE METHOD (With Availability Check) ---
    @PostMapping
    public ResponseEntity<?> create(@RequestBody com.goodinnez.goodinnez.entity.Booking booking) {
        try {
            // 1. Validation: Ensure we have a room and dates
            if (booking.getRoom() == null || booking.getRoom().getRoomID() == null) {
                return ResponseEntity.badRequest().body("Room ID is required.");
            }
            if (booking.getCheckinTime() == null) {
                return ResponseEntity.badRequest().body("Check-in time is required.");
            }
            if (booking.getCheckoutTime() == null) {
                return ResponseEntity.badRequest().body("Check-out time is required.");
            }
            if (booking.getGuest() == null || booking.getGuest().getGuestID() == null) {
                return ResponseEntity.badRequest().body("Guest ID is required.");
            }

            // 2. Availability Check: Call the custom Repository method
            boolean isOccupied = bookingRepository.existsByRoomAndDates(
                    booking.getRoom().getRoomID(),
                    booking.getCheckinTime(),
                    booking.getCheckoutTime()
            );

            if (isOccupied) {
                // Return 409 Conflict if taken
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Sorry, this room is already booked for the selected dates.");
            }

            // 3. Save if free
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
            return toDTO(bookingRepository.save(b));
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        bookingRepository.deleteById(id);
    }
}