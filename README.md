# Late-Night Peer Study Help Platform

A real-time, Role-Based Access Control peer learning and doubt-solving platform for **Hostel BH 13**.

---

## Key Features

### 1. Role-Based Access Control
- **Student Role**:
  - Broadcast doubts to nearby classmates in Hostel BH 13.
  - Choose active courses (*Programming (C++)*, *Data Structures*, *Engineering Math*).
  - Track live matching status, distance, and ETA.
  - Interactive live chat with syntax-highlighted code snippets.
  - Rate the session (1–5 stars), choose quick feedback tags, and write a thank-you note.
- **Peer Tutor Role**:
  - Fast-response alert chime with a 45-second animated response countdown timer to accept or decline.
  - In-app live chat with code snippet sharing tools.
  - Gamification: **XP gains (+50 XP)** and **Hostel BH 13 Leaderboard rank promotions** upon completion.
  - Explainer availability toggle.

### 2. High-Security Authentication & Protection
- **Bcrypt Password Hashing**: Passwords are salted and hashed on the backend using `bcryptjs` (salt rounds = 10). Passwords are never compared using client-side checks.
- **Cryptographic Token Verification**: Session tokens are signed and verified server-side using secure cryptographic standards.
- **Participant Access Control**: Chat messages and session endpoints verify that the requesting user's token matches either the student or the peer tutor of that active session.
- **Direct File Protection**: All backend files, internal data stores, and server configurations are isolated and cannot be accessed via URL traversal.
- **Theme Support**: Seamless Light Warm editorial layout with an interactive Night Mode toggle.

---

## How to Run

### 1. Backend Server (Port 5000)
```bash
cd backend
npm install
npm start
```

### 2. Frontend Web App (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your web browser.
