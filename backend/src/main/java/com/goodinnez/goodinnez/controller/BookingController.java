package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Booking;
import com.goodinnez.goodinnez.repository.BookingRepository;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public Booking create(@RequestBody com.goodinnez.goodinnez.entity.Booking booking) {
        return toDTO(bookingRepository.save(booking));
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
