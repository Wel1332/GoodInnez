package com.goodinnez.goodinnez.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingID;

    private LocalDateTime checkinTime;
    private LocalDateTime checkoutTime;
    private BigDecimal totalPrice;
    private String status;

    @ManyToOne
    @JoinColumn(name = "guestid")
    @JsonBackReference(value = "guest-booking")
    private Guest guest;

    @ManyToOne
    @JoinColumn(name = "room_number", referencedColumnName = "roomID")
    @JsonBackReference(value = "room-booking")
    private Room room;

    public Integer getBookingID() { return bookingID; }
    public void setBookingID(Integer bookingID) { this.bookingID = bookingID; }

    public Guest getGuest() { return guest; }
    public void setGuest(Guest guest) { this.guest = guest; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public LocalDateTime getCheckinTime() { return checkinTime; }
    public void setCheckinTime(LocalDateTime checkinTime) { this.checkinTime = checkinTime; }

    public LocalDateTime getCheckoutTime() { return checkoutTime; }
    public void setCheckoutTime(LocalDateTime checkoutTime) { this.checkoutTime = checkoutTime; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    // --- NEW GETTER & SETTER ---
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}