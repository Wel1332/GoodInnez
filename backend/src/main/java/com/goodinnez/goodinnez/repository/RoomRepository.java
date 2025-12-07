package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    // Finds all rooms for a specific hotel
    List<Room> findByHotel_HotelID(Integer hotelID);
}