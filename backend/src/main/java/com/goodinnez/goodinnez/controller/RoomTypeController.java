package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.RoomType;
import com.goodinnez.goodinnez.repository.RoomTypeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roomtypes")
public class RoomTypeController {

    private final RoomTypeRepository roomTypeRepository;

    public RoomTypeController(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    private RoomType toDTO(com.goodinnez.goodinnez.entity.RoomType rt) {
        RoomType dto = new RoomType();
        dto.typeID = rt.getTypeID();
        dto.name = rt.getName();
        dto.description = rt.getDescription();
        dto.capacity = rt.getCapacity();
        dto.pricePerNight = rt.getPricePerNight();
        return dto;
    }

    @GetMapping
    public List<RoomType> getAll() {
        return roomTypeRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public RoomType getById(@PathVariable Integer id) {
        return roomTypeRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @PostMapping
    public RoomType create(@RequestBody com.goodinnez.goodinnez.entity.RoomType roomType) {
        return toDTO(roomTypeRepository.save(roomType));
    }

    @PutMapping("/{id}")
    public RoomType update(@PathVariable Integer id, @RequestBody com.goodinnez.goodinnez.entity.RoomType details) {
        return roomTypeRepository.findById(id).map(rt -> {
            rt.setName(details.getName());
            rt.setDescription(details.getDescription());
            rt.setCapacity(details.getCapacity());
            rt.setPricePerNight(details.getPricePerNight());
            return toDTO(roomTypeRepository.save(rt));
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        roomTypeRepository.deleteById(id);
    }
}
