package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "student")
@Getter
@Setter
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;


    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;
}
