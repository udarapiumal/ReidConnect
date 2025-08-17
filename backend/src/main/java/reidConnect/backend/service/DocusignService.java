// DocusignService.java
package reidConnect.backend.service;

import java.util.Map;

public interface DocusignService {

    String createEnvelopeForBooking(
            Long bookingId,
            String htmlBody,
            String clubSignerName, String clubSignerEmail, String clubClientUserId,
            String sarSignerName, String sarSignerEmail, String sarClientUserId,
            String unionName, String unionEmail, String unionClientUserId,
            String deputyName, String deputyEmail, String deputyClientUserId
    ) throws Exception;

    String createRecipientViewUrl(String envelopeId, String signerName, String signerEmail, String clientUserId, String stateQueryParam) throws Exception;

    byte[] downloadCombinedDocument(String envelopeId) throws Exception;

    Map<String, String> getEnvelopeFormData(String envelopeId) throws Exception;

    String getEnvelopeStatus(String envelopeId) throws Exception;

    Map<String, String> getRecipientStatus(String envelopeId) throws Exception;


}
