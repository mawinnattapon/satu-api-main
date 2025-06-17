#!/bin/sh

git pull origin uat

docker compose -f docker-compose-uat.yml up -d --build