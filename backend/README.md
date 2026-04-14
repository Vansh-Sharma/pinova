# PinAI Backend

Production-ready Node.js + Express API with MongoDB (Mongoose) and JWT authentication.

## Quick Start

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   - `npm install`
3. Start API:
   - Dev: `npm run dev`
   - Prod: `npm start`

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    validators/
    app.js
    server.js
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token required)

### Pins
- `POST /api/pins` (Bearer token required)
- `GET /api/pins/feed?type=latest|trending&page=1&limit=20`
- `POST /api/pins/:pinId/like` (Bearer token required)
- `POST /api/pins/:pinId/save` (Bearer token required)

### Boards
- `POST /api/boards` (Bearer token required)
- `GET /api/boards/me` (Bearer token required)

## Notes

- `imageUrl` or `image` URL is accepted when creating a pin.
- Trending feed is sorted by `likesCount`, `savesCount`, then recency.
- Validation is enforced with `express-validator`.
- Centralized error handling is in middleware.
