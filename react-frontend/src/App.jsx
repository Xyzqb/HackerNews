import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories, setPage } from "./features/storiesSlice";
import "./index.css";

/* ─── App ──────────────────────────────────────────────────────────────── */

export default function App() {
  const dispatch = useDispatch();
  const { items, total, page, loading, error } = useSelector(
    (state) => state.stories
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchStories({ page, search }));
  }, [dispatch, page, search]);

  const totalPages = Math.ceil(total / 10) || 1;
  const pageStart  = (page - 1) * 10 + 1;

  function handleSearch(e) {
    dispatch(setPage(1));
    setSearch(e.target.value);
  }

  function clearSearch() {
    dispatch(setPage(1));
    setSearch("");
  }

  return (
    <div className="hn-root">

      {/* ══════════════════════════════════════════ Header */}
      <header className="hn-header">

        {/* Logo */}
        <a href="/" className="hn-logo">
          <div className="hn-logo-badge">HN</div>
          <div className="hn-logo-wordmark">
            <span className="hn-logo-title">Hacker News</span>
            <span className="hn-logo-sub">Digest</span>
          </div>
        </a>

        <div className="hn-header-divider" />

        {/* Search */}
        <div className="hn-search-wrap">
          <span className="hn-search-icon">⌕</span>
          <input
            className="hn-search"
            type="text"
            placeholder="Search stories…"
            value={search}
            onChange={handleSearch}
            aria-label="Search stories"
          />
          {search && (
            <button
              className="hn-search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

      </header>

      {/* ══════════════════════════════════════════ Main */}
      <main className="hn-main">

        {/* Toolbar */}
        <div className="hn-toolbar">
          <div className="hn-toolbar-left">
            <span className="hn-toolbar-eyebrow">
              {search ? "Search results" : "Latest"}
            </span>
            <span className="hn-toolbar-label">
              {search ? `"${search}"` : "Newest Stories"}
            </span>
          </div>

          {!loading && total > 0 && (
            <div className="hn-toolbar-count">
              <strong>{total.toLocaleString()}</strong> stories
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="hn-error" role="alert">
            <span className="hn-error-icon">⚠</span>
            <span className="hn-error-text">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="hn-state" aria-live="polite">
            <div className="hn-spinner" role="status" aria-label="Loading" />
            <p className="hn-state-text">Fetching stories…</p>
          </div>
        )}

        {/* Story list */}
        {!loading && items.length > 0 && (
          <ul className="hn-list" aria-label="Stories">
            {items.map((story, i) => (
              <li key={story.id} className="hn-item">

                {/* Index */}
                <div className="hn-item-index" aria-hidden="true">
                  <span className="hn-item-num">{pageStart + i}</span>
                </div>

                {/* Content */}
                <div className="hn-item-body">
                  {story.url ? (
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hn-item-title"
                    >
                      {story.title}
                    </a>
                  ) : (
                    <span className="hn-item-title" style={{ cursor: "default" }}>
                      {story.title}
                    </span>
                  )}

                  <div className="hn-item-footer">
                    {story.url ? (
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hn-item-link"
                        aria-label={`Read article: ${story.title}`}
                      >
                        <span className="hn-item-link-arrow">↗</span>
                        Read Article
                      </a>
                    ) : (
                      <span className="hn-item-nolink">— No link available</span>
                    )}

                    <span className="hn-item-id" aria-label={`Story ID ${story.id}`}>
                      #{story.id}
                    </span>
                  </div>
                </div>

              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && !error && (
          <div className="hn-empty" role="status">
            <div className="hn-empty-icon">◎</div>
            <p className="hn-empty-title">Nothing found</p>
            <p className="hn-empty-sub">
              {search
                ? `No stories match "${search}"`
                : "No stories available right now"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && items.length > 0 && (
          <nav className="hn-pagination" aria-label="Pagination">
            <button
              className="hn-page-btn"
              disabled={page === 1}
              onClick={() => dispatch(setPage(page - 1))}
              aria-label="Previous page"
            >
              ← Prev
            </button>

            <div className="hn-page-info" aria-live="polite">
              <span className="hn-page-nums">{page} / {totalPages}</span>
              <span className="hn-page-label">Page</span>
            </div>

            <button
              className="hn-page-btn"
              disabled={page === totalPages}
              onClick={() => dispatch(setPage(page + 1))}
              aria-label="Next page"
            >
              Next →
            </button>
          </nav>
        )}

      </main>
    </div>
  );
}