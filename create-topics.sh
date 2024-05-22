#!/bin/sh

# Define your Kafka topics here
KAFKA_TOPICS="player-updates"

# Loop through each topic and create it
for TOPIC in $KAFKA_TOPICS; do
  kafka-topics.sh --create --topic "$TOPIC" --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
done
