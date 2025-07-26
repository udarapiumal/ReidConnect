package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name="lost_items")
@Getter
@Setter
public class LostandFound {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String category;
    private String description;
    private String location;
    private LocalDate dateLost;
    private String imagePath;
    private String posterName;
    private String contactNumber;
}
