# 🕵️ Mystery Investigation AI

An interactive full-stack detective simulator powered by **Google Gemini API**, **Express.js**, **MongoDB**, and **React + Vite + Tailwind CSS**.

Players provide any premise and challenge level, and the application generates a complete crime investigation with suspects, clues, hints, and an unrevealed culprit. Players investigate forensic evidence, request intelligence hints, and deduce who committed the crime.

---

## 🚀 Features

- **Dynamic AI Generation**: Uses Google's `@google/genai` to generate cohesive storylines, suspects, evidence, and logical deductions.
- **Strict Culprit Protection**: The server keeps the true culprit and solution confidential until an accusation is submitted.
- **Tactical Clue Discovery**: Clues are hidden initially. Investigating clues awards +5 points.
- **Intelligence Hints**: Players can consult limited hints with a -10 point tactical deduction.
- **Three Challenge Tiers**:
  - **Easy**: 3 suspects, 5 clues, 2 hints, 100 pt accusation reward
  - **Medium**: 4 suspects, 7 clues, 3 hints, 150 pt accusation reward
  - **Hard**: 5 suspects, 9 clues, 3 hints, 200 pt accusation reward
- **Secure Backend Scoring**: Score calculations and validation are strictly enforced on the server.
- **Zero-Setup Database Fallback**: Built-in in-memory MongoDB fallback ensures the app runs out-of-the-box even without a local MongoDB service running.
- **Rich Detective Noir UI**: Glassmorphic panels, evidence inspection, suspect lineups, confirmation modals, and celebration effects on case solve.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 / Vite
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios
- **Effects**: canvas-confetti

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB / Mongoose (with automated in-memory dev fallback)
- **AI SDK**: `@google/genai` (Google Gemini API)
- **Validation**: Zod
- **Security & Config**: dotenv & cors

---

## 📦 Project Architecture

```text
Mystery Investigation AI
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Navbar, Footer, ConfirmationModal
│   │   ├── pages/               # Home, CreateCase, Investigation, Accusation, Results
│   │   ├── services/            # api.js (Axios client)
│   │   ├── App.jsx              # Routing configuration
│   │   ├── index.css            # Tailwind CSS & theme tokens
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/                      # Express.js Backend
│   ├── controllers/             # caseController.js
│   ├── models/                  # Case.js (Mongoose Schema)
│   ├── routes/                  # caseRoutes.js
│   ├── services/                # geminiService.js (Gemini & Zod)
│   ├── server.js                # Server entrypoint & DB fallback
│   ├── .env                     # Backend environment configuration
│   └── package.json
│
├── .gitignore
├── README.md
└── spec.md                      # Detailed technical specification
```

---

## ⚙️ Quick Start

### 1. Start the Backend Server

```bash
cd server
npm install
npm run dev
```

*The server will run on `http://localhost:5000`.*

> **Optional**: To enable real-time Gemini generation, add your API key to `server/.env`:
> ```env
> GEMINI_API_KEY=your_gemini_api_key_here
> ```
> *If no key is provided, the server automatically provides high-quality procedural mystery cases for testing.*

### 2. Start the Frontend Client

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

*The frontend will run on `http://localhost:5173`.*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service and database health check |
| `POST` | `/api/cases` | Generate and save a new mystery case |
| `GET` | `/api/cases/:id` | Fetch investigation state (culprit hidden) |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Reveal clue and add +5 points |
| `POST` | `/api/cases/:id/hints` | Retrieve hint and apply -10 points |
| `POST` | `/api/cases/:id/accuse` | Submit accusation and calculate score |
| `GET` | `/api/cases/:id/result` | Retrieve full results and explanation |

---

## 🏆 Scoring Formula

```text
Final Score = Base Score (if accusation correct) + (Discovered Clues × 5) - (Hints Used × 10)
Minimum Score = 0
```
