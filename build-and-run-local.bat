@echo off

rem Define environment variables (if not already set)
if not defined IMAGE_NAME (
  set IMAGE_NAME=xponential-restaurant
)
if not defined CONTAINER_NAME (
  set CONTAINER_NAME=xponential-restaurant
)
if not defined CUSTOM_SERVICE_PORT (
  set CUSTOM_SERVICE_PORT=PORT=3000
)
if not defined CUSTOM_CONTAINER_PORT (
  set CUSTOM_CONTAINER_PORT=3000:3000
)

set TAG=%date:~10,4%%date:~4,2%%date:~7,2%

set FULL_IMAGE_NAME=%IMAGE_NAME%:%TAG%

yarn build && docker build -t %FULL_IMAGE_NAME% . && docker run -d --name %CONTAINER_NAME%-%TAG% -e %CUSTOM_SERVICE_PORT% -p %CUSTOM_CONTAINER_PORT% %FULL_IMAGE_NAME%