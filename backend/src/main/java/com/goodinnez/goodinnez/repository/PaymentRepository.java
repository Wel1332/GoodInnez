package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.model.Payment;
import com.goodinnez.goodinnez.model.PaymentId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, PaymentId> {
}
