package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.entity.Payment;
import com.goodinnez.goodinnez.entity.PaymentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, PaymentId> {
    @Query("SELECT p FROM Payment p WHERE p.bookingID = :bookingID")
    List<Payment> findByBookingID(@Param("bookingID") Integer bookingID);
}
