# Photographer Booking Platform

A full-stack platform for booking professional photographers, inspired by [photobooker.com](https://www.photobooker.com/).

## Tech Stack
- **Frontend:** React.js, Tailwind CSS, Axios, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT (access/refresh tokens)
- **Image Hosting:** Cloudinary
- **Payments:** Stripe
- **Email:** SMTP (nodemailer)
- **Deployment:** Vercel (frontend), Render/Railway (backend), MongoDB Atlas

## Features
- Responsive homepage with hero, CTA, and featured photographers
- Search & filter photographers by location, price, experience, availability
- Photographer profile with portfolio, bio, reviews, booking calendar
- Booking form with date/time picker, package selection, payment
- Packages page for different services (wedding, events, etc.)
- User login/signup (JWT)
- Admin dashboard for managing bookings, users, photographers
- Email confirmations for bookings
- Consistent navbar/footer, smooth animations
- Optional: Google Maps, reviews/ratings, photographer self-management

## Project Structure
```
Photographer_Booking_platform/
  backend/
    src/
      config/        # DB, Cloudinary, Stripe, SMTP configs
      controllers/   # Route logic
      middleware/    # Auth, error, upload
      models/        # Mongoose schemas
      routes/        # Express routes
      services/      # Business logic, email, payment
      utils/         # Helpers
    uploads/         # Local uploads (dev only)
    .env.example
    package.json
  frontend/
    src/
      components/    # Reusable UI
      pages/         # Route pages
      services/      # API calls
      store/         # Redux/Context
      data/          # Sample data
    public/
    .env.example
    package.json
  README.md
```

## Setup Instructions

### Backend
1. `cd backend`
2. `cp .env.example .env` and fill in secrets
3. `npm install`
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `cp .env.example .env` and fill in API URL
3. `npm install`
4. `npm run dev`

### Deployment
- Frontend: Deploy to Vercel
- Backend: Deploy to Render or Railway
- Use MongoDB Atlas for production DB

---

For detailed setup, see backend/frontend README files. 