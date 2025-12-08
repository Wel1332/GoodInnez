package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Hotel;
import com.goodinnez.goodinnez.repository.HotelRepository;
import com.goodinnez.goodinnez.service.CloudinaryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:5173")
public class HotelController {

    private final HotelRepository hotelRepository;
    private final CloudinaryService cloudinaryService;

    // 4. Update Constructor to include CloudinaryService
    public HotelController(HotelRepository hotelRepository, CloudinaryService cloudinaryService) {
        this.hotelRepository = hotelRepository;
        this.cloudinaryService = cloudinaryService;
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
        dto.image = h.getImage(); 
        
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
    public Hotel create(
            @ModelAttribute com.goodinnez.goodinnez.entity.Hotel hotel, 
            @RequestParam("file") MultipartFile file 
    ) throws IOException {
        
        String imageUrl = cloudinaryService.uploadFile(file);
        
        hotel.setImage(imageUrl);
        
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