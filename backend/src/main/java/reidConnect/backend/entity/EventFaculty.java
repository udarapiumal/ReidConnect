package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import reidConnect.backend.enums.Faculties;

@Entity
@Table(name = "event_faculty")
@Getter
@Setter
@NoArgsConstructor
public class EventFaculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "faculty", nullable = false)
    private Faculties faculty;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    public EventFaculty(Faculties faculty, Event event) {
        this.faculty = faculty;
        this.event = event;
    }
}
