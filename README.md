# Online Voting System API

A simple REST API for an online voting system where voters can register, log in, vote for candidates, and view results. Admins can manage candidates.

## Authentication Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/signup` | Register voter/admin |
| POST | `/login` | Login using Aadhaar number & password |

## Voting Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/candidate` | Get all candidates |
| POST | `/vote/:candidateId` | Vote for a candidate |

## Vote Count Route

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/vote/counts` | Get vote counts |

## User Profile Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/profile` | Get user profile |
| PUT | `/profile/password` | Change password |

## Admin Candidate Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/candidates` | Add new candidate |
| PUT | `/candidates/:candidateId` | Update candidate |
| DELETE | `/candidates/:candidateId` | Delete candidate |

## Features

- JWT Authentication
- bcrypt Password Hashing
- One voter can vote only once
- Admin candidate management

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT

## Run Project

```bash
npm install
npm start
```

## Environment Variables

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```
