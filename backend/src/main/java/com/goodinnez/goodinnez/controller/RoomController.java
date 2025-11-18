package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Room;
import com.goodinnez.goodinnez.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    private Room toDTO(com.goodinnez.goodinnez.entity.Room r) {
        Room dto = new Room();
        dto.roomID = r.getRoomID();
        dto.status = r.getStatus();
        dto.hotelID = r.getHotel() != null ? r.getHotel().getHotelID() : null;
        dto.typeID = r.getRoomType() != null ? r.getRoomType().getTypeID() : null;
        return dto;
    }

    @GetMapping
    public List<Room> getAll() {
        return roomRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Room getById(@PathVariable Integer id) {
        return roomRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @PostMapping
    public Room create(@RequestBody com.goodinnez.goodinnez.entity.Room room) {
        return toDTO(roomRepository.save(room));
    }

    @PutMapping("/{id}")
    public Room update(@PathVariable Integer id, @RequestBody com.goodinnez.goodinnez.entity.Room details) {
        return roomRepository.findById(id).map(r -> {
            r.setStatus(details.getStatus());
            r.setHotel(details.getHotel());
            r.setRoomType(details.getRoomType());
            return toDTO(roomRepository.save(r));
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        roomRepository.deleteById(id);
    }
}
