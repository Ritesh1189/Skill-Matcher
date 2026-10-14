# Skill Match Job Portal 🚀
### Full-Stack Skill-Based Hiring Platform with Spring Boot, React.js, MongoDB Atlas & Swagger UI

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-green.svg)](https://www.mongodb.com/atlas)
[![OpenAPI / Swagger](https://img.shields.io/badge/API%20Docs-Swagger%20UI%203.0-orange.svg)](http://localhost:8080/swagger-ui.html)
[![License](https://img.shields.io/badge/License-Apache%202.0-lightgrey.svg)](LICENSE)

---

## 1. Project Objective & Problem Statement

**Skill Match Job Portal** is an end-to-end, full-stack recruitment platform designed to eliminate keyword mismatch and opaque candidate screening. Rather than relying on simple text queries or arbitrary resumes, the platform evaluates the structured overlap between a job seeker's verified proficiencies and an employer's requirements.

### Core Problem Solved:
- **For Job Seekers**: Eliminates guesswork by displaying an algorithmic match percentage, highlighting exactly which required skills they satisfy, and pointing out missing proficiencies.
- **For Recruiters**: Automatically scores and ranks incoming applicant pools by skill compatibility, reducing time-to-hire and streamlining interview pipelines.

---

## 2. Technology Stack & System Architecture

| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), Modern Vanilla CSS, Lucide Icons | Interactive, responsive UI with glassmorphism, animated circular progress gauges, and real-time filtering |
| **Backend** | Java 17 / 21 / 25, Spring Boot 3.3.4 | High-throughput REST API, validation rules, skill matching engine, and CORS security |
| **Database** | MongoDB Atlas (Cloud NoSQL) | Scalable document storage for users, jobs, skills lists, and applications |
| **API Docs** | Swagger UI & OpenAPI 3 (`springdoc-openapi` 2.6.0) | Interactive REST endpoint testing, schema inspection, and live sandbox |
| **Build Tools**| Maven 3.9+, Node.js 20+ / npm 10+ | Dependency resolution, packaging, and bundle optimization |

```
                       [ React.js Web Application ] (Port 5173)
                                    |
                         (REST API / HTTP JSON)
                                    v
                   [ Spring Boot 3.3.4 Backend ] (Port 8080)
                   ├── Auth & Candidate Controller
                   ├── Job Listings Controller
                   ├── Skill Matching Engine Service
                   └── Application Tracking Controller
                         |                     \
                         v                      v
             [ MongoDB Atlas Cluster ]    [ Swagger UI / OpenAPI 3 ]
             (users, jobs, applications)  (http://localhost:8080/swagger-ui.html)
```

---

## 3. Skill-Matching Algorithm & Logic

The skill-matching engine implements a transparent, explainable scoring formula:

$$\text{Match score} = \left(\frac{\text{Matched required skills}}{\text{Total required skills}}\right) \times 100$$

### Illustrative Example:
- **Role**: Junior Full-Stack Developer
- **Required Skills**: `Java`, `React`, `SQL`, `Git` (Total = 4)
- **Candidate Skills**: `Java`, `React`, `Git` (Matched = 3)
- **Match Calculation**:
  $$\text{Match score} = \left(\frac{3}{4}\right) \times 100 = 75.0\%$$
- **Tier Classification**:
  - `Strong Match` (score $\ge 80\%$)
  - `Moderate Match` ($50\% \le \text{score} < 80\%$)
  - `Low Match` (score $< 50\%$)
- **Synonym Normalization**: Recognizes equivalent aliases automatically (e.g., `React.js` $\leftrightarrow$ `React`, `SpringBoot` $\leftrightarrow$ `Spring Boot`, `MongoDB` $\leftrightarrow$ `Mongo`, `RESTful APIs` $\leftrightarrow$ `REST APIs`, `K8s` $\leftrightarrow$ `Kubernetes`).

---

## 4. Repository Structure

```
skill-match-job-portal/
├── backend/                               # Spring Boot application
│   ├── pom.xml                            # Maven dependencies & plugins
│   ├── src/main/java/com/skillmatch/
│   │   ├── SkillMatchApplication.java     # Main Spring Boot entrypoint
│   │   ├── config/
│   │   │   ├── CorsConfig.java            # Cross-origin policy configuration
│   │   │   ├── OpenApiConfig.java         # Swagger UI documentation settings
│   │   │   └── MongoConfig.java           # MongoDB Atlas connection & timeout tuning
│   │   ├── controller/
│   │   │   ├── AuthController.java        # User registration and login
│   │   │   ├── CandidateController.java   # Profile & skills management
│   │   │   ├── JobController.java         # Job CRUD & search/filtering
│   │   │   ├── MatchController.java       # Skill matching engine endpoints
│   │   │   ├── ApplicationController.java # Application submission & tracking
│   │   │   └── HealthController.java      # Health check, metadata, & demo seed
│   │   ├── dto/                           # Request/Response data transfer objects
│   │   ├── exception/                     # Global exception handling & 404/400 mapping
│   │   ├── model/                         # MongoDB Document entities (User, Job, Application)
│   │   ├── repository/                    # Spring Data Mongo repositories
│   │   └── service/                       # Business logic & matching engine
│   └── src/test/java/com/skillmatch/      # Unit and integration test suites
│
├── frontend/                              # React.js application (Vite)
│   ├── index.html                         # Typography & viewport setup
│   ├── vite.config.js                     # Proxy to backend port 8080
│   ├── package.json                       # Dependencies (Lucide icons, confetti)
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx                 # Role switcher & navigation
│       │   ├── JobCard.jsx                # Job listing card with live match badge
│       │   ├── JobDetailsModal.jsx        # Detailed job view & matching breakdown
│       │   ├── MatchScoreBadge.jsx        # Radial progress gauge & tier badge
│       │   ├── SkillMatcherCalculator.jsx # Interactive algorithm simulator
│       │   ├── CandidateApplications.jsx  # Candidate application tracking
│       │   ├── RecruiterDashboard.jsx     # Recruiter postings & applicant review
│       │   ├── CandidatePool.jsx          # Talent directory & skill tags
│       │   ├── ProfileModal.jsx           # Profile & skill tag manager
│       │   ├── PostJobModal.jsx           # Recruiter job creation
│       │   └── AuthModal.jsx              # Sign in and registration
│       ├── services/api.js                # Centralized backend HTTP client
│       ├── App.jsx                        # Main application container
│       ├── index.css                      # Design system, glassmorphism, tokens
│       └── main.jsx                       # React DOM entry point
│
├── .env.example                           # Template environment configuration
└── README.md                              # Technical guide & documentation
```

---

## 5. Prerequisites & Environment Setup

### Required Tools:
- **Java Development Kit (JDK)**: Java 17, 21, or 25
- **Apache Maven**: Version 3.8+ (bundled or installed)
- **Node.js**: Version 18+ and `npm` 9+
- **MongoDB Atlas Account**: (Free tier cluster on [mongodb.com/atlas](https://www.mongodb.com/atlas))

---

## 6. MongoDB Atlas Configuration Guide

1. Log in to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Security > Database Access**:
   - Add a new database user (e.g. `skillmatch_admin` with password `SecurePassword123`).
   - Assign Read/Write privileges on all databases.
4. Under **Security > Network Access**:
   - Click **Add IP Address** -> Select **Allow Access From Anywhere** (`0.0.0.0/0`) for local testing.
5. Under **Deployment > Database**:
   - Click **Connect** -> Choose **Drivers** (Java).
   - Copy your connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillmatch_db?retryWrites=true&w=majority
     ```
6. Set the environment variable in your terminal:
   ```powershell
   $env:MONGODB_URI="mongodb+srv://skillmatch_admin:SecurePassword123@cluster0.mongodb.net/skillmatch_db?retryWrites=true&w=majority"
   ```
   *(Note: The backend includes an automated resilient store that safely handles offline demo runs if internet connectivity to Atlas is temporarily interrupted).*

---

## 7. How to Run the Application

### Step 1: Run the Spring Boot Backend
Open a terminal in the `backend/` folder:
```powershell
cd backend
mvn clean spring-boot:run
```
Alternatively, package and run the executable JAR:
```powershell
mvn clean package -DskipTests
java -jar target/skill-match-backend-1.0.0.jar
```
- Backend starts at: `http://localhost:8080`
- Swagger UI documentation available at: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON schema available at: `http://localhost:8080/v3/api-docs`

### Step 2: Run the React Frontend
Open a second terminal in the `frontend/` folder:
```powershell
cd frontend
npm install
npm run dev
```
- Frontend application opens at: `http://localhost:5173`

---

## 8. Swagger UI & REST API Endpoints

Access the live interactive Swagger UI console at:
**`http://localhost:8080/swagger-ui.html`**

### Summary of REST APIs:

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/api/auth/register` | Register new candidate or recruiter |
| | `POST` | `/api/auth/login` | Authenticate existing user |
| | `GET` | `/api/auth/user/{id}` | Get user account by ID |
| **Job Listings** | `GET` | `/api/jobs` | Browse & filter jobs (keyword, location, type, exp) |
| | `GET` | `/api/jobs/{id}` | Get detailed job opening |
| | `POST` | `/api/jobs` | Post new job opening (recruiter) |
| | `PUT` | `/api/jobs/{id}` | Update job listing |
| | `DELETE`| `/api/jobs/{id}` | Remove job opening |
| | `GET` | `/api/jobs/recruiter/{id}` | Retrieve all jobs posted by a recruiter |
| **Skill Matching** | `POST` | `/api/match/calculate` | Calculate match score between skill sets |
| | `GET` | `/api/match/job/{jobId}/candidate/{id}` | Calculate match between specific job & candidate |
| | `GET` | `/api/match/candidate/{id}/jobs` | Retrieve all jobs ranked by match percentage |
| | `GET` | `/api/match/job/{jobId}/candidates` | Retrieve candidate pool ranked for a job |
| **Applications** | `POST` | `/api/applications` | Apply for a job with auto match calculation |
| | `GET` | `/api/applications/candidate/{id}`| Candidate application tracking |
| | `GET` | `/api/applications/job/{id}` | Recruiter view of applicants for a job |
| | `PATCH`| `/api/applications/{id}/status` | Update pipeline stage (Reviewing, Shortlisted, Hired) |
| **System** | `GET` | `/api/health` | System health check & MongoDB status |
| | `POST` | `/api/seed/reset` | Restore demo data (candidates, recruiters, jobs) |
| | `GET` | `/api/meta` | Project technical metadata & formula documentation |

---

## 9. Testing & Evaluation Matrix

As outlined in Section 11 of the project guidance document, all test cases were verified and passed:

| Test Case | Inputs & Scenario | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **1. Exact Overlap Formula** | Job: `Java, React, SQL, Git` (4)<br>Candidate: `Java, React, Git` (3) | Match Score = `75.0%`<br>Matched: 3, Missing: `SQL`<br>Tier: `Moderate Match` | Match Score = `75.0%`<br>Matched: `Java, React, Git`<br>Missing: `SQL` | **PASSED** |
| **2. Full Alignment** | Candidate possesses all required skills plus bonus skills | Match Score = `100.0%`<br>Tier: `Strong Match` | Match Score = `100.0%`<br>Tier: `Strong Match` | **PASSED** |
| **3. Synonym Normalization**| Job: `React.js, SpringBoot, REST APIs`<br>Candidate: `React, Spring Boot, REST API` | Normalized match = `100.0%` | Correctly identified aliases and scored `100.0%` | **PASSED** |
| **4. Zero Overlap** | Job: `Rust, Solidity`<br>Candidate: `Java, Python` | Match Score = `0.0%`<br>Tier: `Low Match` | Match Score = `0.0%`<br>Tier: `Low Match` | **PASSED** |
| **5. Application Workflow**| Candidate applies to job with custom note | Creates application record with match score; increments job applicant counter | Application created with 75.0% match score; job counter incremented | **PASSED** |
| **6. Recruiter Pipeline** | Recruiter changes application stage to `SHORTLISTED` | `PATCH /api/applications/{id}/status` updates status to `SHORTLISTED` | Status updated to `SHORTLISTED` in real time | **PASSED** |
| **7. Swagger UI Testing** | Inspect `/swagger-ui/index.html` and `/v3/api-docs` | HTTP 200 with 19 interactive endpoints documented | HTTP 200, 19 REST endpoints documented | **PASSED** |
| **8. Input Validation** | Submit job with blank title or missing skills | HTTP 400 Bad Request with field error mapping | HTTP 400 Bad Request with field error JSON | **PASSED** |

---

## 10. Viva Preparation & Technical Q&A

*(Directly aligned with Section 15 of the Project Guidance Document)*

#### Q1: What problem does Skill Match Job Portal solve?
> **Answer**: It addresses the challenge job seekers and recruiters face with keyword mismatch and unranked applications. Instead of manual keyword searches, the portal automatically calculates a transparent skill match percentage between candidate profiles and job requirements, helping candidates identify well-aligned roles and recruiters prioritize the most suitable candidates.

#### Q2: Why did you use React.js for the frontend?
> **Answer**: React.js provides a component-driven architecture, efficient Virtual DOM rendering, and reactive state management. This enables instantaneous UI updates, such as live recalculation of match score badges, dynamic filter chips, and interactive modals without full page reloads.

#### Q3: What is Spring Boot, and what role does it play in this project?
> **Answer**: Spring Boot is a modern Java framework for building production-grade enterprise microservices. It acts as the backend REST API layer, managing business logic, validating incoming DTO payloads, executing the skill-matching algorithm, and orchestrating database interactions with MongoDB Atlas.

#### Q4: What is a REST API? Explain the request-response flow in your application.
> **Answer**: A REST (Representational State Transfer) API is an architectural style utilizing standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`). In this project:
> 1. The React frontend sends an HTTP request (e.g. `POST /api/applications` with JSON payload).
> 2. The Spring Boot Controller receives the request, validates the annotations (`@Valid`), and passes it to the Service layer.
> 3. The Service executes business logic (e.g. calculates match score via `SkillMatchingService`).
> 4. The Spring Data MongoDB repository persists the document into MongoDB Atlas.
> 5. The Controller returns a uniform `ApiResponse<T>` JSON envelope back to React to update the view.

#### Q5: Why did you choose MongoDB Atlas for data storage?
> **Answer**: MongoDB Atlas is a cloud-native NoSQL document database. It is ideal for job portals because candidate profiles and job descriptions naturally possess flexible, nested data structures (such as arrays of skills, past experience, and educational credentials). Spring Data MongoDB allows seamless mapping between Java classes and BSON documents with `@Document` annotations.

#### Q6: How does React communicate with the Spring Boot backend?
> **Answer**: React uses modern asynchronous `fetch()` API calls centralized in `src/services/api.js`. In development, the Vite server proxies `/api` requests to `http://localhost:8080`, and Spring Boot's `CorsConfig` manages cross-origin resource sharing.

#### Q7: What is Swagger UI, and how did you use it?
> **Answer**: Swagger UI (integrated via `springdoc-openapi-starter-webmvc-ui`) provides automated, interactive documentation generated directly from Spring Boot annotations (`@Tag`, `@Operation`). It allows developers, evaluators, and recruiters to inspect schemas, explore request/response models, and test live HTTP endpoints directly in the browser at `/swagger-ui.html`.

#### Q8: How are candidate skills represented and compared with job requirements?
> **Answer**: Candidate skills and job requirements are stored as structured `List<String>` collections in MongoDB documents. During comparison, the algorithm normalizes strings by trimming whitespace, converting to lowercase, and mapping common tech synonyms (e.g., `React.js` to `react`).

#### Q9: How is the match score calculated in your implementation?
> **Answer**: The match score is computed using:
> $$\text{Match score} = \left(\frac{\text{Matched required skills}}{\text{Total required skills}}\right) \times 100$$
> It returns a rounded percentage (1 decimal place), along with explicit lists of matched skills, missing skills, and bonus skills.

#### Q10: What validation and error-handling cases did you test?
> **Answer**: Using Jakarta Validation (`@NotBlank`, `@Email`, `@NotEmpty`) and `GlobalExceptionHandler`:
> - Empty or malformed emails return HTTP 400 with descriptive error maps.
> - Missing resources (e.g., nonexistent job ID) throw `ResourceNotFoundException` returning HTTP 404.
> - Duplicate applications to the same job trigger `BadRequestException` returning HTTP 400.
> - Server issues return standard JSON error envelopes without exposing internal stack traces.

#### Q11: How do you protect database credentials and candidate information?
> **Answer**: Secrets and database credentials are kept out of source control. The MongoDB connection URI is injected dynamically through the `MONGODB_URI` environment variable. In client-side code, database credentials are never exposed, as all data persistence is handled securely behind Spring Boot REST controllers.

#### Q12: What are the current limitations and future improvements?
> **Answer**: Current limitations include exact-synonym based string normalization rather than continuous vector embeddings. Future improvements could introduce AI/embedding-based semantic similarity (e.g. Gemini API), automated resume PDF parsing, email notifications for status changes, and OAuth2/JWT security tokens.

---

## 11. Demonstration Walkthrough Steps

1. **Launch the Portal**: Open `http://localhost:5173`.
2. **Explore Job Matching**:
   - Notice the default user **Alex Morgan** (Full Stack Engineer).
   - Review the job cards: observe that "Junior Full-Stack Developer" displays **75% Match** (3 of 4 skills matched: Java, React, Git; missing: SQL), reproducing the project documentation example.
   - Click "View Details & Match Breakdown" to view the mathematical explanation dialog.
3. **Submit an Application**:
   - Write a short note and click **Submit Application**. Confetti triggers and the button status updates to **Applied**.
4. **Try the Skill Matcher Playground**:
   - Click the **Skill Matcher** tab in the top navigation bar.
   - Click the preset button "Project Guidance Example (75%)" or type custom skills to test live recalculations.
5. **Switch Roles to Recruiter**:
   - In the navbar profile dropdown, click **Emma Watson (Recruiter)**.
   - The navigation switches to the **Recruiter Hub**.
   - Review incoming applications for "Junior Full-Stack Developer", inspect Alex Morgan's application and match score, and change the pipeline stage to **Shortlisted** or **Hired**.
6. **Open Swagger UI**:
   - Click the **Swagger API** button in the header or navigate to `http://localhost:8080/swagger-ui.html` to test live endpoints.
