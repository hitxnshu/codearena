# CodeArena

CodeArena is a real-time competitive coding web app built with a React frontend and a Node.js + Express backend. It supports authenticated users, live battle rooms, code execution, and socket-powered matchmaking so two players can compete in head-to-head coding challenges.

## Key Features

- User registration and authentication
- Create/open live battle rooms
- Real-time code collaboration and room updates via Socket.IO
- Battle lifecycle management with room cleanup on disconnect
- Automatic stale room removal and lobby synchronization
- Code execution endpoint for challenge submissions

## Project Structure

- `client/` — React app for the user interface
  - `src/pages/` — main page components like `Home`, `Battle`, `Login`, and `Signup`
  - `src/components/` — shared UI components
  - `src/context/` — authentication state and user session logic

- `server/` — Node.js API and realtime server
  - `routes/` — REST endpoints for auth and battles
  - `socket.js` — Socket.IO room and lifecycle handling
  - `models/` — Mongoose schemas for users and battles
  - `middleware/` — auth middleware for protected routes

## Tech Stack

- Frontend: React, Vite, Axios, Socket.IO Client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- Authentication: JWT-based auth and protected API routes

## Getting Started

1. Install dependencies for both server and client:
   - `cd server && npm install`
   - `cd client && npm install`

2. Configure environment variables:
   - Create a `.env` file in `server/`
   - Set `MONGO_URI`, `PORT`, and `JWT_SECRET`

3. Run the server:
   - `cd server && npm start`

4. Run the client:
   - `cd client && npm run dev`

## Notes

- The current battle problem is a placeholder and can be replaced by a challenge selection system later.
- Socket rooms are only visible when a battle is created and remain synchronized across connected users.
- The app includes cleanup logic to remove empty or stale battle rooms automatically.

## Contributing

Feel free to extend the battle flow, improve challenge selection, add a leaderboard, or enhance matchmaking logic.

---

Built for live coding competition practice and real-time peer battles.