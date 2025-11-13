package com.goodinnez.goodinnez.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer guestID;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String email;
    private String address;
    private String phone;

    // Getters and Setters
    public Integer getGuestID() { return guestID; }
    public void setGuestID(Integer guestID) { this.guestID = guestID; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}