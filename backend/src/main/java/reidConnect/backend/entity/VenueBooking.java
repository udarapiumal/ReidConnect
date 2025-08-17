// VenueBooking.java
package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import reidConnect.backend.enums.BookingStatus;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "venue_booking")

public class VenueBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Venue venue;

    @ManyToMany
    @JoinTable(name = "booking_slots",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "slot_id"))
    private List<Slot> slots = new ArrayList<>();

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id", referencedColumnName = "id", nullable = false)
    private Club clubId;

    @Column(nullable = false)
    private String clubName;

    @Column(nullable = false)
    private String registrationNumber;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    private String envelopeId; // DocuSign Envelope
}
