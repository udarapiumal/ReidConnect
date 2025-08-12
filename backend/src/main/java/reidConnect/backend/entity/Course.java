package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "course")
@Getter
@Setter
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int lectureCredits = 0;

    @Column(nullable = false)
    private int practicalCredits = 0;

    @ManyToMany
    @JoinTable(
            name = "course_lecturers",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "staff_id")
    )
    private Set<Staff> lecturers = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "lecture_venue_id")
    private Venue lectureVenue;

    @ManyToOne
    @JoinColumn(name = "practical_venue_id", nullable = true)
    private Venue practicalVenue;

    @ManyToOne
    @JoinColumn(name = "tutorial_venue_id", nullable = true)
    private Venue tutorialVenue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Degree degree;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Years year;

}
