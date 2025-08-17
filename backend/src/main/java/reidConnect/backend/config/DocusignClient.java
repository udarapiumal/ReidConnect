// DocusignClient.java
package reidConnect.backend.config;

import com.docusign.esign.client.ApiClient;
import com.docusign.esign.client.auth.OAuth;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DocusignClient {

    private final DocusignProperties props;
    private final ResourceLoader resourceLoader;

    private ApiClient apiClient;
    private Instant tokenExpiresAt = Instant.EPOCH;

    public synchronized ApiClient getApiClient() throws Exception {
        if (apiClient == null) {
            apiClient = new ApiClient(props.getBasePath());
        }
        if (Instant.now().isAfter(tokenExpiresAt.minusSeconds(60))) {
            refreshJwtToken();
        }
        return apiClient;
    }

    private void refreshJwtToken() throws Exception {
        ApiClient client = (apiClient == null) ? new ApiClient(props.getBasePath()) : apiClient;
        client.setOAuthBasePath(props.getAuthServer());

        Resource res = resourceLoader.getResource(props.getRsaPrivateKeyFile());
        String privateKey = new String(res.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        OAuth.OAuthToken oAuthToken = client.requestJWTUserToken(
                props.getClientId(),
                props.getImpersonatedUserId(),
                Arrays.asList("signature","impersonation"),
                privateKey.getBytes(StandardCharsets.UTF_8),
                3600);

        client.addDefaultHeader("Authorization", "Bearer " + oAuthToken.getAccessToken());
        apiClient = client;
        tokenExpiresAt = Instant.now().plusSeconds(oAuthToken.getExpiresIn());
    }
}
