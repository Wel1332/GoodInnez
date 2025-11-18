package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
}
