# Test Teknologi Kode — Recipe Management App

This repository contains a simple recipe management application for a restaurant.

## Demo

### Preview (GIF)

![Demo preview](./Demo.gif)

### Full video (MP4)

[Demo.mp4](./Demo.mp4)

Note: GitHub README won’t autoplay MP4 inline. The GIF preview above will auto-play; click the MP4 link to play the full video.

**Core features**
- Categories (food categories)
- Ingredients (food ingredients)
- Recipes (grouped by category, composed of multiple ingredients + qty/unit)

The project is split into:
- `backend/` — Laravel API
- `frontend/` — Next.js dashboard UI

---

## Tech Stack

**Backend**
- PHP 8.3+
- Laravel 12

**Frontend**
- Next.js (App Router)
- React Query
- TanStack Table

---

## Prerequisites

- Node.js (recommended: latest LTS)
- pnpm (recommended) or npm
- PHP 8.3+
- Composer
- A database recomended: PostgreSQL

---

## Backend Setup (Laravel)

From the repository root:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your database in `backend/.env`.

Run migrations (and seeders if needed):

```bash
php artisan migrate
# optional
php artisan db:seed
```

Run the API server:

```bash
php artisan serve
```

By default Laravel serves on `http://127.0.0.1:8000`.

### Useful endpoints

- `GET /api/v1/lists/categories`
- `GET /api/v1/lists/ingredients`
- `GET /api/v1/recipes`
- `GET /api/v1/recipes/{uuid}`

---

## Frontend Setup (Next.js)

From the repository root:

```bash
cd frontend
pnpm install
```

Create an environment file `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

Run the frontend:

```bash
pnpm dev
```

Open `http://localhost:3000`.

---

## Development Notes

- The dashboard uses URL query params for table state (pagination/sorting/filters).
- Recipe details are available via the “View” action in the Recipes table.

---

## Scripts

**Frontend**
- `pnpm dev` — start Next.js dev server
- `pnpm build` — build for production

**Backend**
- `php artisan serve` — run API
- `php artisan migrate` — run migrations
- `php artisan db:seed` — run seeders

---

## Project Structure

```text
backend/   # Laravel API
frontend/  # Next.js dashboard
```

