# 🕵️ Mystery Investigation AI

An AI-powered mystery investigation web application where users solve dynamically generated mystery cases using clues, suspects, and hints.

The application uses **Google Gemini API** to generate logically consistent mysteries based on a user-provided premise and difficulty level. Players investigate the case, discover clues, request hints, accuse a suspect, and receive a final verdict and score.

---

## 📌 Project Overview

**Mystery Investigation AI** turns a simple mystery premise into an interactive detective experience.

For example, a user can enter:

> "The Golden Excellence Trophy disappears from a college festival just before the award ceremony."

The AI generates:

- A mystery story
- Suspects
- Clues
- Hints
- A hidden culprit
- A logical solution

The player must investigate the case and identify the culprit.

---

## 🎯 Objectives

The main objectives of this project are to:

- Generate dynamic mystery cases using AI.
- Provide different difficulty levels.
- Allow users to investigate suspects and clues.
- Provide hints when required.
- Prevent the culprit from being revealed prematurely.
- Evaluate the player's accusation.
- Calculate a score based on investigation performance.
- Demonstrate integration of React, Node.js, MongoDB, and Gemini API.

---

## ✨ Features

### 🔎 Mystery Generation

Users can enter their own mystery premise and select a difficulty level.

Supported levels:

| Difficulty | Suspects | Clues | Hints | Base Score |
|---|---:|---:|---:|---:|
| Easy | 3 | 5 | 2 | 100 |
| Medium | 4 | 7 | 3 | 150 |
| Hard | 5 | 9 | 3 | 200 |

### 🧩 Investigation

Players can:

- Read the mystery story.
- Examine suspects.
- Discover clues.
- Track investigation progress.
- Request hints.

### 💡 Hint System

Hints help players when they are stuck.

Each hint used reduces the score by **10 points**.

### ⚖️ Accusation

Players select the suspect they believe is responsible and submit their accusation.

The backend determines whether the accusation is correct.

### 🏆 Scoring

The score is calculated by the backend.

```text
Final Score =
Base Score
+ (Discovered Clues × 5)
- (Hints Used × 10)
```

The minimum score is **0**.

### 🎯 Results

After the accusation, the application reveals:

- Verdict
- Player's accusation
- Correct culprit
- Explanation
- Final score

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- Mongoose
- MongoDB
- Zod
- CORS
- dotenv

### AI

- Google Gemini API
- `@google/genai`

### Development Tools

- Git
- GitHub
- VS Code
- Postman

---

## 📂 Project Structure

```text
Mystery-Investigation-AI/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── models/
│   │   └── Case.js
│   ├── routes/
│   │   └── caseRoutes.js
│   ├── controllers/
│   │   └── caseController.js
│   ├── services/
│   │   └── geminiService.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── .gitignore
├── README.md
└── SPEC.md
```

---

## 🔄 Application Flow

```text
Home
  ↓
Create Mystery
  ↓
Enter Premise + Select Difficulty
  ↓
Gemini Generates Mystery
  ↓
Backend Validates Response
  ↓
Investigation Room
  ↓
Discover Clues / Request Hints
  ↓
Make Accusation
  ↓
Backend Checks Culprit
  ↓
Score Calculation
  ↓
Results
  ↓
Start Another Mystery
```

---

## 📄 Application Pages

### 1. Home

Introduces the application and provides a button to start an investigation.

### 2. Create Mystery

Allows the user to:

- Enter a mystery premise.
- Select difficulty.
- Generate a mystery.

### 3. Investigation Room

Displays:

- Mystery story
- Suspects
- Clues
- Hints
- Investigation progress

### 4. Accusation

Allows the player to select a suspect and submit their accusation.

### 5. Results

Displays:

- Verdict
- Culprit
- Explanation
- Score

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/cases` | Generate a mystery |
| GET | `/api/cases/:id` | Retrieve an active mystery |
| POST | `/api/cases/:id/clues/:clueId/discover` | Discover a clue |
| POST | `/api/cases/:id/hints` | Request a hint |
| POST | `/api/cases/:id/accuse` | Submit an accusation |
| GET | `/api/cases/:id/result` | Retrieve completed result |

---

## 🔐 Security

The project follows several important security practices.

### API Keys

The Gemini API key is stored only on the backend using environment variables.

### Database Credentials

MongoDB credentials are stored in the backend `.env` file.

### Culprit Protection

The culprit and complete solution are stored on the backend and are **not sent to the frontend before the accusation**.

### Backend Scoring

The score is calculated by the backend rather than being trusted from the frontend.

### Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Never commit `.env` to GitHub.

---

## 🚀 Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB Atlas account
- Gemini API key
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

```bash
cd Mystery-Investigation-AI
```

---

## 2. Setup Frontend

```bash
cd client
npm install
```

Run the frontend:

```bash
npm run dev
```

The Vite development server will normally run at:

```text
http://localhost:5173
```

---

## 3. Setup Backend

Open another terminal:

```bash
cd server
npm install
```

Create:

```text
server/.env
```

Add:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend will normally run at:

```text
http://localhost:5000
```

---

## 📦 Backend Dependencies

The backend uses:

```bash
npm install express cors dotenv mongoose @google/genai zod
```

For development:

```bash
npm install --save-dev nodemon
```

---

## 📦 Frontend Dependencies

The frontend uses:

```bash
npm install react-router-dom axios
```

Tailwind CSS is used for styling.

---

## 🧪 Testing

The API can be tested using:

- Browser
- Postman
- Frontend application

Important test cases include:

- Generate Easy mystery.
- Generate Medium mystery.
- Generate Hard mystery.
- Discover a clue.
- Discover the same clue twice.
- Request all available hints.
- Request a hint after the limit.
- Submit a correct accusation.
- Submit an incorrect accusation.
- Attempt to access a nonexistent case.
- Verify that the culprit is hidden before accusation.
- Verify that the score cannot become negative.

---

## ⚠️ Project Limitations

The current version does not include:

- User authentication
- Multiplayer
- Leaderboards
- Payment systems
- Advanced analytics
- Admin dashboard
- Real-time multiplayer functionality

These features can be added in future versions.

---

## 🔮 Future Enhancements

Possible future improvements include:

- User accounts and authentication.
- Case history.
- Leaderboards.
- Timed investigations.
- Difficulty statistics.
- Dark mode.
- Animations and sound effects.
- More advanced AI-generated scenarios.
- Multiplayer investigations.

---

## 📋 Project Requirements

The project must satisfy the following core requirements:

- [x] React frontend
- [x] Vite
- [x] Tailwind CSS
- [x] Node.js
- [x] Express
- [x] MongoDB
- [x] Mongoose
- [x] Gemini API
- [x] Three difficulty levels
- [x] AI-generated mysteries
- [x] Clue investigation
- [x] Hint system
- [x] Accusation system
- [x] Backend scoring
- [x] Culprit protection
- [x] Results and explanation
- [x] Responsive UI

---

## 📚 Documentation

Detailed project requirements, API behavior, database design, AI behavior, scoring rules, security requirements, and acceptance criteria are documented in:

```text
SPEC.md
```

`SPEC.md` should be treated as the primary technical specification for development.

---

## 👩‍💻 Project Purpose

This project is developed as an academic full-stack AI project to demonstrate practical skills in:

- React development
- REST API development
- MongoDB database integration
- AI API integration
- Backend validation
- Secure API handling
- Frontend-backend communication
- Responsive web development

---

## 📄 License

This project is created for educational and academic purposes.
