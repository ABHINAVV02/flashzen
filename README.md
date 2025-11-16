# FlashZen

FlashZen is a modern, interactive flashcard learning application designed to help users efficiently memorize and retain information through spaced repetition and gamification. Built with a React frontend and a Node.js/Express backend, it offers a seamless experience for creating, managing, and revising flashcards across various subjects.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication.
- **Deck Management**: Create, edit, and organize flashcard decks with tags and favorites.
- **Flashcard Creation**: Add, edit, and delete flashcards within decks, with support for tags.
- **Interactive Revision**: Flip cards with smooth animations, keyboard shortcuts, and configurable timers.
- **Progress Tracking**: Visual analytics, streak tracking, points, levels, and badges for gamification.
- **Leaderboard**: Compete with other users based on points and achievements.
- **User Profiles**: View personal stats, activity history, and manage settings.
- **Themes**: Light and dark mode support with customizable settings.
- **Responsive Design**: Optimized for desktop and mobile devices using Material-UI.

## Tech Stack

### Frontend

- **React**: UI library for building the user interface.
- **Vite**: Fast build tool and development server.
- **React Router**: Client-side routing.
- **Material-UI (MUI)**: Component library for consistent UI design.
- **Axios**: HTTP client for API requests.
- **Recharts**: Library for data visualization (charts and graphs).
- **Emotion**: CSS-in-JS styling.

### Backend

- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **JWT**: JSON Web Tokens for authentication.
- **bcryptjs**: Password hashing.
- **Nodemailer**: Email service (for future features like password reset).
- **CORS**: Cross-origin resource sharing.

### Development Tools

- **Jest**: Testing framework for backend.
- **Supertest**: HTTP endpoint testing.
- **ESLint**: Code linting.
- **Nodemon**: Auto-restart server during development.

## Architecture

The application follows a client-server architecture:

- **Frontend**: A single-page application (SPA) built with React, handling user interactions, routing, and state management.
- **Backend**: RESTful API server handling business logic, data persistence, and authentication.
- **Database**: MongoDB stores user data, decks, flashcards, revision statistics, and activity logs.

### Folder Structure

```
flashzen-revised/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts (e.g., AuthContext)
│   │   ├── utils/       # Utility functions (e.g., API calls)
│   │   └── styles/      # CSS and theme files
│   ├── public/          # Static assets
│   └── package.json
├── server/             # Node.js/Express API
│   ├── controllers/    # Route handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── middlewares/    # Custom middlewares (e.g., auth)
│   ├── utils/          # Utility functions (e.g., email service)
│   ├── tests/          # Unit tests
│   └── package.json
└── README.md           # This file
```

## Data Flow

1. **User Registration/Login**: User submits credentials → Backend validates/hashes password → JWT token issued → Stored in localStorage.
2. **Deck Creation**: Authenticated user creates a deck → Backend saves to MongoDB → Frontend updates UI.
3. **Flashcard Addition**: User adds flashcards to a deck → Backend associates with deck and user → Stored in database.
4. **Revision Session**: User starts revision → Backend fetches flashcards → User interacts (flip, mark correct/incorrect) → Backend records RevisionStats.
5. **Progress Tracking**: After each revision, stats are updated → Points, levels, streaks calculated → Leaderboard updated.
6. **Activity Logging**: All user actions (create, edit, revise) logged in Activity model for history and analytics.

### Database Models

- **User**: Stores user info, settings, points, level, streak, badges.
- **Deck**: Belongs to a user, contains title, description, tags, favorite status.
- **Flashcard**: Belongs to a deck, has question, answer, tags.
- **RevisionStats**: Tracks each flashcard review, including correctness and timestamp.
- **Activity**: Logs user actions for activity feed and analytics.

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the server directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/flashzen
   JWT_SECRET=your_jwt_secret_here
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```
4. Start the server:
   ```bash
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (default Vite port).

### Running Tests

For backend tests:

```bash
cd server
npm test
```

## Usage

1. **Register/Login**: Create an account or log in to access the app.
2. **Create Decks**: Go to the Library page to create and manage flashcard decks.
3. **Add Flashcards**: Within a deck, add questions and answers with optional tags.
4. **Revise**: Use the Revision page to practice flashcards with timers and shortcuts.
5. **Track Progress**: View stats, leaderboard, and achievements in your profile.
6. **Customize**: Adjust settings like theme, timer duration, and keyboard shortcuts.

### Keyboard Shortcuts (in Revision Mode)

- Space: Flip card
- Arrow Right: Mark as correct and next
- Arrow Left: Mark as incorrect and next
- Escape: Exit revision

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Decks

- `GET /api/decks` - Get user's decks (protected)
- `POST /api/decks` - Create a new deck (protected)
- `PUT /api/decks/:id` - Update a deck (protected)
- `DELETE /api/decks/:id` - Delete a deck (protected)

### Flashcards

- `GET /api/flashcards?deck=:deckId` - Get flashcards for a deck (protected)
- `POST /api/flashcards` - Create a new flashcard (protected)
- `PUT /api/flashcards/:id` - Update a flashcard (protected)
- `DELETE /api/flashcards/:id` - Delete a flashcard (protected)

### Revision

- `GET /api/revision/stats` - Get revision statistics (protected)
- `POST /api/revision/record` - Record a revision session (protected)

### Activity

- `GET /api/activity` - Get user activity log (protected)

All protected routes require a valid JWT token in the Authorization header: `Bearer <token>`.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License.
