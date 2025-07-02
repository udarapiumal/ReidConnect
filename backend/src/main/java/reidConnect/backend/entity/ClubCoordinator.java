package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "club_coordinators")

public class ClubCoordinator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "club_name", nullable = false, unique = true)
    private String club_name;

    @Column(name = "website", nullable = false, unique = true)
    private String website;

    @Column(name = "profile_picture")
    private String profile_picture;

    @Column(name = "sub_count")
    private Integer sub_count;

    @Column(name = "bio")
    private String bio;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

}
