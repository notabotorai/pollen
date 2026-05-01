# 🌿 PollenWatch

Real-time pollen monitoring app that shows severity scores, pollen types, and health recommendations for any location.

## Features

- **Search by city or zip code** with autocomplete suggestions
- **Severity gauge** showing overall pollen index (0–5 scale)
- **Pollen type breakdown** — Tree, Grass, and Weed levels
- **Plant species detail** — individual plant data with family, season, and cross-reaction info
- **5-day forecast** with daily pollen trends
- **Health recommendations** based on current pollen levels
- **Dark/Light mode** toggle
- **Responsive design** — works on desktop and mobile

## Tech Stack

- **Frontend:** Vite + Vanilla JS/CSS
- **Backend:** Express (local) / Vercel Serverless Functions (production)
- **APIs:** Google Pollen API, OpenStreetMap Nominatim (geocoding)

## Setup

```bash
# Install dependencies
npm install

# Add your Google Pollen API key
echo "GOOGLE_POLLEN_API_KEY=your_key_here" > server/.env

# Start the backend
npm run server

# Start the frontend (separate terminal)
npm run dev
```

Open **http://localhost:5173** — the app runs in demo mode if no API key is set.

## Get an API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the **Pollen API** under APIs & Services
3. Create an API key under Credentials
4. Add it to `server/.env`

## Deploy to Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `GOOGLE_POLLEN_API_KEY` as an environment variable
4. Deploy — serverless functions in `/api` handle the backend automatically

## License

MIT
