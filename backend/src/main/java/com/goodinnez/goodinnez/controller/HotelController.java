package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Hotel;
import com.goodinnez.goodinnez.repository.HotelRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelRepository hotelRepository;

    public HotelController(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @GetMapping
    public List<Hotel> getAll() {
        return hotelRepository.findAll();
    }

    @PostMapping
    public Hotel create(@RequestBody Hotel hotel) {
        return hotelRepository.save(hotel);
    }
}