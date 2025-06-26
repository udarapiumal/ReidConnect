package com.reid_connect.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "student")
@Getter
@Setter
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; // internal PK

    @Column(name = "student_id", unique = true, nullable = false)
    private String studentId;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    @Column(nullable = false)
    private int age;

    // Optionally link to User
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}