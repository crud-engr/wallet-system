# Wallet System API

A simple and scalable REST API for managing digital wallets. Users can register, fund their wallets, transfer money to other users, withdraw funds, and view their transaction history.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Set Up Environment Variables](#3-set-up-environment-variables)
  - [4. Set Up the Database](#4-set-up-the-database)
  - [5. Run Database Migrations](#5-run-database-migrations)
  - [6. Start the Server](#6-start-the-server)
- [Swagger Documentation](#swagger-documentation)
- [API Documentation](#api-documentation)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
  - [Response Format](#response-format)
  - [Auth Endpoints](#auth-endpoints)
    - [Register](#post-apiauthregister)
    - [Login](#post-apiauthlogin)
  - [Wallet Endpoints](#wallet-endpoints)
    - [Fund Wallet](#post-apiwalletfund)
  - [Transfer Endpoints](#transfer-endpoints)
    - [Transfer Funds](#post-apitransfer)
  - [Withdraw Endpoints](#withdraw-endpoints)
    - [Withdraw Funds](#post-apiwithdraw)
  - [Transaction Endpoints](#transaction-endpoints)
    - [Get Transaction History](#get-apitransactions)
- [Error Reference](#error-reference)

---

## Overview

This API powers a digital wallet system with the following capabilities:

- **User Accounts** — Register and log in with email and password.
- **Wallets** — Every registered user automatically gets a wallet. Fund it, withdraw from it, or send money to others.
- **Transfers** — Send money to any other registered user by their email address.
- **Transaction History** — View a paginated list of all your past transactions (funds, transfers, withdrawals).
- **Security** — All financial endpoints are protected with JWT-based authentication.

---

## Prerequisites

Before setting up this project, make sure you have the following installed on your machine:

| Tool | Version | Why you need it |
|------|---------|-----------------|
| [Node.js](https://nodejs.org/) | v18 or higher | Runs the application |
| [npm](https://www.npmjs.com/) | v8 or higher | Installs packages (comes with Node.js) |
| [PostgreSQL](https://www.postgresql.org/download/) | v14 or higher | The database that stores all data |
| [Git](https://git-scm.com/) | Any | To clone the repository |

> **Not sure if you have these?** Open your terminal and run `node -v`, `npm -v`, `psql --version`, and `git --version`. Each should print a version number.

---

## Project Setup

Follow these steps in order. Each step must complete successfully before moving to the next.

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone <repository-url>
cd wallet-system
```

Replace `<repository-url>` with the actual URL of this repository.

---

### 2. Install Dependencies

```bash
npm install
```

This downloads all the packages the project needs. It may take a minute.

---

### 3. Set Up Environment Variables

The application requires a configuration file to know things like where the database is and what secret key to use for tokens.

Create a file named `.env` in the root of the project folder:

```bash
touch .env
```

Open the `.env` file and paste in the following, replacing the placeholder values:

```env
# The connection string for your PostgreSQL database.
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/wallet_db"

# A long random string used to sign JWT tokens. Keep this secret.
# You can generate one by running: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your_super_secret_key_here"

# How long a login token stays valid before the user must log in again.
# Examples: "7d" (7 days), "24h" (24 hours), "1h" (1 hour)
JWT_EXPIRES_IN="7d"

# The port the server listens on. 3000 is the default if you leave this out.
PORT=3000
```

**How to fill each value:**

- **`DATABASE_URL`** — You need a running PostgreSQL database. Replace `postgres` with your PostgreSQL username, `yourpassword` with your PostgreSQL password, and `wallet_db` with any database name you choose (the migration step will create it for you). If PostgreSQL is running locally with default settings, the host is `localhost` and the port is `5432`.

- **`JWT_SECRET`** — This must be a long, random, secret string. To generate one, open your terminal and run:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
  Copy the output and paste it as the value.

- **`JWT_EXPIRES_IN`** — Controls how long login sessions last. `7d` (7 days) is a reasonable default.

- **`PORT`** — The port the server will run on. `3000` works for local development.

---

### 4. Set Up the Database

First, create the database in PostgreSQL. Open your terminal and connect to PostgreSQL:

```bash
psql -U postgres
```

Then create the database (use the same name you put in `DATABASE_URL`):

```sql
CREATE DATABASE wallet_db;
\q
```

> If you used a different username or database name, adjust the command accordingly.

---

### 5. Run Database Migrations

Migrations create all the required tables in your database. Run:

```bash
npm run db:migrate
```

When prompted, type a name for the migration (e.g., `init`) and press Enter. Prisma will create the `users`, `wallets`, and `transactions` tables automatically.

Then generate the Prisma client (this lets the app talk to the database):

```bash
npm run db:generate
```

> **Optional:** To visually browse your database in a web UI, run `npm run db:studio` and open the URL it prints.

---

### 6. Start the Server

**For development** (auto-restarts when you change code):

```bash
npm run dev
```

**For production:**

```bash
npm run build
npm start
```

You should see:

```
Server running on port 3000
```

To confirm the server is healthy, open your browser or use a tool like `curl`:

```
GET http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Wallet system is running"
}
```

---

## Swagger Documentation

Once the server is running, you can explore and test all API endpoints interactively through the Swagger UI:

```
http://localhost:3000/api/docs
```

The raw OpenAPI JSON spec is also available at:

```
http://localhost:3000/api/docs.json
```

> In Swagger UI, click **Authorize** (top right), paste your JWT token as `Bearer <your_token>`, and all protected endpoints will include it automatically.

---

## API Documentation

### Base URL

```
http://localhost:3000
```

All API endpoints are prefixed with `/api`.

---

### Authentication

Most endpoints require you to be logged in. After registering or logging in, you receive a **JWT token**. Include it in every request to a protected endpoint as an HTTP header:

```
Authorization: Bearer <your_token_here>
```

Endpoints that do **not** require authentication: `POST /api/auth/register`, `POST /api/auth/login`.

---

### Response Format

All responses follow this consistent structure:

**Success:**
```json
{
  "success": true,
  "message": "Human-readable description of what happened",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Description of the error"
}
```

---

## Auth Endpoints

### `POST /api/auth/register`

Creates a new user account. A wallet is automatically created and linked to the account.

**Authentication required:** No

**Request Body:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | Cannot be empty |
| `email` | string | Yes | Must be a valid email address |
| `password` | string | Yes | Minimum 8 characters |

**Example Request:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "supersecret123"
}
```

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

> Save the `token` from this response. You will need it to access all protected endpoints.

**Error Responses:**

| Status | When it happens |
|--------|----------------|
| `409 Conflict` | An account with that email already exists |
| `422 Unprocessable Entity` | A required field is missing or invalid |

---

### `POST /api/auth/login`

Logs in an existing user and returns a fresh JWT token.

**Authentication required:** No

**Request Body:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `email` | string | Yes | Must be a valid email address |
| `password` | string | Yes | Cannot be empty |

**Example Request:**

```json
{
  "email": "jane@example.com",
  "password": "supersecret123"
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

**Error Responses:**

| Status | When it happens |
|--------|----------------|
| `401 Unauthorized` | Email or password is incorrect |
| `422 Unprocessable Entity` | A required field is missing or invalid |

---

## Wallet Endpoints

### `POST /api/wallet/fund`

Adds money to the authenticated user's wallet.

**Authentication required:** Yes

**Request Body:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `amount` | number | Yes | Minimum ₦50 |

**Example Request:**

```json
{
  "amount": 5000.00
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Wallet funded successfully",
  "data": {
    "balance": 5000.00,
    "transaction": {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "type": "FUND",
      "amount": 5000.00,
      "reference": "FND-550E8400-E29B-41D4-A716-446655440000",
      "createdAt": "2026-05-24T10:00:00.000Z"
    }
  }
}
```

> `balance` reflects your new total wallet balance after the top-up.

**Error Responses:**

| Status | When it happens |
|--------|----------------|
| `401 Unauthorized` | Token is missing, invalid, or expired |
| `404 Not Found` | Wallet not found (should not happen if you registered normally) |
| `422 Unprocessable Entity` | `amount` is missing or below ₦50 |

---

## Transfer Endpoints

### `POST /api/transfer`

Sends money from the authenticated user's wallet to another registered user's wallet.

**Authentication required:** Yes

**Request Body:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `recipient_email` | string | Yes | Must be a valid email of a registered user |
| `amount` | number | Yes | Minimum ₦50 |

**Example Request:**

```json
{
  "recipient_email": "john@example.com",
  "amount": 1500.00
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Transfer successful",
  "data": {
    "balance": 3500.00,
    "transaction": {
      "id": "3c4d5e6f-7890-12ab-cdef-1234567890ab",
      "type": "TRANSFER",
      "amount": 1500.00,
      "reference": "TRF-3C4D5E6F-7890-12AB-CDEF-1234567890AB",
      "recipient": {
        "name": "John Smith",
        "email": "john@example.com"
      },
      "createdAt": "2026-05-24T10:05:00.000Z"
    }
  }
}
```

> `balance` is your remaining wallet balance after the transfer is deducted.

**Business Rules:**
- You cannot transfer money to yourself.
- You must have sufficient balance to cover the transfer amount.
- The recipient must have an existing account (and wallet).

**Error Responses:**

| Status | When it happens |
|--------|----------------|
| `400 Bad Request` | Insufficient balance, or you tried to transfer to yourself |
| `401 Unauthorized` | Token is missing, invalid, or expired |
| `404 Not Found` | Recipient email does not belong to any registered user |
| `422 Unprocessable Entity` | `recipient_email` or `amount` is missing or invalid |

---

## Withdraw Endpoints

### `POST /api/withdraw`

Withdraws money from the authenticated user's wallet.

**Authentication required:** Yes

**Request Body:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `amount` | number | Yes | Minimum ₦50 |

**Example Request:**

```json
{
  "amount": 2000.00
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Withdrawal successful",
  "data": {
    "balance": 1500.00,
    "transaction": {
      "id": "1a2b3c4d-5e6f-7890-abcd-ef1234567890",
      "type": "WITHDRAWAL",
      "amount": 2000.00,
      "reference": "WDR-1A2B3C4D-5E6F-7890-ABCD-EF1234567890",
      "createdAt": "2026-05-24T10:10:00.000Z"
    }
  }
}
```

> `balance` is your remaining wallet balance after the withdrawal.

**Business Rules:**
- You must have at least the withdrawal amount in your wallet.

**Error Responses:**

| Status | When it happens |
|--------|----------------|
| `400 Bad Request` | Your wallet balance is less than the requested amount |
| `401 Unauthorized` | Token is missing, invalid, or expired |
| `404 Not Found` | Wallet not found |
| `422 Unprocessable Entity` | `amount` is missing or below ₦50 |

---

## Transaction Endpoints

### `GET /api/transactions`

Returns a paginated list of all the authenticated user's transactions — funds received, transfers sent or received, and withdrawals.

**Authentication required:** Yes

**Query Parameters:**

| Parameter | Type | Default | Rules |
|-----------|------|---------|-------|
| `page` | integer | `1` | Page number, must be 1 or higher |
| `limit` | integer | `20` | Results per page, maximum `100` |

**Example Request:**

```
GET /api/transactions?page=1&limit=10
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "amount": 5000.00,
        "type": "FUND",
        "status": "SUCCESS",
        "reference": "FND-550E8400-E29B-41D4-A716-446655440000",
        "createdAt": "2026-05-24T10:00:00.000Z"
      },
      {
        "id": "3c4d5e6f-7890-12ab-cdef-1234567890ab",
        "amount": 1500.00,
        "type": "TRANSFER",
        "status": "SUCCESS",
        "reference": "TRF-3C4D5E6F-7890-12AB-CDEF-1234567890AB",
        "createdAt": "2026-05-24T10:05:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  }
}
```

**Transaction Types:**

| Type | Meaning |
|------|---------|
| `FUND` | Money was added to your wallet |
| `TRANSFER` | Money was sent to or received from another user |
| `WITHDRAWAL` | Money was withdrawn from your wallet |

**Transaction Statuses:**

| Status | Meaning |
|--------|---------|
| `SUCCESS` | The transaction completed successfully |
| `PENDING` | The transaction is being processed |
| `FAILED` | The transaction did not complete |

**Error Responses:**

| Status | When it happens |
|--------|----------------|
| `401 Unauthorized` | Token is missing, invalid, or expired |

---

## Error Reference

| HTTP Status | Meaning |
|-------------|---------|
| `400 Bad Request` | The request is understood but cannot be processed (e.g., insufficient funds) |
| `401 Unauthorized` | You are not logged in, or your token is invalid or expired |
| `404 Not Found` | The requested resource does not exist |
| `409 Conflict` | A resource you are trying to create already exists |
| `422 Unprocessable Entity` | Your request body failed validation — check the field rules |
| `500 Internal Server Error` | Something unexpected went wrong on the server |

---

## Available Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the server in development mode (auto-reloads on file changes) |
| `npm run build` | Compile TypeScript to JavaScript in the `dist/` folder |
| `npm start` | Run the compiled production build |
| `npm run db:migrate` | Apply database migrations and create/update tables |
| `npm run db:generate` | Regenerate the Prisma database client after schema changes |
| `npm run db:studio` | Open Prisma Studio — a visual browser for your database |
