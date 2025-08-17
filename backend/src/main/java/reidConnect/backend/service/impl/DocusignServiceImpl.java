package reidConnect.backend.service.impl;

import com.docusign.esign.api.EnvelopesApi;
import com.docusign.esign.client.ApiClient;
import com.docusign.esign.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reidConnect.backend.config.DocusignClient;
import reidConnect.backend.config.DocusignProperties;
import reidConnect.backend.service.DocusignService;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocusignServiceImpl implements DocusignService {

    private final DocusignClient dsClient;
    private final DocusignProperties props;

    @Override
    public String createEnvelopeForBooking(
            Long bookingId,
            String htmlBody,
            String clubSignerName, String clubSignerEmail, String clubClientUserId,
            String sarSignerName, String sarSignerEmail, String sarClientUserId,
            String unionName, String unionEmail, String unionClientUserId,
            String deputyName, String deputyEmail, String deputyClientUserId
    ) throws Exception
    {

        // Document
        Document doc = new Document()
                .documentBase64(Base64.getEncoder().encodeToString(htmlBody.getBytes(StandardCharsets.UTF_8)))
                .name("Venue Booking Request")
                .fileExtension("html")
                .documentId("1");

        // Club Tabs: Checkbox + SignHere
        Checkbox clubAccept = new Checkbox()
                .tabLabel("accept_terms")
                .selected("false")
                .anchorString("##TERMS_CHECK##")
                .anchorUnits("pixels")
                .anchorYOffset("0");

        SignHere clubSign = new SignHere()
                .anchorString("##CLUB_SIGN##")
                .anchorUnits("pixels")
                .anchorYOffset("10")
                .tabLabel("CLUB_SIGN");

        Tabs clubTabs = new Tabs()
                .checkboxTabs(List.of(clubAccept))
                .signHereTabs(List.of(clubSign));

        Signer clubSigner = new Signer()
                .email(clubSignerEmail)
                .name(clubSignerName)
                .recipientId("1")
                .routingOrder("1")
                .clientUserId(clubClientUserId)
                .tabs(clubTabs);

        // SAR SignHere
        SignHere sarSign = new SignHere()
                .anchorString("##SAR_SIGN##")
                .anchorUnits("pixels")
                .anchorYOffset("10")
                .tabLabel("SAR_SIGN");

        Tabs sarTabs = new Tabs()
                .signHereTabs(List.of(sarSign));

        Signer sarSigner = new Signer()
                .email(sarSignerEmail)
                .name(sarSignerName)
                .recipientId("2")
                .routingOrder("2")
                .clientUserId(sarClientUserId)
                .tabs(sarTabs);

// Union SignHere
        SignHere unionSign = new SignHere()
                .anchorString("##UNION_SIGN##")
                .anchorUnits("pixels")
                .anchorYOffset("10")
                .tabLabel("UNION_SIGN");

        Tabs unionTabs = new Tabs().signHereTabs(List.of(unionSign));

        Signer unionSigner = new Signer()
                .email(unionEmail)
                .name(unionName)
                .recipientId("3")
                .routingOrder("3")
                .clientUserId(unionClientUserId)
                .tabs(unionTabs);

// Academic Deputy Director SignHere
        SignHere deputySign = new SignHere()
                .anchorString("##DEPUTY_SIGN##")
                .anchorUnits("pixels")
                .anchorYOffset("10")
                .tabLabel("DEPUTY_SIGN");

        Tabs deputyTabs = new Tabs().signHereTabs(List.of(deputySign));

        Signer deputySigner = new Signer()
                .email(deputyEmail)
                .name(deputyName)
                .recipientId("4")
                .routingOrder("4")
                .clientUserId(deputyClientUserId)
                .tabs(deputyTabs);

// Add all signers
        Recipients recipients = new Recipients()
                .signers(List.of(clubSigner, sarSigner, unionSigner, deputySigner));


        EnvelopeDefinition env = new EnvelopeDefinition()
                .emailSubject("Venue Booking #" + bookingId)
                .documents(List.of(doc))
                .recipients(recipients)
                .status("sent");

        ApiClient api = dsClient.getApiClient();
        EnvelopesApi envelopesApi = new EnvelopesApi(api);
        EnvelopeSummary summary = envelopesApi.createEnvelope(props.getAccountId(), env);

        return summary.getEnvelopeId();
    }

    @Override
    public String createRecipientViewUrl(String envelopeId, String signerName, String signerEmail, String clientUserId, String stateQueryParam) throws Exception {
        ApiClient api = dsClient.getApiClient();
        EnvelopesApi envelopesApi = new EnvelopesApi(api);

        RecipientViewRequest viewRequest = new RecipientViewRequest()
                .authenticationMethod("none")
                .email(signerEmail)
                .userName(signerName)
                .clientUserId(clientUserId)
                .returnUrl(props.getAppBaseUrl() + props.getReturnPath() + "?state=" + stateQueryParam + "&envelopeId=" + envelopeId);

        ViewUrl viewUrl = envelopesApi.createRecipientView(props.getAccountId(), envelopeId, viewRequest);
        return viewUrl.getUrl();
    }

    @Override
    public byte[] downloadCombinedDocument(String envelopeId) throws Exception {
        ApiClient api = dsClient.getApiClient();
        EnvelopesApi envelopesApi = new EnvelopesApi(api);
        return envelopesApi.getDocument(props.getAccountId(), envelopeId, "combined");
    }

    @Override
    public Map<String, String> getEnvelopeFormData(String envelopeId) throws Exception {
        ApiClient api = dsClient.getApiClient();
        EnvelopesApi envelopesApi = new EnvelopesApi(api);
        EnvelopeFormData formData = envelopesApi.getFormData(props.getAccountId(), envelopeId);

        return formData.getFormData().stream()
                .collect(Collectors.toMap(
                        FormDataItem::getName,
                        FormDataItem::getValue
                ));
    }

    @Override
    public String getEnvelopeStatus(String envelopeId) throws Exception {
        ApiClient api = dsClient.getApiClient();
        EnvelopesApi envelopesApi = new EnvelopesApi(api);
        Envelope envelope = envelopesApi.getEnvelope(props.getAccountId(), envelopeId);
        return envelope.getStatus();
    }

    @Override
    public Map<String, String> getRecipientStatus(String envelopeId) throws Exception {
        ApiClient api = dsClient.getApiClient();
        EnvelopesApi envelopesApi = new EnvelopesApi(api);

        Recipients recipients = envelopesApi.listRecipients(props.getAccountId(), envelopeId);

        return recipients.getSigners().stream()
                .collect(Collectors.toMap(
                        Signer::getRecipientId,
                        Signer::getStatus
                ));
    }


}
