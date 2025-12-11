package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Hotel;
import com.goodinnez.goodinnez.repository.HotelRepository;
import com.goodinnez.goodinnez.repository.EmployeeRepository;
import com.goodinnez.goodinnez.service.CloudinaryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:5173")
public class HotelController {

    private final HotelRepository hotelRepository;
    private final EmployeeRepository employeeRepository;
    private final CloudinaryService cloudinaryService;

    public HotelController(HotelRepository hotelRepository, EmployeeRepository employeeRepository, CloudinaryService cloudinaryService) {
        this.hotelRepository = hotelRepository;
        this.employeeRepository = employeeRepository;
        this.cloudinaryService = cloudinaryService;
    }

    private Hotel toDTO(com.goodinnez.goodinnez.entity.Hotel h) {
        if (h == null) return null;
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

    // Public endpoint for Guests (See ALL hotels)
    @GetMapping
    public List<Hotel> getAll() {
        return hotelRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // --- NEW: Partner endpoint (See ONLY my hotels) ---
    @GetMapping("/partner/{employeeId}")
    public List<Hotel> getPartnerHotels(@PathVariable Integer employeeId) {
        // In this simple setup, we check if the employee exists and has a hotel linked
        // Note: If your DB allows one employee -> many hotels, you'd use a different query.
        // Assuming One-to-Many (One Hotel has Many Employees) or Many-to-One ownership logic:
        // Based on your Employee entity having 'hotelid', an employee belongs to ONE hotel.
        // If the 'Partner' is the 'Owner' who created it, they are linked to that hotel.
        
        com.goodinnez.goodinnez.entity.Employee emp = employeeRepository.findById(employeeId).orElse(null);
        List<Hotel> myHotels = new ArrayList<>();
        
        if (emp != null && emp.getHotel() != null) {
            myHotels.add(toDTO(emp.getHotel()));
        }
        return myHotels;
    }

    @GetMapping("/{id}")
    public Hotel getById(@PathVariable Integer id) {
        return hotelRepository.findById(id).map(this::toDTO).orElse(null);
    }

    // --- UPDATED: Create and Link to Partner ---
    @PostMapping
    public ResponseEntity<?> create(
            @ModelAttribute com.goodinnez.goodinnez.entity.Hotel hotel, 
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "ownerId", required = false) Integer ownerId
    ) {
        try {
            // 1. Upload Image
            String imageUrl = cloudinaryService.uploadFile(file);
            hotel.setImage(imageUrl);
            
            // 2. Save Hotel
            com.goodinnez.goodinnez.entity.Hotel savedHotel = hotelRepository.save(hotel);

            // 3. Link to Employee (The Partner who created it becomes linked to this hotel)
            if (ownerId != null) {
                com.goodinnez.goodinnez.entity.Employee owner = employeeRepository.findById(ownerId).orElse(null);
                if (owner != null) {
                    owner.setHotel(savedHotel); // Set the relationship
                    employeeRepository.save(owner); // Update employee record
                }
            }

            return ResponseEntity.ok(toDTO(savedHotel));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }
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