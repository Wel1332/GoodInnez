package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.room.roomID = :roomId " +
           "AND (b.checkinTime < :checkoutTime AND b.checkoutTime > :checkinTime)")
    boolean existsByRoomAndDates(
            @Param("roomId") Integer roomId, 
            @Param("checkinTime") LocalDateTime checkinTime, 
            @Param("checkoutTime") LocalDateTime checkoutTime
    );
}