#!/usr/bin/env bash

set -euo pipefail
IFS=$'\n\t'

# Variables
DOCKER_HOST=ssh://root@159.69.218.31
ENV_FILE=".env"
ENV_JSON_FILE="./.env.json"

function build_and_deploy_service() {
    local dockerfile_dir=$1
    local image_name=$2
    local service_name=$3
    local new_secret_name="${service_name}_$(date +%Y%m%d_%H%M%S)"
    echo "Building Docker image $image_name from $dockerfile_dir ..."
    DOCKER_HOST=$DOCKER_HOST DOCKER_BUILDKIT=1 docker build --secret id=env,src=$ENV_FILE -t $image_name $dockerfile_dir

    echo "Checking if Docker service $service_name exists..."
    if DOCKER_HOST=$DOCKER_HOST docker service ls --filter name=$service_name --format '{{.Name}}' | grep -w $service_name > /dev/null; then
        echo "Updating Docker service $service_name..."
        
        # Create new secret with timestamp
        if ! DOCKER_HOST=$DOCKER_HOST docker secret create $new_secret_name $ENV_JSON_FILE; then
            echo "Failed to create new secret from $ENV_JSON_FILE"
            exit 1
        fi

        # Get current secret if exists
        old_secret=$(DOCKER_HOST=$DOCKER_HOST docker service inspect $service_name --format '{{range .Spec.TaskTemplate.ContainerSpec.Secrets}}{{.SecretName}}{{end}}' || echo "")

        # Update service with new secret
        if ! DOCKER_HOST=$DOCKER_HOST docker service update \
            --image $image_name \
            --secret-rm "$old_secret" \
            --secret-add source=$new_secret_name,target=$ENV_JSON_FILE \
            $service_name; then
            echo "Failed to update service"
            DOCKER_HOST=$DOCKER_HOST docker secret rm $new_secret_name
            exit 1
        fi

        # Remove old secret if it exists
        if [ ! -z "$old_secret" ]; then
            DOCKER_HOST=$DOCKER_HOST docker secret rm $old_secret || true
        fi
    else
        echo "Creating Docker service $service_name..."
        DOCKER_HOST=$DOCKER_HOST docker secret create $service_name $ENV_JSON_FILE
        DOCKER_HOST=$DOCKER_HOST docker service create \
            --name $service_name \
            --replicas 1 \
            --network caddy_network \
            --secret $service_name \
            --label caddy=myditate.legrand.sh \
            --label caddy.reverse_proxy="{{upstreams 3000}}" \
            $image_name
    fi
}

function deploy_stack() {
    local stack_name=$1
    local compose_file=$2

    echo "Deploying Docker stack $stack_name..."
    DOCKER_HOST=$DOCKER_HOST docker stack deploy \
        -c "$compose_file" \
        "$stack_name"
}

# Main program
case "$1" in
    service) build_and_deploy_service "$2" "$3" "$4" ;;
    stack) deploy_stack "$2" "$3" ;;
    *) echo "Usage: $0 {service|stack}"; exit 1 ;;
esac