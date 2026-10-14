#!/usr/bin/env bash
set -e

echo "==================================================="
echo "Packaging Skill Match Portal Full-Stack Production"
echo "==================================================="

echo "[1/3] Building React Frontend with Vite..."
cd frontend
npm ci
npm run build
cd ..

echo "[2/3] Copying Frontend Static Assets into Spring Boot..."
mkdir -p backend/src/main/resources/static
cp -r frontend/dist/* backend/src/main/resources/static/

echo "[3/3] Compiling and Packaging Spring Boot Executable JAR..."
cd backend
mvn clean package -DskipTests
cd ..

echo "==================================================="
echo "SUCCESS! Standalone JAR created at:"
echo "backend/target/skill-match-backend-1.0.0.jar"
echo "==================================================="
