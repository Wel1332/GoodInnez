package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.AppRoute; 
import com.goodinnez.goodinnez.repository.AppRouteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:5173")
public class RouteController {

    private final AppRouteRepository routeRepository;

    public RouteController(AppRouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    // --- Helper Method: Convert Entity to Model ---
    private AppRoute toDTO(com.goodinnez.goodinnez.entity.AppRoute entity) {
        AppRoute dto = new AppRoute();
        dto.id = entity.getId();
        dto.path = entity.getPath();
        dto.componentKey = entity.getComponentKey();
        dto.requiredRole = entity.getRequiredRole();
        dto.label = entity.getLabel();
        return dto;
    }

    @GetMapping
    public List<AppRoute> getRoutes(@RequestParam(required = false) String role) {
        // If no role is provided (Guest not logged in), return PUBLIC routes
        String userRole = (role == null) ? "PUBLIC" : role;

        return routeRepository.findAll().stream()
                .filter(route -> {
                    // Logic to check if user allowed to see this route
                    if (route.getRequiredRole().equals("PUBLIC")) return true;
                    if (userRole.equals("employee") && route.getRequiredRole().equals("PARTNER")) return true;
                    if (userRole.equals("guest") && route.getRequiredRole().equals("GUEST")) return true;
                    return false;
                })
                .map(this::toDTO) // <--- Convert Entity to Model here
                .collect(Collectors.toList());
    }
}