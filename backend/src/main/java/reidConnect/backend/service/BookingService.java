// BookingService.java
package reidConnect.backend.service;

import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.dto.venue.VenueBookingRequestDto;

public interface BookingService {

    VenueBookingResponseDto createBookingAndEnvelope(VenueBookingRequestDto req) throws Exception;

    String getEmbeddedSigningUrlForClub(Long bookingId, String clubName, String clubEmail) throws Exception;

    String getEmbeddedSigningUrlForSar(Long bookingId, String sarName, String sarEmail) throws Exception;

    String getEmbeddedSigningUrlForUnion(Long bookingId) throws Exception;

    String getEmbeddedSigningUrlForDeputy(Long bookingId) throws Exception;


    void updateStatusFromEnvelope(Long bookingId) throws Exception;

    byte[] downloadSignedPdf(Long bookingId) throws Exception;

    Long findBookingIdByEnvelopeId(String envelopeId);

}
