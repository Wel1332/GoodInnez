package com.goodinnez.goodinnez.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer typeID;

    private String name;
    private String description;
    private BigDecimal pricePerNight;
    private Integer capacity;

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