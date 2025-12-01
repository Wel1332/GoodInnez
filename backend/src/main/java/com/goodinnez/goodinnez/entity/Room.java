package com.goodinnez.goodinnez.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roomID;

    private String status;

    @ManyToOne
    @JoinColumn(name = "hotelid")
    @JsonBackReference(value = "hotel-room") // Matches Hotel.java
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "typeid")
    @JsonBackReference(value = "room-type") // Matches RoomType.java
    private RoomType roomType;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "room-booking") // Matches Booking.java
    private List<Booking> bookings;

    // Getters and Setters
    public Integer getRoomID() { return roomID; }
    public void setRoomID(Integer roomID) { this.roomID = roomID; }

    public Hotel getHotel() { return hotel; }
    public void setHotel(Hotel hotel) { this.hotel = hotel; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}