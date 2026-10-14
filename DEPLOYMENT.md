# 🚀 Skill Match Job Portal — Cloud Deployment Guide

This guide covers how to deploy the full-stack **Skill Match Job Portal** (Spring Boot + React + MongoDB) to free-tier cloud platforms.

---

## 🌟 Architecture Overview

The application is structured for **zero-configuration cloud hosting**:
- **Single-Service Full-Stack Deployment (Recommended)**: The React frontend is compiled and served directly from Spring Boot's static resources. This means:
  - Only **1 single free cloud service** is required (no need for separate paid instances).
  - **Zero CORS issues** because both frontend and API share the exact same domain.
  - Automatically falls back to resilient in-memory storage if MongoDB Atlas is not yet configured.
- **Split Deployment (Optional)**: Frontend on **Vercel** + Backend on **Render/Railway**.

---

## 🛠️ Step 0: Push Code to GitHub

First, initialize and push your project to a GitHub repository:

```bash
git add .
git commit -m "feat: complete skill match portal with Indian employers and cloud deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skill-match-portal.git
git push -u origin main
```

---

## ☁️ Option 1: Render.com (Recommended Free Cloud Hosting)

Render offers a generous free tier for web services and natively supports the included `render.yaml` Blueprint.

### Automated 1-Click Deployment:
1. Sign up or log in at **[render.com](https://render.com/)**.
2. Click **New +** in the top navigation and select **Blueprint**.
3. Connect your GitHub account and select your `skill-match-portal` repository.
4. Render will automatically detect [`render.yaml`](./render.yaml).
5. Click **Apply**.
6. Render will build the container using the root [`Dockerfile`](./Dockerfile) and launch your live application with a public URL:
   ```
   https://skillmatch-portal.onrender.com
   ```

*(Optional)* Under **Environment Variables** in Render, set `MONGODB_URI` to your MongoDB Atlas connection string to persist data permanently across restarts.

---

## 🚂 Option 2: Railway.app (Free Tier / Trial)

1. Sign up at **[railway.app](https://railway.app/)**.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your `skill-match-portal` repository.
4. Railway will automatically detect the root [`Dockerfile`](./Dockerfile).
5. Once built, go to **Settings** → **Networking** → **Generate Domain** to get your public URL:
   ```
   https://skillmatch-portal.up.railway.app
   ```

---

## ⚡ Option 3: Split Deployment (Vercel Frontend + Render Backend)

If you prefer hosting the React frontend on **Vercel** and the Spring Boot backend on **Render**:

### A. Deploy Backend on Render:
1. Go to **Render** → **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Choose **Docker** (it will use `backend/Dockerfile`) or **Maven**:
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -Dserver.port=$PORT -jar target/skill-match-backend-1.0.0.jar`
5. Note your backend URL (e.g. `https://skillmatch-backend.onrender.com`).

### B. Deploy Frontend on Vercel:
1. Log in at **[vercel.com](https://vercel.com/)** → **Add New Project**.
2. Import your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://skillmatch-backend.onrender.com/api`
5. Click **Deploy**. Vercel will build the Vite app and apply [`frontend/vercel.json`](./frontend/vercel.json) for client-side routing.

---

## 📦 Option 4: Run the Standalone Production JAR Locally or on a VPS

You can package and run the entire full-stack app as a single standalone JAR:

### On Windows:
Double-click [`package-app.bat`](./package-app.bat) or run:
```powershell
.\package-app.bat
```

### On Linux / macOS / Server:
```bash
chmod +x package-app.sh
./package-app.sh
```

### Run the Standalone JAR:
```bash
java -jar backend/target/skill-match-backend-1.0.0.jar
```
- Frontend & Gatekeeper: `http://localhost:8080/`
- REST APIs: `http://localhost:8080/api/jobs`

---

## 🐳 Option 5: Local Multi-Container Docker Compose

To test the entire production stack containerized with MongoDB locally:

```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- MongoDB: `localhost:27017`
