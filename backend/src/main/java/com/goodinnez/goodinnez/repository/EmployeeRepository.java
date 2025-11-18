package com.goodinnez.goodinnez.repository;

import com.goodinnez.goodinnez.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
}
