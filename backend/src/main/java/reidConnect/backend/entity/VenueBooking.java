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
    @JoinTable(
            name = "booking_slots",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "slot_id")
    )
    private List<Slot> slots = new ArrayList<>();

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id", referencedColumnName = "id", nullable = false)
    private User club;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sar_id", referencedColumnName = "id")
    private User sar; // null until approved

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "final_signer_id", referencedColumnName = "id")
    private User finalSigner; // null until signed by final authority

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

    // --- Signature fields ---
    @Column(columnDefinition = "TEXT")
    private String bookingData; // serialized dto JSON

    @Column(name = "club_signature", columnDefinition = "TEXT")
    private String clubSignature;

    @Column(name = "sar_signature", columnDefinition = "TEXT")
    private String sarSignature;

    @Column(name = "final_signature", columnDefinition = "TEXT")
    private String finalSignature;

    // Simplified binary column mappings - let Hibernate handle the type mapping
    @Column(name = "club_signature_image")
    private byte[] clubSignatureImage;

    @Column(name = "sar_signature_image")
    private byte[] sarSignatureImage;

    @Column(name = "final_signature_image")
    private byte[] finalSignatureImage;
}