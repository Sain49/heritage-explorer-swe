# 🗺️ Heritage Explorer

A simple Next.js 15 + TypeScript app to explore Sweden’s cultural heritage sites. It uses OpenStreetMap (Nominatim/Overpass) for data, Wikidata for images, React Leaflet for maps, and Tailwind CSS for styling.

## 📑 Contents

- 📖 [About](#-about)
- ✨ [Features](#-features)
- 🛠 [Technologies](#-technologies)
- ⚙️ [Installation](#-installation)
- 📂 [Project Structure](#-project-structure)
- 🚀 [Workflow](#-workflow)
- 🤝 [Contributing](#-contributing)
- 📜 [License](#-license)

## 📖 About

This project helps you find museums, castles, monuments, and more across Sweden. You can search by name or category, zoom to popular areas, see results on a map, and view details (with optional images from Wikidata).

## ✨ Features

- Search
  - Search by name or category (vasa museum, museum, castle, monument, etc.)
  - Quick picks: featured museums and popular locations
- Map
  - Interactive map with markers (React Leaflet)
- Site details
  - Live OSM tags (address, phone, website, hours)
  - Optional Wikidata image and description
- UX
  - Pagination, loading and error states
  - Contact form with basic validation

## 🛠 Technologies

- Core: Next.js 15 (App Router), TypeScript
- UI: Tailwind CSS v4, Next Image/Font
- Map & Data: React Leaflet, OpenStreetMap (Nominatim + Overpass), Wikidata
- Parsing: fast-xml-parser

## ⚙️ Installation

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open http://localhost:3000

## 📂 Project Structure

- [app/](app) — pages, layouts, and routes (App Router)
- [components/](components) — reusable UI (map, forms, cards, etc.)
- [lib/](lib) — APIs and hooks (Nominatim/Overpass/Wikidata, search, pagination, site details)
- [data/](data) — featured content and predefined locations
- [types/](types) — shared TypeScript types
- [public/](public) — static assets (Leaflet marker icons, etc.)
- [next.config.ts](next.config.ts) — Next.js config (remote images)
- [package.json](package.json) — scripts and dependencies

## 🚀 Workflow

- Build one feature end-to-end using four stages:
  1. Structure & core logic
  2. Error handling & edge cases
  3. Styling & UX
  4. Refactoring & optimization

This keeps changes small, testable, and easy to learn from.

## 🤝 Contributing

- Use feature branches and clear commit messages
- Keep components small and typed
- Run the app and test locally before opening a PR

## 📜 License

Educational project. Not intended for production use.
