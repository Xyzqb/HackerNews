# Hacker News Live Feed - React Frontend

React frontend for displaying the newest Hacker News stories with search and pagination.

## Tech Stack

- React 19
- Vite
- Redux Toolkit (state management + async thunks)
- react-redux
- Vanilla CSS

## Features

- Fetches 100 newest stories from backend API
- Real-time keyword search (debounced)
- Pagination: 10 stories per page, 10 pages total
- Loading and error states
- External article links

## Project Structure

```
src/
├── app/store.js              # Redux store
├── features/storiesSlice.js  # Async thunk + slice state
├── App.jsx                   # Main component
├── index.css                 # Styles
└── main.jsx                  # Entry point
```

## Setup

```bash
npm install
npm run dev
```

App runs at http://localhost:5173

> Requires the backend to be running at http://localhost:5000

## API

```
GET /api/stories?page=1&limit=10&search=
```

Response:
```json
{
  "total": 100,
  "page": 1,
  "data": [{ "id": 1, "title": "...", "url": "...", "by": "..." }]
}
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Serve production build |
| `npm run lint` | Run ESLint |
