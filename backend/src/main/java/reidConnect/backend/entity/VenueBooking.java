package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import reidConnect.backend.enums.VenueBookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    // Club making the request
    @ManyToOne(optional = false)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    // Requested venue
    @ManyToOne(optional = false)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    // Requested date
    @Column(name = "requested_date", nullable = false)
    private LocalDate requestedDate;

    // Reason for booking
    @Column(name = "reason", nullable = false, length = 1000)
    private String reason;

    // Applicant details
    @Column(name = "applicant_name", nullable = false)
    private String applicantName;

    @Column(name = "registration_number", nullable = false)
    private String registrationNumber;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "signature")
    private String signature; // This can be a base64 image or path to stored file

    @Column(name = "form_signed_date", nullable = false)
    private LocalDateTime formSignedDate;

    // Clerk response
    @Column(name = "clerk_approved")
    private Boolean clerkApproved;

    @Column(name = "clerk_signature")
    private String clerkSignature;

    @Column(name = "clerk_signed_date")
    private LocalDateTime clerkSignedDate;

    // Hall coordinator signature
    @Column(name = "hall_coordinator_signature")
    private String hallCoordinatorSignature;

    @Column(name = "hall_coordinator_signed_date")
    private LocalDateTime hallCoordinatorSignedDate;

    // Deputy director approval
    @Column(name = "deputy_director_signature")
    private String deputyDirectorSignature;

    @Column(name = "deputy_director_signed_date")
    private LocalDateTime deputyDirectorSignedDate;

    // SAR approval
    @Column(name = "sar_signature")
    private String sarSignature;

    @Column(name = "sar_signed_date")
    private LocalDateTime sarSignedDate;

    // Caretaker assignment
    @Column(name = "caretaker_signature")
    private String caretakerSignature;

    @Column(name = "caretaker_signed_date")
    private LocalDateTime caretakerSignedDate;

    // Slots assigned
    @OneToMany(mappedBy = "venueBooking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VenueBookingSlot> bookingSlots;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VenueBookingStatus status = VenueBookingStatus.PENDING;

}
