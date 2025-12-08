package com.goodinnez.goodinnez.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.List;

@Entity
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer hotelID;

    private String name;
    private String address;
    private String phone;
    private String email;
    private String image;
    private Integer stars;
    private LocalTime checkinTime;
    private LocalTime checkoutTime;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "hotel-employee") // <--- ADD UNIQUE NAME
    private List<Employee> employees;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "hotel-room") // <--- ADD UNIQUE NAME
    private List<Room> rooms;

    // ... getters and setters ...
    public Integer getHotelID() { return hotelID; }
    public void setHotelID(Integer hotelID) { this.hotelID = hotelID; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }

    public LocalTime getCheckinTime() { return checkinTime; }
    public void setCheckinTime(LocalTime checkinTime) { this.checkinTime = checkinTime; }

    public LocalTime getCheckoutTime() { return checkoutTime; }
    public void setCheckoutTime(LocalTime checkoutTime) { this.checkoutTime = checkoutTime; }

    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }

    public List<Room> getRooms() { return rooms; }
    public void setRooms(List<Room> rooms) { this.rooms = rooms; }
}