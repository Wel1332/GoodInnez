package com.goodinnez.goodinnez.entity;

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
    private String phone;
    private String address;

    // --- NEW FIELD ---
    private String password; 

    // --- GETTERS AND SETTERS ---
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

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    // --- NEW GETTER/SETTER FOR PASSWORD ---
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}