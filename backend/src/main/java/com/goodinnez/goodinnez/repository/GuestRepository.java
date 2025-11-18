package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Integer> {
}
