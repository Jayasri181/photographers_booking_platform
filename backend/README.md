# Backend - Photographer Booking Platform

## Setup
1. `cp .env.example .env` and fill in secrets
2. `npm install`
3. `npm run dev`

## Environment Variables
See `.env.example` for all required variables (MongoDB, JWT, Stripe, Cloudinary, SMTP).

## API Endpoints
- `/api/auth` - Auth (register, login, refresh)
- `/api/photographers` - CRUD, search, filter
- `/api/bookings` - Create, list, update
- `/api/packages` - CRUD, list
- `/api/reviews` - Add, list
- `/api/payments` - Stripe integration
- `/api/upload` - Cloudinary image upload

## Project Structure
- `src/models/` - Mongoose schemas
- `src/controllers/` - Route logic
- `src/routes/` - Express routes
- `src/services/` - Business logic, email, payment
- `src/middleware/` - Auth, error, upload
- `src/config/` - DB, Cloudinary, Stripe, SMTP configs
- `src/utils/` - Helpers

## Running in Development
- Uses nodemon for hot reload
- CORS enabled for frontend

## Seeding Sample Data
- Add scripts in `src/data/` or use MongoDB Compass

## Deployment
- Deploy to Render/Railway
- Use MongoDB Atlas
- Set all secrets in environment 