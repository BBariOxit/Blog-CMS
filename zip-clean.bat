@echo off
echo ========================================
echo   Tao file nen SOURCE ONLY (khong node_modules)
echo ========================================
echo.

REM Di chuyen ra ngoai thu muc cha
cd ..

REM Kiem tra WinRAR
where WinRAR >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] WinRAR khong duoc cai dat!
    echo Vui long su dung CACH 2 trong file huong dan.
    pause
    exit /b 1
)

REM Nen voi cau hinh loai tru node_modules
echo [INFO] Dang nen du an... (chi source code)
WinRAR a -afzip -r -ep1 ^
    -x*\node_modules\* ^
    -x*\.git\* ^
    -x*\dist\* ^
    -x*\build\* ^
    -x*\uploads\* ^
    -x*.env ^
    -x*.log ^
    -x*.db_seeded ^
    -x*.rar ^
    -x*.zip ^
    "Blog-CMS-Source-Clean.zip" "Blog-CMS"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Nen thanh cong!
    dir Blog-CMS-Source-Clean.zip
) else (
    echo [ERROR] Nen that bai!
)

cd Blog-CMS
pause
