# Clinic Management System - Backend

Backend of Clinic Management System. This project is built using **Java 21**, **Spring Boot 3.2.4** and **PostgreSQL**.

---

## Project Structure & Layered Architecture

To maintain high code quality and scalability, we follow a **Strict Layered Architecture**. Every database table from our `init.sql` must have a corresponding set of classes across these packages inside `pl.polsl.clinic`:

### 1. `.entity` (Entities)
* **Purpose:** Maps 1:1 to the PostgreSQL database tables using JPA.
* **Naming:** Singular table name (e.g., `Patient.java`, `Doctor.java`).
* **Requirement:** Use `@Entity` and `@Table(name = "table_name")`.

### 2. `.repository` (Repositories)
* **Purpose:** Data Access Layer. These are interfaces that extend `JpaRepository`.
* **Naming:** `[EntityName]Repository` (e.g., `PatientRepository.java`).
* **Note:** Spring Data JPA automatically generates SQL queries based on method names.

### 3. `.service` (Business Logic)
* **Purpose:** The "brain" of the app. All calculations, validations, and mapping go here.
* **Naming:** `[EntityName]Service` (e.g., `PatientService.java`).
* **Requirement:** Must be annotated with `@Service`.

### 4. `.dto` (Data Transfer Objects)
* **Purpose:** Objects used for API communication. We **never** return Entities directly to the frontend for security and decoupling.
* **Naming:** `[EntityName]DTO` (e.g., `PatientDTO.java`).
* **Note:** Use Java `record` for clean, immutable data carriers.

### 5. `.controller` (REST Controllers)
* **Purpose:** Exposes API endpoints for the React frontend.
* **Naming:** `[EntityName]Controller` (e.g., `PatientController.java`).
* **Requirement:** Annotated with `@RestController` and `@RequestMapping("/api/v1/[resource]")`.

---

## Configuration & Database

### `src/main/resources/application.yml`
Our main configuration. It uses environment variables (e.g., `${DB_USER}`) to pull data from your local `.env` file.
* **Rule:** Do NOT hardcode passwords, ports, or usernames here or anywhere in the repository!

### `src/main/resources/db/init.sql`
Contains DDL and initial dictionary data.
* **Database Initialization:** Docker runs this script only when the volume is created for the first time.
* **Update Tip:** If you change `init.sql`, reset your local DB using:
  `docker-compose down -v && docker-compose up -d`

---

## Development Guidelines

1. **Environment Variables:** Inject your `.env` variables into your IntelliJ **Run Configuration** (Environment Variables field).
2. **Standard Workflow:** For every new feature:
    * Create a new branch: `feature/your-task-name`.
    * Implement: Entity -> Repository -> DTO -> Service -> Controller.
    * Open a **Pull Request (PR)** to `main` for review.
3. **No Direct Push:** Pushing directly to `main` is disabled. Every change requires a code review.
4. **Code Style:** Use `Ctrl + Alt + L` (IntelliJ) to format your code before every commit.

---