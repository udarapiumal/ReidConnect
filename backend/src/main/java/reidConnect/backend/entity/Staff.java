package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.AcademicRank;

@Entity
@Table(name = "staff")
@Getter
@Setter
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 3, nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Faculties faculty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AcademicRank rank;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String degree;

}
