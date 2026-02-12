package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.CourseType;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Groups;
import reidConnect.backend.enums.Years;

import java.util.Set;

@Entity
@Table(name = "time_table")
@Getter
@Setter
public class TimeTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String day;

    @Enumerated(EnumType.STRING)
    private CourseType courseType;

    @Enumerated(EnumType.STRING)
    @Column(name = "group_type", nullable = true)
    private Groups group;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "academic_calendar_id", nullable = false)
    private AcademicCalendar academicCalendar;

    @OneToMany(mappedBy = "timeTable", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TimeTableSlot> slots;

}
