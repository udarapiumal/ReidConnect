package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "occupied_venue",
        uniqueConstraints = @UniqueConstraint(columnNames = {"venue_id", "day", "slot_id"})
)
@Getter
@Setter
public class OccupiedVenue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @Column(nullable = false)
    private String day; // e.g. "MONDAY"

    @ManyToOne(optional = false)
    @JoinColumn(name = "slot_id")
    private Slot slot;

    @ManyToOne(optional = false)
    @JoinColumn(name = "time_table_id")
    private TimeTable timeTable;
}
