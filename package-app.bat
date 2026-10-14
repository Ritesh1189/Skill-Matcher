@echo off
echo ===================================================
echo Packaging Skill Match Portal Full-Stack Production
echo ===================================================

cd frontend
echo [1/3] Building React Frontend with Vite...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Frontend build failed!
    exit /b %ERRORLEVEL%
)

cd ..
echo [2/3] Copying Frontend Static Assets into Spring Boot...
if not exist "backend\src\main\resources\static" mkdir "backend\src\main\resources\static"
xcopy /E /I /Y "frontend\dist\*" "backend\src\main\resources\static\"

cd backend
echo [3/3] Compiling and Packaging Spring Boot Executable JAR...
call mvn clean package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo Maven package failed!
    exit /b %ERRORLEVEL%
)

cd ..
echo ===================================================
echo SUCCESS! Full-Stack Standalone JAR created at:
echo backend\target\skill-match-backend-1.0.0.jar
echo.
echo Run anywhere with:
echo java -jar backend\target\skill-match-backend-1.0.0.jar
echo ===================================================
pause
