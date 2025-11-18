package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Hotel;
import com.goodinnez.goodinnez.repository.HotelRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelRepository hotelRepository;

    public HotelController(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    private Hotel toDTO(com.goodinnez.goodinnez.entity.Hotel h) {
        Hotel dto = new Hotel();
        dto.hotelID = h.getHotelID();
        dto.name = h.getName();
        dto.address = h.getAddress();
        dto.phone = h.getPhone();
        dto.email = h.getEmail();
        dto.stars = h.getStars();
        dto.checkinTime = h.getCheckinTime();
        dto.checkoutTime = h.getCheckoutTime();
        return dto;
    }

    @GetMapping
    public List<Hotel> getAll() {
        return hotelRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Hotel getById(@PathVariable Integer id) {
        return hotelRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @PostMapping
    public Hotel create(@RequestBody com.goodinnez.goodinnez.entity.Hotel hotel) {
        return toDTO(hotelRepository.save(hotel));
    }

    @PutMapping("/{id}")
    public Hotel update(@PathVariable Integer id, @RequestBody com.goodinnez.goodinnez.entity.Hotel details) {
        return hotelRepository.findById(id).map(h -> {
            h.setName(details.getName());
            h.setAddress(details.getAddress());
            h.setPhone(details.getPhone());
            h.setEmail(details.getEmail());
            h.setStars(details.getStars());
            h.setCheckinTime(details.getCheckinTime());
            h.setCheckoutTime(details.getCheckoutTime());
            return toDTO(hotelRepository.save(h));
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        hotelRepository.deleteById(id);
    }
}
