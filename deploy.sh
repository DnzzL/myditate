#!/usr/bin/env bash

set -euo pipefail
IFS=$'\n\t'

# Variables
ENV_FILE=".env"

function parse_env_vars() {
    local env_file=$1
    local mode=${2:-"create"} # create or update mode
    local flag_prefix="--env"
    local env_vars=()

    if [[ "$mode" == "update" ]]; then
        flag_prefix="--env-add"
    fi

    while IFS='=' read -r key value; do
        # Ignore empty lines and comments
        if [[ -n "$key" && "$key" != \#* ]]; then
            env_vars+=("$flag_prefix" "$key=$value")
        fi
    done < "$env_file"

    echo "${env_vars[@]:-}" # Return empty string if array is empty
}

function build_and_deploy_service() {
    local dockerfile_dir=$1
    local image_name=$2
    local service_name=$3
    echo "Building Docker image $image_name from $dockerfile_dir ..."
    DOCKER_HOST=$DOCKER_HOST docker build -t $image_name $dockerfile_dir

    echo "Checking if Docker service $service_name exists..."
    if DOCKER_HOST=$DOCKER_HOST docker service ls --filter name=$service_name --format '{{.Name}}' | grep -w $service_name > /dev/null; then
        echo "Updating Docker service $service_name..."
        local env_vars=($(parse_env_vars "$ENV_FILE" "update"))
        DOCKER_HOST=$DOCKER_HOST docker service update \
            --image $image_name \
            ${env_vars[@]:-} \
            $service_name
    else
        echo "Creating Docker service $service_name..."
        local env_vars=($(parse_env_vars "$ENV_FILE" "create"))
        DOCKER_HOST=$DOCKER_HOST docker service create \
            --name $service_name \
            --replicas 1 \
            --network caddy_network \
            ${env_vars[@]:-} \
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
    init) initialize_swarm ;;
    service) build_and_deploy_service "$2" "$3" "$4" ;;
    stack) deploy_stack "$2" "$3" ;;
    *) echo "Usage: $0 {init|service|stack}"; exit 1 ;;
esac