@echo off
set app_alias=DepotAir
set keystore_name=DepotAir.jks
rem set app_alias=antrian-online
rem set keystore_name=layanan-antrian-online.jks
set app_name=AwanApp
set app_name_release=%app_name% Release
set app_unsigned=app-release.apk
set back=../../../../../..
set CURRENT_DATE=%date:~10,4%-%date:~4,2%-%date:~7,2% %time:~0,2%;%time:~3,2%
set CURRENT_DATE=%date:~6,4%-%date:~3,2%-%date:~0,2% %time:~0,2%;%time:~3,2%
set output_folder=outputs
set output_path=android\app\build\outputs\apk\release
set sass_master=scss/master.scss
set sass_output=www/css/style.css
set rundevice=react-native run-android



IF [%1]==[] GOTO NOARGS
IF [%1]==[build] GOTO BUILDAPK
IF [%1]==[release] GOTO RELEASE
IF [%1]==[sign] GOTO SIGNAPK
IF [%1]==[mv] GOTO MOVEAPK
IF [%1]==[mvb] GOTO MOVEPROMPT
IF [%1]==[serve] GOTO SERVE
IF [%1]==[run] GOTO RUNDROID
IF [%1]==[sass] GOTO WATCHSASS
IF [%1]==[output] GOTO CDOUTPUT
IF [%1]==[hp] GOTO DEVICE
IF [%1]==[connect] GOTO WIRELESSDEBUG
IF [%1]==[start] GOTO STARTSERVER
IF [%1]==[clean] GOTO CLEANGRADLE
IF [%1]==[cleanr] GOTO CLEANRUN

GOTO NOARGS

:CDOUTPUT
explorer %output_folder%
GOTO END

:STARTSERVER
react-native start
GOTO END

:DEVICE
adb devices
GOTO END

:WIRELESSDEBUG
IF [%2]==[] (
  GOTO WIRELESSDEBUGWITHIP
) ELSE (
  SET device_ip_address=%2
  GOTO LOOP
)
:WIRELESSDEBUGWITHIP
SET /P device_ip_address=Enter the Device IP Address: 
:LOOP
adb disconnect
adb tcpip 5555
SET /P USBDC=Are the USB is Disconnected (Y/N)? 
IF /I "%USBDC%" NEQ "Y" GOTO LOOP
adb connect %device_ip_address%:5555
echo.
adb devices
GOTO END

:SERVE
ionic serve
GOTO END

:MOVEAPK
set /P APPVERSION=Input your app version: 
copy "%output_path%\%app_unsigned%" "%output_folder%\%app_name% (%APPVERSION%) %CURRENT_DATE%.apk"
GOTO END

:RUNDROID
%rundevice%
GOTO END

:WATCHSASS
sass --watch %sass_master%:%sass_output%
GOTO END

:BUILDAPK
ionic cordova build android
GOTO END

:RELEASE
ionic cordova build android --release
GOTO END

rem :SIGNAPK
rem setlocal
rem call :sub1 %keystores%
rem GOTO sub1
rem :sub1
rem if "%1"=="" GOTO DOSIGNAPK
rem echo %1
rem shift
rem goto sub1
rem endlocal

:SIGNAPK
echo Moving "%keystore_name%"
copy "%keystore_name%" "%output_path%\%keystore_name%"
cd "%output_path%"
echo Deleting "%app_name_release%.apk"
del "%app_name_release%.apk"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "%keystore_name%" "%app_unsigned%" "%app_alias%"
zipalign -v 4 %app_unsigned% "%app_name_release%.apk"
apksigner verify "%app_name_release%.apk" && cd %back%
GOTO END

:MOVEPROMPT
setlocal
rem SET /P AREYOUSURE=Move APK to outputs (Y/N)? 
rem IF /I "%AREYOUSURE%" NEQ "Y" GOTO END
set /P APPVERSION=Input your app version: 
copy "%output_path%\%app_name_release%.apk" "%output_folder%\%app_name_release% (%APPVERSION%) %CURRENT_DATE%.apk"
endlocal
GOTO END

:CLEANGRADLE
cd android
gradlew clean && cd ..
GOTO END

:CLEANRUN
cd android
gradlew clean && cd .. && %rundevice%

:NOARGS
echo React Native Command Tool
echo.
echo    clean	Clean gradle
echo    start	Start the Metro Server
echo    mv           Move apk to outputs
echo    run		Build android to device
echo.
echo Example: %0 start
echo   	 to start the metro server
echo.

:END