package com.goodinnez.goodinnez.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "app_route")
public class AppRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String path;           // e.g., "/host/dashboard"
    private String componentKey;   // e.g., "HostDashboard" (Maps to frontend component)
    private String requiredRole;   // e.g., "PARTNER", "GUEST", "PUBLIC"
    private String label;          // For the menu, e.g., "Dashboard"

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getComponentKey() { return componentKey; }
    public void setComponentKey(String componentKey) { this.componentKey = componentKey; }
    public String getRequiredRole() { return requiredRole; }
    public void setRequiredRole(String requiredRole) { this.requiredRole = requiredRole; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}