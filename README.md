# On-Chain Multiplayer Game Backend

## Overview

This project provides a backend service using TypeScript that interacts with a blockchain smart contract to simulate a basic on-chain leaderboard for a game. It includes API endpoints to interact with the contract, integrate caching, authentication, logging, and Kafka for messaging.

## Table of Contents

- [On-Chain Multiplayer Game Backend](#on-chain-multiplayer-game-backend)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Setup Instructions](#setup-instructions)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
    - [Using Docker](#using-docker)
    - [Without Docker](#without-docker)
  - [API Endpoints](#api-endpoints)
    - [GET /api/players](#get-apiplayers)
    - [POST /api/players](#post-apiplayers)
  - [Testing](#testing)
  - [Logging and Error Handling](#logging-and-error-handling)
  - [Authentication and Authorization](#authentication-and-authorization)
  - [Caching](#caching)

## Setup Instructions

### 1. Install Dependencies

Ensure you have Node.js and npm installed on your system. Then, run the following command to install the necessary dependencies:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
RINKEBY_URL=https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=YOUR_PRIVATE_KEY
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
KAFKA_HOST=localhost:9092
REDIS_HOST=redis
MONGO_URL=mongodb://mongo:27017/leaderboard
JWT_SECRET=your_jwt_secret
PORT=3000
```

Replace the placeholder values with your actual configuration.

## Environment Variables

- **RINKEBY_URL**: URL for the Rinkeby testnet, provided by Infura or other services.
- **PRIVATE_KEY**: Your Ethereum private key to interact with the blockchain.
- **CONTRACT_ADDRESS**: Address of the deployed smart contract.
- **KAFKA_HOST**: Kafka host URL.
- **REDIS_HOST**: Redis host URL.
- **MONGO_URL**: MongoDB connection URL.
- **JWT_SECRET**: Secret key for JWT authentication.
- **PORT**: Port number on which the server runs (default is 3000).

## Running the Application

### Using Docker

Ensure Docker and Docker Compose are installed on your system. Run the following command to build and start the application along with Kafka, Zookeeper, Redis, and MongoDB:

```bash
docker-compose up --build
```

This command will start all services defined in `docker-compose.yml`.

### Without Docker

If you prefer to run the application without Docker, ensure that MongoDB, Redis, and Kafka are running on your system. Then, run the application with:

```bash
npm run dev
```

This command starts the application in development mode using nodemon.

## API Endpoints

### GET /api/players

Fetch the list of players and their scores from the smart contract.

**Response:**

```json
[
  {
    "playerAddress": "0x1234...",
    "score": 100
  },
  ...
]
```

### POST /api/players

Add a new player and their score to the smart contract and produce a Kafka message.

**Request Body:**

```json
{
  "playerAddress": "0x1234...",
  "score": 100
}
```

**Response:**

```json
{
  "transactionHash": "0x..."
}
```

## Testing

To run the unit tests using Jest, execute the following command:

```bash
npm run test
```

This command runs all tests defined in the `tests` directory.

## Logging and Error Handling

- **Logging**: Application logs are written to `combined.log` and errors to `error.log` in the root directory. Winston is used for logging.
- **Error Handling**: The application uses centralized error handling middleware for catching and logging errors.

## Authentication and Authorization

- **JWT**: JSON Web Token (JWT) is used for securing API endpoints. Include the token in the `Authorization` header for protected routes.
- **Middleware**: `authenticate` middleware verifies the token, and `authorize` middleware ensures the user has the necessary permissions.

## Caching

- **Redis**: Player data fetched from the blockchain is cached in Redis for 1 hour to improve performance.
