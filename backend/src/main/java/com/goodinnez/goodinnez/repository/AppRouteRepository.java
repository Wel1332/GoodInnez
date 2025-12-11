package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.entity.AppRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppRouteRepository extends JpaRepository<AppRoute, Integer> {
    // Basic fetch; filtering logic will happen in the service/controller for simplicity
    List<AppRoute> findAll();
}