@echo off
setlocal enabledelayedexpansion

:: Load .env variables
for /f "usebackq tokens=1,2 delims==" %%a in ("./.env") do (
    set %%a=%%b
)

:: Connect to DB
set PGPASSWORD=%DB_PASSWORD%
"%PSQL_PATH%" -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_NAME%

endlocal