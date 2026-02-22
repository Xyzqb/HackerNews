# Hacker News Live Feed - Angular Frontend

Angular frontend for displaying the newest Hacker News stories with search and pagination.

## Tech Stack

- Angular 21 (Standalone Components)
- Angular CLI 21
- RxJS (reactive search with debounce)
- HttpClient (API communication)
- TypeScript
- Vanilla CSS

## Features

- Fetches 100 newest stories from backend API
- Real-time keyword search using RxJS debounceTime (350ms)
- Pagination: 10 stories per page, 10 pages total
- Skeleton loader while fetching
- Loading, empty, and error states
- External article links with hostname display

## Project Structure

```
src/app/
├── app.component.ts    # All component logic (state, HTTP, pagination, search)
├── app.component.html  # Template
├── app.component.css   # Styles
└── app.config.ts       # Providers (HttpClient)
```

## Setup

```bash
npm install
ng serve
```

App runs at http://localhost:4200

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

## Architecture Notes

Uses Angular's Standalone Components pattern (no NgModule).

Search is debounced with RxJS to avoid excessive API calls:
```ts
searchSubject.pipe(
  debounceTime(350),
  distinctUntilChanged(),
  takeUntil(this.destroy$)
).subscribe(() => this.loadStories());
```

The `takeUntil(destroy$)` pattern ensures all subscriptions are cleaned up when the component is destroyed, preventing memory leaks.

## Scripts

| Command | Description |
|---|---|
| `ng serve` / `npm start` | Start development server |
| `ng build` | Production build |
| `ng test` | Run unit tests |
