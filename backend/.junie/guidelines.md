Project development guidelines (ReidConnect Backend)

This document captures project-specific knowledge to speed up development and reduce friction when building, testing, and debugging this Spring Boot service.

1. Build and configuration

1.1 Tech stack
* Java 21 (set JAVA_HOME accordingly)
* Spring Boot 3.5.x
* Maven (use the provided wrapper: mvnw.cmd on Windows)
* PostgreSQL for runtime persistence

1.2 Build commands (Windows PowerShell)
* Clean + compile + run unit tests:
  .\mvnw.cmd -q clean verify
* Run only tests:
  .\mvnw.cmd -q test
* Run the app (requires local PostgreSQL reachable via configuration):
  .\mvnw.cmd spring-boot:run

1.3 Configuration sources
* Default configuration lives in src/main/resources/application.properties. It currently points to a local PostgreSQL instance and contains mail/JWT settings. Do not rely on these hard-coded secrets; prefer overriding them locally.
* Recommended for local development: override via environment variables, which Spring Boot maps automatically. For example:
  SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD, SECURITY_JWT_SECRET_KEY, SECURITY_JWT_EXPIRATION_TIME
* You can also create src/main/resources/application-local.properties for developer-specific overrides and activate it with: -Dspring.profiles.active=local

1.4 Database
* The app expects a reachable PostgreSQL database and uses spring.jpa.hibernate.ddl-auto=update. For local runs you’ll need a dev DB or use Testcontainers (see Testing) when writing integration tests.

1.5 Static resources and uploads
* Static resources are served from file:src/main/resources/static/ (see spring.web.resources.static-locations). Uploaded files are stored under src/main/resources/static/uploads/ in the current setup.
* For production, consider using an external, non-repo path and tightening access controls.

2. Testing

2.1 Framework
* JUnit 5 via spring-boot-starter-test
* spring-security-test is available for mocking authentication

2.2 Running tests
* Full test suite:
  .\mvnw.cmd -q test
* One test class:
  .\mvnw.cmd -q -Dtest=reidConnect.backend.BackendApplicationTests test
* One test method:
  .\mvnw.cmd -q -Dtest=reidConnect.backend.BackendApplicationTests#smokeTest test

2.3 Existing sample test (created and verified)
* File: src/test/java/reidConnect/backend/BackendApplicationTests.java
* Content: a lightweight smoke test that avoids starting the Spring context. It was executed and passed with the command above.

2.4 Guidelines for adding tests
* Unit tests (preferred for fast feedback)
  - Keep them free of Spring context where possible. Test pure services/utilities by instantiating classes directly.
  - Example structure:
    package reidConnect.backend.somepkg;
    import org.junit.jupiter.api.Test;
    import static org.junit.jupiter.api.Assertions.*;
    class SomeServiceTest {
      @Test void doesThing() { /* arrange/act/assert */ }
    }

* Web slice tests (@WebMvcTest)
  - Use for controller-layer tests with MockMvc. Disable filters if security blocks requests:
    @WebMvcTest(YourController.class)
    @AutoConfigureMockMvc(addFilters = false)
  - Alternatively, include spring-security-test and annotate with @WithMockUser on test methods.

* Data slice tests (@DataJpaTest)
  - Good for repository-layer tests with an in-memory database. If you add H2 as a test-scoped dependency, Spring Boot will auto-configure it for @DataJpaTest.
  - Override datasource for the test scope if needed via @TestPropertySource or application-test.properties.

* End-to-end/integration tests (with DB)
  - Prefer Testcontainers to avoid coupling to a developer’s local Postgres. Suggested dependencies (test scope):
    org.testcontainers:testcontainers
    org.testcontainers:junit-jupiter
    org.testcontainers:postgresql
  - Example snippet:
    @Testcontainers
    @SpringBootTest
    class PostgresIT {
      @Container static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");
      @DynamicPropertySource static void reg(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", pg::getJdbcUrl);
        r.add("spring.datasource.username", pg::getUsername);
        r.add("spring.datasource.password", pg::getPassword);
      }
    }

* Security in tests
  - For MVC tests: use @WithMockUser or addFilters = false on @AutoConfigureMockMvc.
  - For full-context tests: you can inject a JwtEncoder mock or supply a test key via @TestPropertySource.

2.5 Common pitfalls specific to this project
* Loading the full Spring context (@SpringBootTest) without providing a DB will fail because application.properties points to a real PostgreSQL instance. Use unit tests, slice tests, or Testcontainers for integration.
* Avoid tests that depend on real email or external services configured in application.properties; mock such interactions.

3. Additional development notes

3.1 Lombok
* The project uses Lombok. Ensure annotation processing is enabled in your IDE. The Maven build already configures the lombok annotationProcessor path.

3.2 Code style and structure
* Follow existing package layout: controller, service, service.impl, repository, dto, entity, enums, mapper, util.
* Keep business logic in services; controllers should be thin and return DTOs/responses.

3.3 Configuration hygiene
* Do not commit real secrets (DB, JWT, mail). Prefer environment variables or a non-committed application-local.properties. Review application.properties during PRs.

3.4 Logging and SQL visibility
* Hibernate SQL logging is enabled (DEBUG/TRACE). This is helpful in dev but noisy in CI; consider reducing via profiles if needed.

3.5 Static files
* Serving static/uploads from the repo path is convenient for dev but not ideal for production. Consider externalizing the path and tightening the SecurityConfiguration for those endpoints.

3.6 Troubleshooting tips
* If tests are slow or flaky, check for accidental @SpringBootTest usage where a slice/unit test would suffice.
* If controller tests 403/401, verify security configuration in tests (use @WithMockUser or disable filters for the test).
* If serialization fails for java.time types, note jackson-datatype-jsr310 is on the classpath; ensure ObjectMapper is correctly configured if creating custom mappers.
