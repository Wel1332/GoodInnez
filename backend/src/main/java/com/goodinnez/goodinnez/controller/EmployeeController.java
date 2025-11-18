package com.goodinnez.goodinnez.controller;

import com.goodinnez.goodinnez.dto.EmployeeDTO;
import com.goodinnez.goodinnez.model.Employee;
import com.goodinnez.goodinnez.repository.EmployeeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    private EmployeeDTO toDTO(Employee e) {
        EmployeeDTO dto = new EmployeeDTO();
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
    public List<EmployeeDTO> getAll() {
        return employeeRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public EmployeeDTO getById(@PathVariable Integer id) {
        return employeeRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @PostMapping
    public EmployeeDTO create(@RequestBody Employee employee) {
        return toDTO(employeeRepository.save(employee));
    }

    @PutMapping("/{id}")
    public EmployeeDTO update(@PathVariable Integer id, @RequestBody Employee details) {
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
