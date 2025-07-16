package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import reidConnect.backend.enums.CapacityRange;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "venue")
@NoArgsConstructor

public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "capacity_range")
    private CapacityRange capacityRange;

}
