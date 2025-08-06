package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "time_table_slots")
@Getter
@Setter
public class TimeTableSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "time_table_id", nullable = false)
    private TimeTable timeTable;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private Slot slot;
}
