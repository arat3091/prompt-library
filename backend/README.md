# Prompt Manager Backend

Spring Boot backend for the Prompt Manager application.

## Prerequisites

- Java 21 or later
- Maven 3.8.1 or later

## Building

```bash
mvn clean install
```

## Running Locally

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

## Health Check

```bash
curl http://localhost:8080/api/health
```

## H2 Console

Access the in-memory database console at:
`http://localhost:8080/api/h2-console`

Connection details:
- JDBC URL: `jdbc:h2:mem:promptdb`
- Username: `sa`
- Password: (leave empty)

## Running Tests

```bash
mvn test
```

## Development

The application uses:
- Spring Boot 3.3.0
- Java 21
- H2 in-memory database
- JPA/Hibernate ORM
