# Reservation Management Service — Express + MongoDB

A small, production-style **room reservation API**. It lets you **search listings** and
**create bookings** while preventing **date-range overlaps**. Built with Express +
MongoDB (native driver), with seed data and a test that proves the overlap rule.

**Endpoints:** health • listings search • create booking  
**Stack:** Express, MongoDB (native driver), Helmet, CORS, Mocha/Supertest

---

## What it does
- A **backend API** that you can call from a web or mobile app.
- It exposes **search** over listings (e.g., city/keyword) and a **booking** endpoint.
- It **rejects clashing bookings**: if an existing booking intersects the requested dates,
  the API returns **409 Conflict** so users can pick new dates.
- Uses a small **seed** so you can test immediately; can also use MongoDB’s
  **`sample_airbnb`** dataset for richer searches.

---

## Quickstart

```bash
1. npm install – install dependencies  
2. Edit config.js with your Mongo Atlas URI + DB name  
3. npx nodemon server.js – start dev server  
4. Open <http://localhost:3000>
```
## Folder map
```
airbnb-booking-app/
├─ server.js         # Express entry
├─ config.js         # Secrets/constants
├─ src/              # Mongo helper + API routes
└─ public/           # HTML · JS · CSS
```

### Key API routes
| Method | Path | Purpose |
|--------|------|---------|
| GET    | `/api/listings?market=City` | Filtered search (case-insensitive) |
| GET    | `/api/listings/all`         | Random sample for homepage |
| POST   | `/api/bookings`             | Save booking (dates & fields validated) |

Listings remain read-only in **sample_airbnb.listingsAndReviews**.  
Bookings are stored separately in **bookings** with a `listing_id` reference.