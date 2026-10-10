# Buy 01 — E-Commerce Microservices Platform

A full-stack e-commerce marketplace built with **Spring Boot microservices, Angular, MongoDB, Apache Kafka, and Docker Compose**. The platform allows users to register as clients or sellers, browse products, and manage product listings and images.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)
- [Accessing the Application](#accessing-the-application)
- [API Endpoints](#api-endpoints)
- [Kafka Event Flow](#kafka-event-flow)
- [Database and Storage](#database-and-storage)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## Overview

Buy 01 is a marketplace application designed around independently deployable backend services. Each service has a specific responsibility, while the API Gateway provides a single entry point for frontend requests.

The project demonstrates microservice architecture, REST API development, authentication and authorization, event-driven communication, file uploads, and containerized deployment.

## Architecture

![Buy 01 Backend Architecture](backend-architecteur.jpeg)

The backend consists of the following components:

| Component | Responsibility |
|---|---|
| Angular Frontend | User interface, authentication forms, product listings, and seller dashboard |
| API Gateway | Entry point for client requests and routing to backend services |
| Eureka Server | Service registration and discovery |
| User Service | Registration, login, user profiles, and roles |
| Product Service | Product creation, retrieval, updating, and deletion |
| Media Service | Image management and Cloudinary integration |
| MongoDB | Persistence for users, products, and media metadata |
| Apache Kafka | Asynchronous communication between services |
| Cloudinary | External storage for uploaded images |

### Service Communication

- The frontend communicates with the backend through the API Gateway.
- The API Gateway routes requests to registered services.
- Backend services use Eureka for service discovery.
- MongoDB stores application data.
- Kafka transports asynchronous events between the Product Service and Media Service.
- Cloudinary stores image files, while the application stores their references and related metadata.

## Features

### Authentication and Authorization
- User registration and login.
- Client and seller roles.
- JWT-based authentication.
- Password hashing and protected endpoints.
- Role-based access to seller operations.

### Product Management
- Browse available products.
- Retrieve product details.
- Create, update, and delete products.
- Associate products with image URLs.
- Protect seller operations according to the application's authorization rules.

### Media Management
- Upload product images.
- Store images using Cloudinary.
- Keep image references in the application database.
- Use Kafka events to communicate product-deletion information for image cleanup.

### Infrastructure
- Independent Spring Boot services.
- Eureka service discovery.
- Centralized API routing.
- MongoDB persistence.
- Kafka event-driven communication.
- Docker Compose orchestration.

## Technology Stack

| Technology | Purpose |
|---|---|
| Java | Backend programming language |
| Spring Boot | Backend microservices |
| Spring Security | Authentication and authorization |
| Spring Cloud Gateway | API Gateway |
| Netflix Eureka | Service discovery |
| Spring Data MongoDB | Database integration |
| Apache Kafka | Asynchronous messaging |
| Angular | Frontend application |
| TypeScript | Frontend programming language |
| MongoDB | NoSQL database |
| Cloudinary | Image storage |
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |
| Maven | Java dependency management and builds |

## Prerequisites

Before running the project, install:

- **Git** — to clone the repository.
- **Docker Engine or Docker Desktop** — to run the containers.
- **Docker Compose v2** — available through the `docker compose` command.
- **Cloudinary account and credentials** — required if image operations use your Cloudinary account.
- A modern web browser.

Java, Maven, Node.js, and Angular CLI may also be required if you want to run or develop individual services outside Docker. When running the complete application through Docker Compose, you generally do not need to install those tools separately.

Check your installations:

```bash
git --version
docker --version
docker compose version
```

## Environment Configuration

Configure your environment variables before starting the application.

If the repository contains a `.env.example` file, copy it to `.env`:

```bash
cp .env.example .env
```

Open `.env` and provide the values required by your Docker Compose configuration.

Typical configuration includes:

```dotenv
JWT_SECRET=replace_with_a_strong_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

These names are examples; use the exact variable names referenced by your application and `docker-compose.yml`.

**Security notes:**
- Never commit `.env` or real credentials to Git.
- Use a strong JWT secret that meets your application's security configuration.
- Keep Cloudinary credentials private.
- Do not replace production secrets with the example values above.

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd 01-buy
```

Replace `<YOUR_REPOSITORY_URL>` with your Git repository URL.

### 2. Configure the environment

Create and complete the `.env` file as described in [Environment Configuration](#environment-configuration).

### 3. Build the containers

```bash
docker compose build --no-cache
```

This rebuilds the container images without using cached build layers.

### 4. Start the application

```bash
docker compose up
```

To run the application in the background:

```bash
docker compose up -d
```

Docker Compose starts the services defined in the Compose configuration, including the backend services, frontend, databases, and Kafka infrastructure.

On the first run, allow time for images to download, services to initialize, and databases to become available.

### 5. Check service status

```bash
docker compose ps
```

Inspect the logs if a service fails to start:

```bash
docker compose logs -f
```

To inspect one service:

```bash
docker compose logs -f product-service
```

Replace `product-service` with the service name defined in your Compose file.

### 6. Rebuild after making code changes

To stop the running containers:

```bash
docker compose down
```

To rebuild all images:

```bash
docker compose build --no-cache
```

To start the application again:

```bash
docker compose up
```

These commands are useful when you want to ensure that the latest code is included in the rebuilt images.

**Note:** `docker compose down` removes the Compose containers and networks but normally preserves named volumes. Avoid `docker compose down -v` unless you intentionally want to delete the persisted database and Kafka data.

## Accessing the Application

With the default local port mappings, the backend services are available at the following addresses:

| Service | Local URL |
|---|---|
| API Gateway | `http://localhost:8080` |
| User Service | `http://localhost:8081` |
| Product Service | `http://localhost:8082` |
| Media Service | `http://localhost:8083` |
| Eureka Dashboard | `http://localhost:8761` |

The Angular frontend's URL depends on the port configured in your Docker Compose file.

For normal application usage, send API requests through the API Gateway rather than calling individual microservices directly.

Spring Boot Actuator health endpoints, where enabled, can be checked at:

```text
http://localhost:8080/actuator/health
http://localhost:8081/actuator/health
http://localhost:8082/actuator/health
http://localhost:8083/actuator/health
```

The gateway health endpoint depends on Actuator and its endpoint exposure being configured in the gateway.

## API Endpoints

The following endpoints describe the application's intended API structure. Exact request fields, response bodies, and supported operations depend on the implemented controllers.

### User Service

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/me` | Retrieve the authenticated user's profile |
| PUT | `/me` | Update the user's profile |

### Product Service

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/products` | Retrieve products |
| GET | `/products/{id}` | Retrieve a product by ID |
| POST | `/products` | Create a product |
| PUT | `/products/{id}` | Update a product |
| DELETE | `/products/{id}` | Delete a product |

Product creation, updating, and deletion should require the appropriate authentication and seller permissions.

### Media Service

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/media/images` | Upload images |
| GET | `/media/images/{id}` | Retrieve an image, if implemented |
| DELETE | `/media/images/{id}` | Delete an image, if implemented |

Image upload and deletion endpoints may require an authenticated seller. Consult the implemented controllers for the exact request format and authorization requirements.

## Kafka Event Flow

Apache Kafka enables asynchronous communication between the Product Service and Media Service.

### Product deletion and image cleanup

1. A seller requests deletion of a product.
2. The Product Service retrieves the product's image references.
3. The Product Service publishes a deletion event containing the image paths.
4. Kafka stores the event in the configured topic.
5. The Media Service consumes the event.
6. The Media Service requests deletion of the corresponding images from Cloudinary.

The topic used by the current implementation is `images-deleted`; the producer and consumer must use the same topic name.

This design separates product management from external image cleanup and avoids requiring the Product Service to manage Cloudinary directly.

### Kafka connection settings

In a Docker Compose network, services should use the Kafka address configured for container-to-container communication. In the current local setup, this is:

```text
kafka:19092
```

For applications running directly on the host, the configured external address is:

```text
localhost:9092
```

These addresses depend on the listeners configured for the Kafka broker.

## Database and Storage

The application uses MongoDB for persistence and Cloudinary for image files.

The Docker Compose configuration has used the following MongoDB host port mappings:

| Database | Host port |
|---|---:|
| User MongoDB | `27017` |
| Product MongoDB | `27018` |
| Media MongoDB | `27019` |

Within the Docker network, applications should use their corresponding MongoDB service names and container ports, not the host-mapped ports.

Docker volumes preserve database data and Kafka data across ordinary container restarts and `docker compose down` operations.

Cloudinary stores the actual image files. MongoDB stores application records and image references rather than the image binaries themselves.

## Troubleshooting

### Containers fail to start

Check the service status and logs:

```bash
docker compose ps
docker compose logs -f
```

Verify that required ports are not already in use.

### A service cannot connect to MongoDB

Check the MongoDB container status, database URI, credentials, and Docker service name. Remember that `localhost` inside a container refers to that container itself.

### Kafka events are not consumed

Check that:
- The Kafka broker is healthy.
- The producer and consumer use the same topic name.
- The producer and consumer use the correct Kafka listener addresses.
- The consumer group and deserialization configuration are correct.
- The producer and consumer logs do not report errors.

### Images are not deleted from Cloudinary

Verify that the Cloudinary environment variables are configured correctly and that the deletion event contains the expected image paths or public IDs. Inspect the Media Service and Kafka consumer logs for errors.

### Frontend requests fail

Check the frontend API base URL, gateway routes, CORS configuration, and authentication token. Requests from the browser should normally target the gateway's exposed URL.

### Changes do not appear after rebuilding

Rebuild the relevant container images and recreate the containers:

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

Check whether your Compose configuration uses prebuilt images, build contexts, or mounted source directories.

## Project Structure

The repository contains the frontend and backend services. A simplified structure is shown below; directory names may differ from the actual repository.

```text
01-buy/
├── frontend/
├── api-gateway/
├── eureka-server/
├── userservice/
├── product-service/
├── media-service/
├── docker-compose.yml
├── .env.example
├── backend-architecteur.jpeg
└── README.md
```

## Learning Objectives

This project provides practical experience with:

- Designing Spring Boot microservices.
- Building REST APIs and securing them with Spring Security and JWT.
- Service registration and discovery using Eureka.
- API routing with Spring Cloud Gateway.
- MongoDB persistence.
- Event-driven architecture with Apache Kafka.
- Image uploads and external object storage.
- Docker-based development and deployment.
- Integrating an Angular frontend with a microservices backend.

## License

Add the appropriate license information if this project is distributed publicly.
