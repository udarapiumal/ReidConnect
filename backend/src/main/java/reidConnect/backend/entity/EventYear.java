package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import reidConnect.backend.enums.Years;

@Entity
@Table(name = "event_year")
@Getter @Setter @NoArgsConstructor
public class EventYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "year", nullable = false)
    private Years year;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    public EventYear(Years year, Event event) {
        this.year = year;
        this.event = event;
    }
}
