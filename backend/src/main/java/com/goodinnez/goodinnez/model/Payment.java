package com.goodinnez.goodinnez.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@IdClass(PaymentId.class)
public class Payment implements Serializable {

    @Id
    private Integer bookingID;

    @Id
    private Integer guestID;

    @Id
    private Integer roomNumber;

    private LocalDateTime checkinTime;
    private LocalDateTime checkoutTime;
    private BigDecimal totalPrice;

    @ManyToOne
    @JoinColumn(name = "bookingID", insertable = false, updatable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "guestID", insertable = false, updatable = false)
    private Guest guest;

    @ManyToOne
    @JoinColumn(name = "roomNumber", insertable = false, updatable = false)
    private Room room;

    // Getters and Setters
    public Integer getBookingID() { return bookingID; }
    public void setBookingID(Integer bookingID) { this.bookingID = bookingID; }

    public Integer getGuestID() { return guestID; }
    public void setGuestID(Integer guestID) { this.guestID = guestID; }

    public Integer getRoomNumber() { return roomNumber; }
    public void setRoomNumber(Integer roomNumber) { this.roomNumber = roomNumber; }

    public LocalDateTime getCheckinTime() { return checkinTime; }
    public void setCheckinTime(LocalDateTime checkinTime) { this.checkinTime = checkinTime; }

    public LocalDateTime getCheckoutTime() { return checkoutTime; }
    public void setCheckoutTime(LocalDateTime checkoutTime) { this.checkoutTime = checkoutTime; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Guest getGuest() { return guest; }
    public void setGuest(Guest guest) { this.guest = guest; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
}