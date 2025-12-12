package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.room.roomID = :roomId " +
           "AND (b.checkinTime < :checkoutTime AND b.checkoutTime > :checkinTime) " +
           "AND (b.status IS NULL OR (b.status != 'Cancelled' AND b.status != 'Rejected'))")
    boolean existsByRoomAndDates(
            @Param("roomId") Integer roomId, 
            @Param("checkinTime") LocalDateTime checkinTime, 
            @Param("checkoutTime") LocalDateTime checkoutTime
    );

    // This query is used by the Hotel Details page
    @Query("SELECT b.room.roomID FROM Booking b " +
           "WHERE b.room.hotel.hotelID = :hotelId " +
           "AND (b.checkinTime < :checkoutTime AND b.checkoutTime > :checkinTime) " +
           "AND (b.status IS NULL OR (b.status != 'Cancelled' AND b.status != 'Rejected'))") 
    List<Integer> findOccupiedRoomIds(
            @Param("hotelId") Integer hotelId,
            @Param("checkinTime") LocalDateTime checkinTime,
            @Param("checkoutTime") LocalDateTime checkoutTime
    );
}