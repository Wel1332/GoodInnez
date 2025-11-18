package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.dto.RoomDTO;
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

    private RoomDTO toDTO(Room r) {
        RoomDTO dto = new RoomDTO();
        dto.roomID = r.getRoomID();
        dto.status = r.getStatus();
        dto.hotelID = r.getHotel() != null ? r.getHotel().getHotelID() : null;
        dto.typeID = r.getRoomType() != null ? r.getRoomType().getTypeID() : null;
        return dto;
    }

    @GetMapping
    public List<RoomDTO> getAll() {
        return roomRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public RoomDTO getById(@PathVariable Integer id) {
        return roomRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @PostMapping
    public RoomDTO create(@RequestBody Room room) {
        return toDTO(roomRepository.save(room));
    }

    @PutMapping("/{id}")
    public RoomDTO update(@PathVariable Integer id, @RequestBody Room details) {
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
