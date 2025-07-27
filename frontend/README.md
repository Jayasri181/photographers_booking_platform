# Frontend - Photographer Booking Platform

## Setup
1. `cp .env.example .env` and fill in API URL, Cloudinary info
2. `npm install`
3. `npm run dev`

## Environment Variables
See `.env.example` for all required variables (API URL, Cloudinary).

## Features
- Responsive homepage with hero, CTA, featured photographers
- Search & filter photographers
- Photographer profile with portfolio, reviews, calendar
- Booking form with date/time, package, payment
- Packages page
- User login/signup (JWT)
- Admin dashboard
- Email confirmations
- Consistent navbar/footer
- Animations (Framer Motion)
- Optional: Google Maps, reviews, photographer self-management

## Project Structure
- `src/components/` - UI components
- `src/pages/` - Route pages
- `src/services/` - API calls
- `src/store/` - Redux/Context
- `src/data/` - Sample data

## Deployment
- Deploy to Vercel
- Set VITE_API_URL to backend API 