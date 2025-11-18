package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.entity.Payment;
import com.goodinnez.goodinnez.entity.PaymentId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, PaymentId> {
}
