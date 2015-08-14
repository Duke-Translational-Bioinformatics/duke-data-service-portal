#!/bin/bash

if [ -z $COMPOSE_FILE ]
then
  docker-compose up -d
else
  docker-compose up -d server
fi
