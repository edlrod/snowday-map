# Snowday Map

A real-time interactive map showing school closure and delay status for all 112 Long Island, NY school districts. Data is sourced from News 12 Long Island's school closings database.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Features

- **Real-Time Updates** — Automatically fetches school closure data every 60 seconds
- **Interactive Map** — Pan and zoom to explore all Long Island school districts
- **Color-Coded Status** — Instantly see which schools are closed, delayed, remote, or open
- **Date Selection** — View status for today, tomorrow, or other available dates
- **Hover Tooltips** — Get detailed status information for each district

### Status Legend

| Color | Status |
|-------|--------|
| Red | Closed |
| Dark Red | Remote Learning |
| Yellow | Delayed |
| White | Open / Unknown |

## Getting Started

### Installation

```bash
git clone https://github.com/yourusername/snowday-map.git
cd snowday-map
bun install
```

### Development

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
bun run build
```

### Deploy to GitHub Pages

```bash
bun run publish
```

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type-safe development
- **Vite** — Build tool with HMR
- **Tailwind CSS** — Utility-first styling
- **Biome** — Code formatting and linting

## How It Works

1. The app fetches live school closure data from News 12 Long Island
2. District boundaries are rendered as SVG polygons on an interactive map
3. Each district is color-coded based on its current operational status
4. Data refreshes automatically every 60 seconds

## Project Structure

```
src/
├── components/
│   ├── DistrictMap.tsx   # Interactive SVG map
│   ├── InfoPanel.tsx     # Date selector & update info
│   ├── Legend.tsx        # Status color legend
│   ├── Tooltip.tsx       # Hover tooltips
│   └── Card.tsx          # Reusable card component
├── hooks/
│   ├── useClosings.ts    # Fetches News 12 data
│   ├── useDistricts.ts   # Loads district boundaries
│   └── usePanning.ts     # Map pan/zoom logic
├── App.tsx               # Root component
└── types.ts              # TypeScript interfaces
```
