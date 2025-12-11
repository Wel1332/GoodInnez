package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Guest;
import com.goodinnez.goodinnez.repository.GuestRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;


@RestController
@RequestMapping("/api/guests")
@CrossOrigin(origins = "http://localhost:5173")
public class GuestController {

    private final GuestRepository guestRepository;
    private final PasswordEncoder passwordEncoder;
        

    public GuestController(GuestRepository guestRepository, PasswordEncoder passwordEncoder) {
        this.guestRepository = guestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private Guest toDTO(com.goodinnez.goodinnez.entity.Guest g) {
        Guest dto = new Guest();
        dto.guestID = g.getGuestID();
        dto.firstName = g.getFirstName();
        dto.lastName = g.getLastName();
        dto.dateOfBirth = g.getDateOfBirth();
        dto.email = g.getEmail();
        dto.phone = g.getPhone();
        dto.address = g.getAddress();
        return dto;
    }

    @GetMapping
    public List<Guest> getAll() {
        return guestRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Guest getById(@PathVariable Integer id) {
        return guestRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody com.goodinnez.goodinnez.entity.Guest guest) {
        // 1. Check if email already exists
        com.goodinnez.goodinnez.entity.Guest existingUser = guestRepository.findByEmail(guest.getEmail());
            
        if (existingUser != null) {
            // 2. If it exists, return an ERROR (409 Conflict)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Error: Email is already in use!");
        }

        // 3. Hash the password
        String encodedPassword = passwordEncoder.encode(guest.getPassword());
        guest.setPassword(encodedPassword);

        // 4. Save the new guest
        com.goodinnez.goodinnez.entity.Guest savedGuest = guestRepository.save(guest);
            
        // 5. Return success
        return ResponseEntity.ok(toDTO(savedGuest));
    }

    @PutMapping("/{id}")
    public Guest update(@PathVariable Integer id, @RequestBody com.goodinnez.goodinnez.entity.Guest details) {
        return guestRepository.findById(id).map(g -> {
            g.setFirstName(details.getFirstName());
            g.setLastName(details.getLastName());
            g.setEmail(details.getEmail());
            g.setPhone(details.getPhone());
            g.setAddress(details.getAddress());
            g.setDateOfBirth(details.getDateOfBirth());
            return toDTO(guestRepository.save(g));
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        guestRepository.deleteById(id);
    }

    @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
            String email = loginData.get("email");
            String rawPassword = loginData.get("password"); // The plain text password from user

            com.goodinnez.goodinnez.entity.Guest dbGuest = guestRepository.findByEmail(email);

            if (dbGuest != null && passwordEncoder.matches(rawPassword, dbGuest.getPassword())) {
                Guest dto = toDTO(dbGuest);
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        }
    }
