package com.goodinnez.goodinnez.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
public class RoomType {
    // ... fields ...
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer typeID;

    private String name;
    private String description;
    private Integer capacity;
    private BigDecimal pricePerNight;

    @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "room-type") // <--- MATCH ROOM NAME
    private List<Room> rooms;

    // ... getters and setters ...
    public Integer getTypeID() { return typeID; }
    public void setTypeID(Integer typeID) { this.typeID = typeID; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}