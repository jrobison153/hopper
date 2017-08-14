#!/usr/bin/env bash

docker run -d -p 8080:8080\
            -e MONGO_CONNECTION_DATABASE=systemintegration \
            -e MONGO_CONNECTION_HOST=docker.for.mac.localhost \
            -e MONGO_CONNECTION_PORT=27017 \
            -e HOPPER_REDIS_CONNECTION_HOST=docker.for.mac.localhost \
            -e HOPPER_REDIS_CONNECTION_PORT=6379 \
            hopper