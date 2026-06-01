package myapp.gestion_reservation.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "rooms")
public class Room {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String imageUrl;
    private String category;
    private String bedType;
    private BigDecimal pricePerNight;
    private String description;
    private Number capacity;
    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();


    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", category='" + category + '\'' +
                ", pricePerNight=" + pricePerNight +
                ", roomPhotoUrl='" + imageUrl + '\'' +
                ", roomDescription='" + description + '\'' +
                '}';
    }
}