package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "occupied_staff",
        uniqueConstraints = @UniqueConstraint(columnNames = {"staff_id", "day", "slot_id"})
)
@Getter
@Setter
public class OccupiedStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @Column(nullable = false)
    private String day; // e.g. "MONDAY"

    @ManyToOne(optional = false)
    @JoinColumn(name = "slot_id")
    private Slot slot;

    @ManyToOne(optional = false)
    @JoinColumn(name = "time_table_id")
    private TimeTable timeTable;
}
