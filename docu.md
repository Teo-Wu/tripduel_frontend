# Frontend – Project Documentation

## 1. Project Overview

This repository contains the **frontend** part of the TripDuel project. The application is implemented as a **React single-page application (SPA)** and provides the user interface for managing trips, rankings, and results. The frontend communicates with backend services via REST APIs and is deployed as a containerized application in a Kubernetes cluster.

---

## 2. Contribution & Approach

This documentation covers the **frontend repository** of the TripDuel project.

**Contributor:** Yutong Wu  
**Scope:** Frontend development, containerization, CI/CD pipeline, Kubernetes deployment

### Development Approach

The frontend was developed iteratively alongside the backend services. Key phases included:

1. **Initial Development:** React SPA with Vite, connecting to backend APIs
2. **Containerization:** Dockerizing the application with nginx for production serving
3. **CI/CD Integration:** GitLab pipeline for automated builds and deployments
4. **Kubernetes Deployment:** Helm chart integration with the umbrella chart

---

## 3. Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend Framework | React | 19.x |
| Build Tool | Vite | 7.x |
| Language | JavaScript (JSX) | ES2020+ |
| Routing | react-router-dom (HashRouter) | 7.x |
| State Handling | React Hooks, localStorage | - |
| Styling | CSS | - |
| Runtime (Development) | Node.js | 20.x |
| Web Server (Production) | nginx | 1.27-alpine |
| Containerization | Docker | 28.x |
| Container Orchestration | Kubernetes + Helm | Helm 4.x |
| CI/CD | GitLab CI | - |
| Version Control | GitLab | - |

---

## 4. Project Structure

```
frontend/
├── src/
│   ├── pages/           # Page components (Login, Register, Trips, Ranking, Results, Profile)
│   ├── services/        # API communication with backend services
│   │   ├── tripsService.js
│   │   ├── property/
│   │   └── ranking/
│   ├── css/             # Application styling
│   ├── config.js        # API base URL configuration
│   ├── App.jsx          # Routing and authentication logic
│   └── main.jsx         # Application entry point
├── public/
│   └── config.js        # Runtime configuration template
├── chart/               # Helm chart for Kubernetes deployment
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── ingress.yaml
│       └── _helpers.tpl
├── Dockerfile           # Multi-stage Docker build
├── nginx.conf           # nginx configuration for SPA
├── docker-entrypoint.sh # Runtime environment injection
├── .gitlab-ci.yml       # CI/CD pipeline definition
├── package.json
└── vite.config.js
```

---

## 5. Application Functionality

The frontend provides the following main features:

* User registration and login
* Display and management of trips
* Editing trips
* Ranking of trips
* Display of ranking results
* User profile view

Authentication state is handled using `localStorage`. Depending on the login state, protected routes are either displayed or redirect the user to the login page.

---

## 6. Backend Interfaces (API Usage)

The frontend communicates with backend services via REST APIs. API calls are encapsulated in the `services/` directory.

### Used Services

| Service | Endpoints | Purpose |
|---------|-----------|---------|
| tripsService | `/trips/*` | Trip creation, update, retrieval |
| propertyService | `/properties/*` | Property-related data |
| categoryService | `/categories/*` | Category management |
| imageService | `/images/*` | Image upload and retrieval |
| rankingApi | `/matches/*` | Ranking submission and results |

### Runtime API Configuration

The API base URL is configurable at runtime via environment variable:

```javascript
// src/config.js
export const getApiBase = () => window.CONFIG?.API_BASE_URL || "";
```

This allows the same Docker image to connect to different environments (staging, production) without rebuilding.

The exact API definitions (OpenAPI specification) are provided in the backend repositories.

---

## 7. Local Development Setup

### Option 1: Node.js Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Option 2: Docker Container (Production-like)

```bash
# Build the Docker image
docker build -t tripduel-frontend:local .

# Run with production backend
docker run -p 8080:8080 -e API_BASE_URL="https://gruppe8.sccprak.netd.cs.tu-dresden.de" tripduel-frontend:local
```

The application will be available at `http://localhost:8080`.

> **Note:** Running locally against the production backend may result in CORS errors. Use a browser extension like "CORS Unblock" for testing, or use the Vite dev server with proxy configuration.

---

## 8. Containerization & Docker

### Multi-Stage Build

The Dockerfile uses a multi-stage build for optimal image size:

| Stage | Base Image | Purpose |
|-------|------------|---------|
| Build | `node:20-alpine` | Install dependencies, compile React app |
| Runtime | `nginx:1.27-alpine` | Serve static files (~40MB final image) |

### Key Design Decisions

| Decision | Reason |
|----------|--------|
| nginx over Express | Lighter weight for serving static files |
| Port 8080 | Non-privileged port, security best practice |
| Runtime config injection | Same image for all environments |
| Non-root user | Security best practice |

### nginx Configuration

The `nginx.conf` provides:

* **SPA Routing:** Returns `index.html` for all routes (React Router handles client-side routing)
* **Gzip Compression:** Reduces file transfer sizes
* **Asset Caching:** 1-year cache for versioned assets
* **Health Endpoint:** `/health` for Kubernetes probes
* **Security Headers:** X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

### Runtime Configuration

Environment variables are injected at container startup via `docker-entrypoint.sh`:

```bash
docker run -e API_BASE_URL="https://api.example.com" tripduel-frontend
```

---

## 9. CI/CD Pipeline

The GitLab CI/CD pipeline automates building and publishing:

### Pipeline Stages

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    build    │────▶│  container  │────▶│    chart    │
│             │     │             │     │  (manual/   │
│ npm run     │     │ docker      │     │   on tag)   │
│ build       │     │ buildx      │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

| Stage | Job | Trigger | Output |
|-------|-----|---------|--------|
| test | build | Every push | Verifies build succeeds |
| release | container | Every push | Docker image → GitLab Container Registry |
| release | chart | Git tag or manual | Helm chart → GitLab Helm Registry |

### Container Image Tags

| Condition | Tags Applied |
|-----------|--------------|
| Every commit | `$CI_COMMIT_SHA` |
| Git tag (e.g., `0.1.1`) | `$CI_COMMIT_TAG`, `latest` |

### Multi-Architecture Support

Images are built for both `linux/amd64` and `linux/arm64` using Docker BuildKit.

---

## 10. Kubernetes Deployment

### Helm Chart

The frontend is deployed via Helm chart as part of the TripDuel umbrella chart.

#### Chart Structure

| File | Purpose |
|------|---------|
| `Chart.yaml` | Chart metadata, version |
| `values.yaml` | Configurable defaults |
| `templates/deployment.yaml` | Kubernetes Deployment |
| `templates/service.yaml` | ClusterIP Service |
| `templates/ingress.yaml` | Ingress for external access |

### Deployment Architecture

```
                    https://gruppe8.sccprak.netd.cs.tu-dresden.de
                                        │
                                        ▼
                                  ┌───────────┐
                                  │  Ingress  │
                                  │  (TLS)    │
                                  └─────┬─────┘
                                        │
        ┌───────────────┬───────────────┼───────────────┬───────────────┐
        │               │               │               │               │
        ▼               ▼               ▼               ▼               ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
   │    /    │    │ /users  │    │ /trips  │    │/matches │    │/images  │
   │         │    │         │    │         │    │         │    │         │
   │Frontend │    │  User   │    │Property │    │ Ranking │    │Property │
   │ (nginx) │    │ Service │    │ Service │    │ Service │    │ Service │
   └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### Integration with Umbrella Chart

The frontend is added as a dependency in the deploy repository:

```yaml
# Chart.yaml
dependencies:
  - name: tripduel-frontend
    version: 0.1.1
    repository: https://gitlab.rn.inf.tu-dresden.de/api/v4/projects/145/packages/helm/stable
```

```yaml
# values.yaml
tripduel-frontend:
  enabled: true
  resources:
    requests:
      memory: "64Mi"
    limits:
      memory: "128Mi"
```

### Resource Requirements

| Resource | Request | Limit |
|----------|---------|-------|
| Memory | 64Mi | 128Mi |
| CPU | (not specified) | (not specified) |

The frontend has minimal resource requirements since nginx only serves static files.

---

## 11. Security

### Transport Layer Security (TLS)

All traffic is encrypted via HTTPS:

* **Certificate:** Automatically provisioned via cert-manager with Let's Encrypt
* **Ingress Annotation:** `cert-manager.io/cluster-issuer: letsencrypt-prod`
* **TLS Secret:** Stored in Kubernetes secret `tripduel-tls`

### Application Security

| Measure | Implementation |
|---------|----------------|
| Non-root container | nginx runs as user `nginx` (UID 101) |
| Non-privileged port | Container listens on 8080 (not 80) |
| Security headers | X-Frame-Options, X-Content-Type-Options, X-XSS-Protection |
| No hardcoded secrets | API URL injected at runtime |

### Authentication

User authentication is handled client-side using `localStorage` for session persistence. The backend services validate user credentials and return user IDs for subsequent API calls.

---

## 12. User Manual

### Registration

1. Navigate to the application URL
2. Click "Register"
3. Enter a username and password
4. Click "Register" to create your account

### Login

1. Navigate to the application URL
2. Enter your username and password
3. Click "Login"

### Managing Trips

1. After login, you'll see your trips dashboard
2. Click "Create Trip" to start a new trip
3. Enter a trip name and click "Create"
4. Click on a trip to open the **Trip Edit View**

### Trip Edit View

In the Trip Edit View, you can:

1. **Create Properties:** Add properties (e.g., hotels) to compare
2. **Create Categories:** Add categories (e.g., room, pool, lobby) for comparison criteria
3. **Upload Images:** Select a property and category combination, then upload an image
4. Images will be used later for ranking comparisons

### Ranking

1. Open a trip
2. Navigate to the ranking section
3. Compare images by selecting your preference between two options
4. View results after completing all comparisons

### Profile

1. Click on your username or "Profile"
2. View your account information

---

## 13. Feedback & Criticism

The project offered valuable hands-on experience with:

* Frontend development with React
* Frontend-backend integration via REST APIs
* Containerization with Docker
* CI/CD pipeline development with GitLab
* Kubernetes deployment with Helm

### Suggestions for Improvement

* Clearer initial requirements for deployment topics
* Earlier introduction to Kubernetes concepts

---

## 14. References

* [React Documentation](https://react.dev/)
* [Vite Documentation](https://vitejs.dev/)
* [Docker Documentation](https://docs.docker.com/)
* [Helm Documentation](https://helm.sh/docs/)
* [nginx Documentation](https://nginx.org/en/docs/)