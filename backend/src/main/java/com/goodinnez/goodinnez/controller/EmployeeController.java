package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.model.Employee;
import com.goodinnez.goodinnez.repository.EmployeeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    private Employee toDTO(com.goodinnez.goodinnez.entity.Employee e) {
        Employee dto = new Employee();
        dto.uniqueID = e.getUniqueID();
        dto.firstName = e.getFirstName();
        dto.lastName = e.getLastName();
        dto.email = e.getEmail();
        dto.phone = e.getPhone();
        dto.position = e.getPosition();
        dto.salary = e.getSalary();
        dto.dateOfBirth = e.getDateOfBirth();
        dto.hireDate = e.getHireDate();
        dto.hotelID = e.getHotel() != null ? e.getHotel().getHotelID() : null;
        return dto;
    }

    @GetMapping
    public List<Employee> getAll() {
        return employeeRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Employee getById(@PathVariable Integer id) {
        return employeeRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @PostMapping
    public Employee create(@RequestBody com.goodinnez.goodinnez.entity.Employee employee) {
        return toDTO(employeeRepository.save(employee));
    }

    @PutMapping("/{id}")
    public Employee update(@PathVariable Integer id, @RequestBody com.goodinnez.goodinnez.entity.Employee details) {
        return employeeRepository.findById(id).map(e -> {
            e.setFirstName(details.getFirstName());
            e.setLastName(details.getLastName());
            e.setEmail(details.getEmail());
            e.setPhone(details.getPhone());
            e.setPosition(details.getPosition());
            e.setSalary(details.getSalary());
            e.setDateOfBirth(details.getDateOfBirth());
            e.setHireDate(details.getHireDate());
            e.setHotel(details.getHotel());
            return toDTO(employeeRepository.save(e));
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        employeeRepository.deleteById(id);
    }
}
