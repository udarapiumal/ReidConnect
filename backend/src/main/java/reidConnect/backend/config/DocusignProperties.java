package reidConnect.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "docusign")
@Getter
@Setter
public class DocusignProperties {

    private String accountId;
    private String basePath;
    private String authServer;

    private String clientId;
    private String impersonatedUserId;
    private String rsaPrivateKeyFile;

    private String appBaseUrl;
    private String returnPath;

}
