# Lost & Found Hub

Lost & Found Hub is a MERN application for housing societies to report lost or found items, search posts, and contact each other securely.

## Features

- JWT-based signup and login
- Lost and found post creation
- Image attachment support using base64 uploads
- Search by keyword and filter by post type or category
- Post detail pages with conversation history
- Inbox page for all user conversations
- Vercel-ready API routing with a Vite frontend

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Deployment: Vercel

## Local setup

1. Copy `.env.example` to `.env` and fill in the values.
2. Install dependencies:
   - `npm run install:all`
3. Start the backend:
   - `npm run backend:dev`
4. Start the frontend in another terminal:
   - `npm run frontend:dev`

The Vite development server proxies `/api/*` requests to `http://localhost:5000`.

## Vercel deployment

1. Import the repository into Vercel.
2. Keep the project root at the repository root.
3. Add these environment variables in Vercel:
   - `MONGO_URI`
   - `MONGO_DB_NAME` (optional)
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `VITE_API_BASE_URL` (leave empty to use same-origin API routes)
4. Deploy.

Vercel builds the frontend from `frontend/`, serves the output from `frontend/dist`, and routes `/api/*` requests to the serverless functions in `api/`.

## If Vercel still fails

- Make sure the Vercel project root is the repository root, not `frontend/` or `backend/`.
- Add the environment variables before redeploying, especially `MONGO_URI` and `JWT_SECRET`.
- Set `CLIENT_URL` to your deployed frontend domain, for example `https://your-project.vercel.app`.
- If an old deployment is cached, trigger a fresh redeploy after pulling the latest GitHub commit.
