package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.entity.Payment;
import com.goodinnez.goodinnez.entity.PaymentId;
import com.goodinnez.goodinnez.repository.PaymentRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }

    @GetMapping("/{bookingId}/{guestId}/{roomId}")
    public Payment getById(
            @PathVariable Integer bookingId,
            @PathVariable Integer guestId,
            @PathVariable Integer roomId) {

        PaymentId id = new PaymentId(bookingId, guestId, roomId);
        return paymentRepository.findById(id).orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Payment payment) {
        try {
            if (payment.getBookingID() == null || payment.getGuestID() == null || payment.getRoomNumber() == null) {
                return ResponseEntity.badRequest().body("Booking ID, Guest ID, and Room ID are required.");
            }
            Payment savedPayment = paymentRepository.save(payment);
            return ResponseEntity.ok(savedPayment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating payment: " + e.getMessage());
        }
    }

    @PutMapping("/{bookingId}/{guestId}/{roomId}")
    public Payment update(
            @PathVariable Integer bookingId,
            @PathVariable Integer guestId,
            @PathVariable Integer roomId,
            @RequestBody Payment details) {

        PaymentId id = new PaymentId(bookingId, guestId, roomId);

        return paymentRepository.findById(id).map(p -> {
            p.setCheckinTime(details.getCheckinTime());
            p.setCheckoutTime(details.getCheckoutTime());
            p.setTotalPrice(details.getTotalPrice());
            p.setBooking(details.getBooking());
            p.setGuest(details.getGuest());
            p.setRoom(details.getRoom());
            return paymentRepository.save(p);
        }).orElse(null);
    }

    @DeleteMapping("/{bookingId}/{guestId}/{roomId}")
    public void delete(
            @PathVariable Integer bookingId,
            @PathVariable Integer guestId,
            @PathVariable Integer roomId) {

        PaymentId id = new PaymentId(bookingId, guestId, roomId);
        paymentRepository.deleteById(id);
    }
}
