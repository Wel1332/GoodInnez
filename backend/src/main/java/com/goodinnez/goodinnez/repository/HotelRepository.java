package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Integer> {
}