package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Guest;
import com.goodinnez.goodinnez.repository.GuestRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    private final GuestRepository guestRepository;

    public GuestController(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
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
    public Guest create(@RequestBody com.goodinnez.goodinnez.entity.Guest guest) {
        return toDTO(guestRepository.save(guest));
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
}
