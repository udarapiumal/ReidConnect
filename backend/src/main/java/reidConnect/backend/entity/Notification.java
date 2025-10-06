package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import reidConnect.backend.enums.NotificationAudienceScope;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String title;         // "New Like!"
    @Column(length = 1000)
    private String message;       // "John liked your photo"
    private String type;          // e.g. LIKE, COMMENT, FOLLOW, SYSTEM
    private String senderUserId;  // optional: who triggered

    @Enumerated(EnumType.STRING)
    private NotificationAudienceScope audienceScope; // INDIVIDUAL, ROLE, ALL, MULTI
    private String targetRole; // when audienceScope == ROLE

    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String metadata; // optional JSON

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<NotificationRecipient> recipients = new ArrayList<>();
    
    // This runs automatically before saving
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
