package com.goodinnez.goodinnez.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingDTO {
    public Integer bookingID;
    public LocalDateTime checkinTime;
    public LocalDateTime checkoutTime;
    public BigDecimal totalPrice;
    public Integer guestID;
    public Integer roomID;
}
