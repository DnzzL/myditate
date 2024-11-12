#!/usr/bin/env bash

set -euo pipefail
IFS=$'\n\t'

# Variables
SERVER_IP="49.12.197.150"
SSH_USER="root"
DOCKER_HOST="ssh://$SSH_USER@$SERVER_IP"

function build_and_deploy_service() {
    local dockerfile_dir=$1
    local image_name=$2
    local service_name=$3
    echo "Building Docker image $image_name from $dockerfile_dir ..."
    DOCKER_HOST=$DOCKER_HOST docker build -t $image_name $dockerfile_dir
    echo "Deploying Docker service $service_name..."
    DOCKER_HOST=$DOCKER_HOST docker service create \
        --name $service_name \
        --replicas 1 \
        --label "traefik.enable=true" \
        --label "traefik.http.routers.${service_name}.rule=Host(myditate.legrand.sh)" \
        --label "traefik.http.services.${service_name}.loadbalancer.server.port=80" \
        $image_name
}

function deploy_stack() {
    local stack_name=$1
    local compose_file=$2
    echo "Deploying Docker stack $stack_name..."
    scp "$compose_file" "$SSH_USER@$SERVER_IP:/tmp/$stack_name.yml"
    ssh "$SSH_USER@$SERVER_IP" "docker stack deploy -c /tmp/$stack_name.yml $stack_name"
}



# Main program
case "$1" in
    init) initialize_swarm ;;
    service) build_and_deploy_service "$2" "$3" "$4" ;;
    stack) deploy_stack "$2" "$3" ;;
    *) echo "Usage: $0 {init|service|stack}"; exit 1 ;;
esac