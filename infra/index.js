import * as docker from "@pulumi/docker";
import * as pulumi from "@pulumi/pulumi";

const dockerProvider = new docker.Provider("remote-docker", {
  host: process.env.DOCKER_HOST,
});

const myImage = new docker.Image("myapp", {
  build: {
    context: "../",
    dockerfile: "../Dockerfile",
    platform: "linux/arm64",
  },
  imageName: "myditate:latest",
  skipPush: true,
});

// Deploy the container as a Docker service on the VPS
const myService = new docker.Service(
  "myditate-service",
  {
    taskSpec: {
      containerSpec: {
        image: myImage.imageName,
      },
    },
    mode: {
      replicated: {
        replicas: 1,
      },
    },
    endpointSpec: {
      ports: [
        {
          publishedPort: 80,
          targetPort: 3000,
          protocol: "tcp",
        },
      ],
    },
  },
  { provider: dockerProvider }
);

export const serviceUrl = pulumi.interpolate`http://${myService.id}`;
