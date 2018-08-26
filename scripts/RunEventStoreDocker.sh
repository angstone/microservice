#!/bin/bash

EVENT_STORE_SERVER_NAME="microservice-eventstore-test-server"
EVENT_STORE_IMAGE="eventstore/eventstore"
EVENT_STORE_PORT_MAP_1="2113:2113"
EVENT_STORE_PORT_MAP_2="1113:1113"

if [ ! "$(docker ps -q -f name=$EVENT_STORE_SERVER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=$EVENT_STORE_SERVER_NAME)" ]; then
        # cleanup
        docker rm $EVENT_STORE_SERVER_NAME
    fi
    # run your container
    docker run -d --name $EVENT_STORE_SERVER_NAME -it -p $EVENT_STORE_PORT_MAP_1 -p $EVENT_STORE_PORT_MAP_2 $EVENT_STORE_IMAGE
fi
