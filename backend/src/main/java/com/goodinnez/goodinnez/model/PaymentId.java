package com.goodinnez.goodinnez.model;


import java.io.Serializable;
import java.util.Objects;

public class PaymentId implements Serializable {
    private Integer bookingID;
    private Integer guestID;
    private Integer roomNumber;

    public PaymentId() {}

    public PaymentId(Integer bookingID, Integer guestID, Integer roomNumber) {
        this.bookingID = bookingID;
        this.guestID = guestID;
        this.roomNumber = roomNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PaymentId)) return false;
        PaymentId that = (PaymentId) o;
        return Objects.equals(bookingID, that.bookingID) &&
                Objects.equals(guestID, that.guestID) &&
                Objects.equals(roomNumber, that.roomNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bookingID, guestID, roomNumber);
    }
}