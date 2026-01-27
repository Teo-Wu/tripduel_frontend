# Frontend – Project Documentation

## 1. Project Overview

This repository contains the **frontend** part of the project. The application is implemented as a **React single-page application (SPA)** and provides the user interface for managing trips, rankings, and results. The frontend communicates with backend services via REST APIs.

---

## 2. Team Information

* **Name:** Yutong Wu
* **Role:** Frontend & part of user service
* **other Backend & Deployment:** Implemented by other team member(s)

---

## 3. Technology Stack

* **Frontend Framework:** React
* **Language:** JavaScript (JSX)
* **Routing:** react-router-dom (HashRouter)
* **State Handling:** React Hooks, localStorage
* **Styling:** CSS
* **Runtime:** Node.js (recommended: v18)
* **Version Control:** GitLab

---

## 4. Project Structure

```
src/
 ├─ pages/        # Page components (Login, Register, Trips, Ranking, Results, Profile)
 ├─ services/     # API communication with backend services
 │   ├─ tripsService.js
 │   ├─ property/
 │   └─ ranking/
 ├─ css/          # Application styling
 ├─ App.jsx       # Routing and authentication logic
 └─ main.jsx      # Application entry point
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

* **tripsService** – trip creation, update, retrieval
* **rankingApi** – submission and retrieval of rankings
* **propertyService** – property-related data
* **imageService / imageApi** – image handling

The exact API definitions (OpenAPI specification) are provided in the backend repository.

---

## 7. Local Development Setup

To run the frontend locally:

```bash
npm install
npm run dev
```

The application will be available in the browser at the configured local development address.

---

## 8. Deployment Context

The backend services are deployed using Docker orchestration (Kubernetes) by the backend team.

The frontend is deployed as a static web application using GitHub Pages:

https://teo-wu.github.io/tripduel_frontend/

---

## 9. Feedback and Criticism

The project offered valuable hands-on experience with frontend development and frontend-backend integration. Clearer initial requirements and more time dedicated to deployment topics would further improve the practical course.
