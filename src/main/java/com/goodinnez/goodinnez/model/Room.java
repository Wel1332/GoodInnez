package com.goodinnez.goodinnez.model;

import jakarta.persistence.*;

@Entity
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roomID;

    @ManyToOne
    @JoinColumn(name = "hotelID")
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "typeID")
    private RoomType roomType;

    private String status;

    public Integer getRoomID() { return roomID; }
    public void setRoomID(Integer roomID) { this.roomID = roomID; }

    public Hotel getHotel() { return hotel; }
    public void setHotel(Hotel hotel) { this.hotel = hotel; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}