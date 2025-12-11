package com.goodinnez.goodinnez.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Booking {
    public Integer bookingID;
    public LocalDateTime checkinTime;
    public LocalDateTime checkoutTime;
    public BigDecimal totalPrice;
    public Integer guestID;
    public Integer roomID;
    public String status;
}