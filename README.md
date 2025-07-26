# OxfordHouseConnect

OxfordHouseConnect is a web application designed to digitize operations for Oxford Houses. It provides residents and officers with a secure, role‑based interface for meeting minutes, house ledger, bed vacancy tracking, incident logs, and chapter‑level dashboards.

## Local Development

This project is built with **React 18** and **Vite** and uses **Tailwind CSS** for styling. It communicates with **Supabase** for authentication and data storage.

### Prerequisites

Ensure you have **Node.js** (v16 or later) installed. You should also create a Supabase project and obtain your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values.

### Setup

1. Copy `.env.example` to `.env` and populate the Supabase URL and anon key:

   ```bash
   cp .env.example .env
   # Then edit `.env` to set your Supabase credentials
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` by default.

### Deployment

This repository is configured for deployment on **Vercel**. When you create a Vercel project linked to this repository, set the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel dashboard. Vercel will handle building the project via `npm run build` and serve the production build.

After deployment, the live site should display the login page. Authenticated users are redirected to the `/dashboard` route, which is currently a blank page ready for further development.

## Scripts

- `npm run dev`: Start the Vite development server.
- `npm run build`: Build the project for production.
- `npm run preview`: Preview the production build locally.

## License

This project is intended for internal use within the Oxford House community.