# HireSense AI

AI-powered hiring platform built with the MERN stack.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** bcrypt, JWT

## Project Structure

```
HireSense-AI/
└── backend/
    ├── config/         # Database connection
    ├── controllers/    # Request handlers
    ├── middleware/     # Auth & error middleware
    ├── models/         # Mongoose schemas
    ├── routes/         # API routes
    ├── services/       # Business logic
    ├── app.js
    └── server.js
```

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/KnightByte-IO/HireSense-AI.git
cd HireSense-AI/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

### 4. Run the server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

| Method | Endpoint              | Description      |
|--------|-----------------------|------------------|
| GET    | `/`                   | Health check     |
| POST   | `/api/auth/register`  | Register user    |
| POST   | `/api/auth/login`     | Login user       |

## License

ISC
