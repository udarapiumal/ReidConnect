package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "post")

public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id", referencedColumnName = "id", nullable = false)
    private Club club;

    @Column(name = "description", length = 500)
    private String description;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", referencedColumnName = "id", nullable = true)
    private Event event;

    @Column(name = "active", nullable = false)
    private boolean active = true;


}
