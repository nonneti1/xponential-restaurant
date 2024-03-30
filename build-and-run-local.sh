#!/bin/sh
# This script is use to build and run server on local docker
IMAGE_NAME="xponential-restaurant"
CONTAINER_NAME="xponential-restaurant"

CUSTOM_SERVICE_PORT="PORT=3000"
CUSTOM_CONTAINER_PORT="3000:3000"

TAG=$(date +"%Y%m%d-%H%M")
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

yarn build
docker build -t $FULL_IMAGE_NAME .
docker run -d --name $CONTAINER_NAME-$TAG -e $CUSTOM_SERVICE_PORT -p $CUSTOM_CONTAINER_PORT $FULL_IMAGE_NAME
$SHELL