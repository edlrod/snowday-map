# Snowday Map

Real-time interactive map showing school closure and delay status for 121 Long Island, NY school districts. Data sourced from News 12 Long Island.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)

## Features

- **Interactive Map** — Leaflet-powered map with GeoJSON district boundaries
- **Real-Time Updates** — Fetches school closure data every 60 seconds
- **Color-Coded Status** — Red (closed), dark red (remote), yellow (delay), white/gray (open)
- **Date Selection** — View status for today, tomorrow, or other available dates
- **Dark Mode** — Automatic theme switching based on system preference
- **Responsive** — Works on desktop and mobile

## Getting Started

```bash
git clone https://github.com/nicholasblexrud/snowday-map.git
cd snowday-map
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run publish` | Deploy to GitHub Pages |

## Tech Stack

- **React 19** + **TypeScript** — UI framework
- **Leaflet** + **react-leaflet** — Interactive maps
- **Vite** — Build tool
- **Tailwind CSS 4** — Styling
- **Biome** — Linting and formatting
- **Husky** — Git hooks

## Project Structure

```
src/
├── components/
│   ├── DistrictMap.tsx   # Leaflet map with GeoJSON layers
│   ├── InfoPanel.tsx     # Date selector & last updated
│   ├── Legend.tsx        # Status color legend
│   └── Card.tsx          # Reusable card wrapper
├── hooks/
│   ├── useClosings.ts    # News 12 data fetching & matching
│   ├── useDistricts.ts   # GeoJSON district boundaries
│   └── useDarkMode.ts    # System theme detection
├── App.tsx
└── types.ts
public/
└── districts.geojson     # Long Island school district boundaries
```
