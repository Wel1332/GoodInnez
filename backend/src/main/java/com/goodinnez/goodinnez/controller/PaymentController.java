package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Payment;
import com.goodinnez.goodinnez.model.PaymentId;
import com.goodinnez.goodinnez.repository.PaymentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
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
    public Payment create(@RequestBody Payment payment) {
        return paymentRepository.save(payment);
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
