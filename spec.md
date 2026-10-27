# Mystery Investigation AI — Project Specification

## 1. Project Overview

### Project Name

**Mystery Investigation AI**

### Project Description

Mystery Investigation AI is a beginner-friendly full-stack web application where users investigate an AI-generated mystery case.

The user provides a mystery premise and selects a difficulty level. The application uses the **Gemini API** to generate a mystery containing a story, suspects, clues, and hints.

The player investigates the case by discovering clues and requesting hints. After investigation, the player selects and accuses a suspect. The backend validates the accusation, calculates the score, and reveals the culprit and explanation.

The application is designed as a small academic project and should avoid unnecessary advanced features.

---

# 2. Problem Statement

Traditional mystery games require manually written stories, suspects, clues, and solutions.

This project solves that problem by using generative AI to create different mystery cases dynamically.

The application should:

- Generate a mystery from a user-provided premise.
- Provide different difficulty levels.
- Allow users to investigate suspects and clues.
- Provide hints when requested.
- Prevent the culprit from being revealed before the accusation.
- Evaluate the user's accusation.
- Calculate a score based on the player's investigation.
- Display the final verdict and explanation.

---

# 3. Target Users

The primary users are:

- Students.
- Casual users interested in mystery games.
- Users who want short AI-generated detective challenges.

No account registration or login is required for the initial version.

---

# 4. Expected User Experience

The application should provide a simple and clear experience.

The user should be able to:

1. Open the website.
2. Understand the purpose of the application.
3. Enter a mystery premise.
4. Select Easy, Medium, or Hard difficulty.
5. Generate a mystery.
6. Read the story.
7. Examine suspects.
8. Discover available clues.
9. Request hints when necessary.
10. Make an accusation.
11. View the verdict and score.
12. Start another mystery.

The interface should be responsive and usable on both desktop and mobile screens.

---

# 5. Core Features

## 5.1 Mystery Generation

The user enters a premise such as:

> "A valuable necklace disappears during a wedding."

The user selects:

- Easy
- Medium
- Hard

The frontend sends the request to the backend.

The backend calls Gemini and requests a structured mystery.

The backend validates the generated response before storing it.

---

## 5.2 Difficulty Levels

| Difficulty | Suspects | Clues | Hints | Correct Accusation |
|------------|----------|-------|-------|--------------------|
| Easy | 3 | 5 | 2 | 100 points |
| Medium | 4 | 7 | 3 | 150 points |
| Hard | 5 | 9 | 3 | 200 points |

The generated mystery must follow the selected difficulty.

---

## 5.3 Investigation

The Investigation Room displays:

- Mystery title.
- Story.
- Suspect cards.
- Available clues.
- Discovered clues.
- Hint button.
- Investigation progress.
- Current score.

Users can discover clues one at a time.

A discovered clue cannot be discovered again.

---

## 5.4 Hints

The user can request hints during investigation.

Each used hint:

```text
-10 points
```

The number of hints available depends on the difficulty.

Once all available hints are used, the hint button should be disabled.

---

## 5.5 Accusation

After investigating, the user can proceed to the Accusation page.

The page displays all suspects.

The user selects one suspect and submits the accusation.

The backend determines whether the selected suspect is the actual culprit.

The frontend must not determine whether the accusation is correct.

---

## 5.6 Results

The Results page displays:

- Verdict.
- Correct culprit.
- User's accusation.
- Score.
- Explanation of the solution.
- Option to start another mystery.

Example:

```text
Verdict: Correct!

Culprit: Alex

Score: 135

Explanation:
The discovered clues show that Alex had access to the room
and was responsible for taking the necklace.
```

---

# 6. Optional Enhancements

These features are optional and should only be implemented if the core project is complete:

- Dark mode.
- Timer.
- Case history.
- Leaderboard.
- Animations.
- Sound effects.
- User accounts.
- Difficulty statistics.

These features are **not required** for the minimum project.

---

# 7. Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- Mongoose
- MongoDB
- Zod
- CORS
- dotenv

## AI

- Google Gemini API
- `@google/genai`

## Development Tools

- VS Code
- Git
- GitHub
- Postman or browser for API testing

---

# 8. Project Architecture

```text
Mystery Investigation AI
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
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
└── SPEC.md
```

The project should remain small. Do not introduce additional architectural layers unless they are necessary.

---

# 9. User Flow

## Step 1 — Open Website

The user opens the application.

The Home page is displayed.

---

## Step 2 — Create Mystery

The user clicks:

**Start Investigation**

The application navigates to `/create`.

The user enters:

- Mystery premise.
- Difficulty.

Example:

```text
Premise:
A priceless painting disappears from a private museum.

Difficulty:
Medium
```

The user clicks:

**Generate Mystery**

---

## Step 3 — Generate Mystery

The frontend sends:

```http
POST /api/cases
```

The backend:

1. Validates the premise.
2. Validates the difficulty.
3. Sends a structured prompt to Gemini.
4. Receives the generated mystery.
5. Validates the Gemini response using Zod.
6. Saves the case to MongoDB.
7. Returns the case ID and safe investigation data.

The culprit and solution must remain protected on the backend.

---

## Step 4 — Investigation

The user is redirected to:

```text
/investigation/:id
```

The page displays:

- Story.
- Suspects.
- Clues available for discovery.
- Hints.
- Progress.

The user discovers clues and optionally requests hints.

---

## Step 5 — Accusation

The user clicks:

**Make Accusation**

The application navigates to:

```text
/accusation/:id
```

The user selects a suspect and submits the accusation.

---

## Step 6 — Backend Evaluation

The backend:

1. Retrieves the case.
2. Checks the selected suspect.
3. Compares it with the stored culprit.
4. Calculates the final score.
5. Marks the case as completed.
6. Stores the accusation.
7. Returns the result.

---

## Step 7 — Results

The application navigates to:

```text
/results/:id
```

The user sees:

- Correct/incorrect verdict.
- Culprit.
- Explanation.
- Score.

---

## Step 8 — New Mystery

The user clicks:

**Start Another Mystery**

The application returns to `/create`.

---

# 10. Page Specifications

## 10.1 Home Page

### Route

```text
/
```

### Purpose

Introduce the application and allow the user to begin a mystery.

### Required Elements

- Application name.
- Short description.
- Brief instructions.
- Start Investigation button.

### Button

```text
Start Investigation
```

Navigates to:

```text
/create
```

---

# 10.2 Create Mystery Page

### Route

```text
/create
```

### Purpose

Collect the mystery premise and difficulty.

### Required Elements

#### Premise Input

A textarea.

Placeholder:

```text
Enter a mystery premise...
```

#### Difficulty

Three options:

```text
Easy
Medium
Hard
```

#### Generate Button

```text
Generate Mystery
```

### Validation

The premise:

- Must not be empty.
- Must contain a reasonable amount of text.
- Should not exceed the defined maximum length.

Recommended maximum:

```text
500 characters
```

### Loading State

After clicking Generate Mystery:

```text
Generating your mystery...
```

The button should be disabled while generation is in progress.

---

# 10.3 Investigation Room

### Route

```text
/investigation/:id
```

### Purpose

Allow the player to investigate the mystery.

### Required Elements

#### Mystery Information

- Title.
- Story.
- Difficulty.

#### Suspect Cards

Each card should contain:

- Suspect name.
- Short description.
- Optional basic information.

The card must not reveal whether the suspect is the culprit.

#### Clues

Display available clues.

A clue should initially appear as:

```text
Clue #1
[Discover Clue]
```

After discovery:

```text
Clue #1

<clue text>
```

#### Hints

Display:

```text
Hints remaining: X
```

Button:

```text
Get Hint
```

After requesting a hint, display the hint.

#### Progress

Display something simple such as:

```text
Clues discovered: 3 / 7
Hints used: 1 / 3
```

#### Accusation Button

```text
Make Accusation
```

---

# 10.4 Accusation Page

### Route

```text
/accusation/:id
```

### Purpose

Allow the player to select a suspect.

### Required Elements

- Mystery title.
- Suspect list.
- Radio buttons or selectable suspect cards.
- Submit Accusation button.

The user must select one suspect before submitting.

### Confirmation

Before submission, display:

```text
Are you sure you want to accuse this suspect?
```

The user can confirm or cancel.

---

# 10.5 Results Page

### Route

```text
/results/:id
```

### Required Elements

- Verdict.
- User accusation.
- Correct culprit.
- Final score.
- Explanation.
- Start Another Mystery button.

Example:

```text
CASE CLOSED

Your accusation: Alex

Verdict: Correct

Culprit: Alex

Score: 135

Explanation:
The clues revealed that Alex had access to the
location and had the opportunity to commit the crime.

[Start Another Mystery]
```

---

# 11. Loading States

The application must provide feedback whenever an API request is being processed.

Examples:

### Mystery Generation

```text
Generating mystery...
```

### Clue Discovery

```text
Revealing clue...
```

### Hint Request

```text
Generating hint...
```

### Accusation

```text
Checking your accusation...
```

Buttons involved in the request must be disabled while loading.

---

# 12. Error Handling

The application should display user-friendly error messages.

### Invalid Premise

```text
Please enter a mystery premise.
```

### Invalid Difficulty

```text
Please select a difficulty level.
```

### Gemini Error

```text
Unable to generate the mystery. Please try again.
```

### Case Not Found

```text
Mystery case not found.
```

### Database Error

```text
Something went wrong. Please try again later.
```

### Network Error

```text
Unable to connect to the server.
Please check your connection and try again.
```

Errors should not expose API keys, database information, stack traces, or internal server details.

---

# 13. Navigation

React Router should be used.

Routes:

```text
/                       Home
/create                 Create Mystery
/investigation/:id      Investigation Room
/accusation/:id         Accusation
/results/:id            Results
```

Navigation should be controlled by the application flow.

The user should not be able to access another case simply by modifying an ID and receive another player's private game state.

---

# 14. Responsive Design

The application must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Tailwind CSS responsive utilities should be used.

On mobile:

- Suspect cards should stack vertically.
- Clues should be displayed vertically.
- Buttons should be large enough to tap.
- Text should remain readable.
- No horizontal scrolling should occur.

---

# 15. Backend API

## 15.1 Generate Mystery

### Endpoint

```http
POST /api/cases
```

### Request

```json
{
  "premise": "A valuable necklace disappears during a wedding.",
  "difficulty": "easy"
}
```

### Response

```json
{
  "success": true,
  "caseId": "CASE_ID",
  "case": {
    "title": "The Missing Necklace",
    "story": "...",
    "difficulty": "easy",
    "suspects": [
      {
        "id": "s1",
        "name": "Alex",
        "description": "..."
      }
    ],
    "clues": [
      {
        "id": "c1",
        "text": "..."
      }
    ],
    "hintsRemaining": 2
  }
}
```

The response must **not contain**:

```text
culprit
solution
```

---

# 15.2 Retrieve Case

### Endpoint

```http
GET /api/cases/:id
```

### Purpose

Retrieve the current investigation state.

### Response

The response should contain only information that the player is currently allowed to see.

The culprit and complete solution must not be included before accusation.

---

# 15.3 Discover Clue

### Endpoint

```http
POST /api/cases/:id/clues/:clueId/discover
```

### Request

No request body is required.

### Response

```json
{
  "success": true,
  "clue": {
    "id": "c1",
    "text": "A broken watch was found near the window."
  },
  "score": 5
}
```

The same clue cannot provide points more than once.

---

# 15.4 Request Hint

### Endpoint

```http
POST /api/cases/:id/hints
```

### Request

No request body is required.

### Response

```json
{
  "success": true,
  "hint": "Look closely at who had access to the room.",
  "hintsRemaining": 1,
  "score": 40
}
```

The backend must ensure the maximum number of hints cannot be exceeded.

---

# 15.5 Submit Accusation

### Endpoint

```http
POST /api/cases/:id/accuse
```

### Request

```json
{
  "suspectId": "s2"
}
```

### Response

```json
{
  "success": true,
  "correct": true,
  "score": 135
}
```

The backend performs the actual comparison.

---

# 15.6 Retrieve Result

### Endpoint

```http
GET /api/cases/:id/result
```

### Response

```json
{
  "success": true,
  "result": {
    "accusation": "Alex",
    "culprit": "Alex",
    "correct": true,
    "score": 135,
    "explanation": "..."
  }
}
```

This endpoint should only reveal the culprit after the case has been completed.

---

# 16. API Validation

Zod should be used for request validation.

### Create Case Validation

```text
premise:
- required
- string
- maximum 500 characters

difficulty:
- required
- one of:
  easy
  medium
  hard
```

### Accusation Validation

```text
suspectId:
- required
- string
```

Invalid requests should return:

```http
400 Bad Request
```

Example:

```json
{
  "success": false,
  "message": "Invalid request data."
}
```

---

# 17. Database Design

MongoDB should store each mystery as a case document.

## Case Model

```text
Case
│
├── title
├── premise
├── story
├── difficulty
├── suspects
├── clues
├── hints
├── culprit
├── solution
├── discoveredClues
├── hintsUsed
├── accusation
├── score
└── completed
```

### Suggested Schema

```javascript
{
  title: String,
  premise: String,
  story: String,

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"]
  },

  suspects: [
    {
      id: String,
      name: String,
      description: String
    }
  ],

  clues: [
    {
      id: String,
      text: String,
      discovered: Boolean
    }
  ],

  hints: [String],

  culprit: String,

  solution: String,

  discoveredClues: [String],

  hintsUsed: {
    type: Number,
    default: 0
  },

  accusation: {
    type: String,
    default: null
  },

  score: {
    type: Number,
    default: 0
  },

  completed: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

# 18. Security Requirements

Security is an important requirement.

## 18.1 Gemini API Key

The Gemini API key must exist only in the backend `.env` file.

Never write:

```javascript
const API_KEY = "actual-key";
```

in frontend code.

---

## 18.2 MongoDB Credentials

MongoDB credentials must also remain in `.env`.

---

## 18.3 Environment Variables

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

---

## 18.4 Git

`.env` must be included in `.gitignore`.

```gitignore
node_modules/
.env
```

Never commit API keys or database credentials to GitHub.

---

# 19. Culprit Protection

The culprit and solution are sensitive game information.

Before the accusation:

```text
Frontend
   ↓
Story
Suspects
Available clues
Discovered clues
Hints
Progress
```

The frontend must NOT receive:

```text
Culprit
Full solution
```

The backend keeps these values in MongoDB.

Only after the user submits an accusation should the backend reveal:

```text
Culprit
Verdict
Explanation
Final score
```

This requirement must be enforced on the backend rather than relying on frontend hiding.

---

# 20. Gemini AI Behavior

Gemini should generate a logically consistent mystery.

The generated mystery must contain:

- One clear culprit.
- Correct number of suspects.
- Correct number of clues.
- Correct number of hints.
- A coherent story.
- A solution supported by the clues.
- No contradictory clues.
- A solution that can reasonably be inferred from the evidence.

---

# 21. Expected Gemini Output

The backend should request structured JSON similar to:

```json
{
  "title": "The Missing Necklace",
  "story": "A valuable necklace disappears during a wedding...",
  "suspects": [
    {
      "id": "s1",
      "name": "Alex",
      "description": "..."
    },
    {
      "id": "s2",
      "name": "Maya",
      "description": "..."
    },
    {
      "id": "s3",
      "name": "Daniel",
      "description": "..."
    }
  ],
  "clues": [
    {
      "id": "c1",
      "text": "..."
    }
  ],
  "hints": [
    "..."
  ],
  "culprit": "s2",
  "solution": "..."
}
```

The backend must validate this response before saving it.

---

# 22. AI Output Validation

After Gemini returns the response, the backend must validate:

### Easy

```text
3 suspects
5 clues
2 hints
```

### Medium

```text
4 suspects
7 clues
3 hints
```

### Hard

```text
5 suspects
9 clues
3 hints
```

The backend must also verify that:

- A culprit exists.
- The culprit matches one of the suspects.
- The title exists.
- The story exists.
- All clues contain text.
- All hints contain text.
- The generated response follows the expected structure.

If validation fails, the case should not be saved.

The server should return an appropriate error.

---

# 23. Scoring System

The backend is responsible for all scoring.

## Base Score

| Difficulty | Base Score |
|------------|------------|
| Easy | 100 |
| Medium | 150 |
| Hard | 200 |

## Clue Score

```text
Every discovered clue = +5
```

## Hint Penalty

```text
Every hint used = -10
```

## Correct Accusation

The player receives the difficulty's base score if the accusation is correct.

Recommended formula:

```text
Final Score =
Base Score
+ (Discovered Clues × 5)
- (Hints Used × 10)
```

If the accusation is incorrect, the base score is not awarded.

The final score must never be negative.

```text
Minimum Score = 0
```

Example:

```text
Difficulty: Easy
Base Score: 100

Clues discovered: 4
4 × 5 = 20

Hints used: 1
1 × 10 = 10

Final score:
100 + 20 - 10 = 110
```

The backend must calculate this value.

---

# 24. Scoring Security

The frontend must never send the final score to the backend as a trusted value.

Incorrect:

```json
{
  "score": 500
}
```

The backend should instead calculate:

```text
discovered clues
+
difficulty
-
hints used
```

and determine the final score itself.

This prevents users from manipulating their score through browser developer tools.

---

# 25. Backend Error Handling

The Express server should use centralized error handling where practical.

Errors should return a consistent structure:

```json
{
  "success": false,
  "message": "Something went wrong."
}
```

Expected status codes:

```text
200 → Successful request
201 → Case created
400 → Invalid request
404 → Case not found
500 → Server error
```

Internal error details should be logged on the server but not exposed to the user.

---

# 26. Frontend API Service

Axios should be used for communication with the backend.

A central API service should handle requests such as:

```text
createCase()
getCase()
discoverClue()
requestHint()
submitAccusation()
getResult()
```

The React pages should use these functions instead of repeatedly writing Axios configuration.

---

# 27. Frontend State

The application should maintain only the state necessary for the current investigation.

Examples:

```text
case
loading
error
selectedSuspect
discoveredClues
hints
```

Do not introduce Redux or another global state management library unless it becomes necessary.

React state and simple API calls are sufficient for this project.

---

# 28. Project Setup

## Frontend

```bash
npm create vite@latest client -- --template react

cd client

npm install

npm install react-router-dom axios
```

Tailwind CSS should then be configured for the project.

---

## Backend

From the project root:

```bash
mkdir server

cd server

npm init -y

npm install express cors dotenv mongoose @google/genai zod

npm install --save-dev nodemon
```

---

# 29. Environment Configuration

Create:

```text
server/.env
```

Contents:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

The actual credentials must never be committed to GitHub.

---

# 30. Development Scripts

The backend `package.json` should contain scripts similar to:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

---

# 31. CORS

The Express backend should allow requests from the configured frontend URL.

Development:

```text
http://localhost:5173
```

The value should come from:

```text
CLIENT_URL
```

rather than being permanently hardcoded.

---

# 32. Deployment

The application should be deployable as:

```text
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas
```

The Gemini API key must be configured as a backend environment variable on the deployment platform.

The deployed frontend must communicate with the deployed backend URL.

---

# 33. Deployment Environment Variables

### Backend

```text
PORT
MONGODB_URI
GEMINI_API_KEY
CLIENT_URL
```

### Frontend

If an API base URL is required, it should use a Vite environment variable such as:

```text
VITE_API_URL
```

No Gemini secret key should be placed in frontend environment variables.

---

# 34. Acceptance Criteria

The project is considered complete when all of the following conditions are satisfied.

## Mystery Creation

- [ ] User can open the application.
- [ ] User can enter a mystery premise.
- [ ] User can select Easy.
- [ ] User can select Medium.
- [ ] User can select Hard.
- [ ] A mystery can be generated successfully.
- [ ] Generated data is validated before being saved.

## Investigation

- [ ] Story is displayed.
- [ ] Correct number of suspects is displayed.
- [ ] Correct number of clues is generated.
- [ ] User can discover clues.
- [ ] A clue cannot award points more than once.
- [ ] User can request hints.
- [ ] Hint limits are enforced.
- [ ] Investigation progress is displayed.

## Security

- [ ] Gemini API key is stored only on the backend.
- [ ] MongoDB credentials are stored only on the backend.
- [ ] `.env` is ignored by Git.
- [ ] Culprit is not exposed before accusation.
- [ ] Solution is not exposed before accusation.
- [ ] Score is calculated on the backend.

## Accusation

- [ ] User can select a suspect.
- [ ] User can submit an accusation.
- [ ] Backend determines whether the accusation is correct.
- [ ] User cannot manipulate the score from the frontend.

## Results

- [ ] Correct verdict is displayed.
- [ ] Correct culprit is displayed after accusation.
- [ ] Explanation is displayed.
- [ ] Final score is displayed.
- [ ] Score cannot be below zero.
- [ ] User can start another mystery.

## UI

- [ ] All required pages exist.
- [ ] Loading states are displayed.
- [ ] Errors are handled.
- [ ] Navigation works correctly.
- [ ] UI is responsive.
- [ ] Application works on the deployed website.

---

# 35. Final Deliverables

The final project must contain:

```text
1. Complete React frontend
2. Complete Express backend
3. MongoDB/Mongoose integration
4. Gemini API integration
5. Validated AI-generated mysteries
6. Investigation functionality
7. Hint functionality
8. Accusation functionality
9. Backend scoring
10. Results page
11. Responsive UI
12. Environment configuration
13. .gitignore
14. README.md
15. SPEC.md
16. Deployed working application
```

---

# 36. Project Limitations

The initial version intentionally does not include:

- User authentication.
- Multiple user accounts.
- Multiplayer.
- Real-time communication.
- Leaderboards.
- Payment functionality.
- Complex admin dashboards.
- Advanced analytics.
- Large-scale game history.
- Complex state management.

These features may be added later but are outside the core project scope.

---

# 37. Definition of Done

The project is complete when a new user can perform the following journey without developer assistance:

```text
Open Website
      ↓
Enter Mystery Premise
      ↓
Select Difficulty
      ↓
Generate Mystery
      ↓
Read Story
      ↓
Investigate Suspects
      ↓
Discover Clues
      ↓
Use Optional Hints
      ↓
Make Accusation
      ↓
Backend Validates Answer
      ↓
Score Calculated
      ↓
Culprit Revealed
      ↓
Explanation Displayed
      ↓
Start Another Mystery
```

The application should remain **small, beginner-friendly, functional, and secure**, with the backend responsible for AI validation, culprit protection, accusation checking, and scoring.