const { app, hackerNewsService, cache } = require("./app");

const PORT = 5000;

// 🔄 Cache refresh interval (30 minutes)
const CACHE_REFRESH_INTERVAL = 30 * 60 * 1000;

console.log("Starting backend server...");
console.log("Pre-fetching stories from Hacker News in the background...");

// 📥 Initial fetch
hackerNewsService.fetchNewestStories()
  .then(stories => {
    if (stories && stories.length > 0) {
      cache.set("stories", stories);
      console.log(`✅ Pre-fetch complete. Cached ${stories.length} stories for backend pagination.`);
    } else {
      console.log("⚠ Pre-fetch returned no stories.");
    }
  })
  .catch(err => {
    console.error("❌ Pre-fetch failed:", err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Backend pagination enabled (supports up to 30 pages × 10 stories)`);
      console.log(`(Press Ctrl+C to stop)`);
    });
  });

// 🔄 Periodic cache refresh (every 30 minutes)
setInterval(() => {
  console.log("\n🔄 Refreshing cache...");
  hackerNewsService.fetchNewestStories()
    .then(stories => {
      if (stories && stories.length > 0) {
        cache.set("stories", stories);
        console.log(`✅ Cache refreshed: ${stories.length} stories updated`);
      }
    })
    .catch(err => {
      console.error("❌ Cache refresh failed:", err.message);
    });
}, CACHE_REFRESH_INTERVAL);

console.log(`\n⏰ Cache will refresh every 30 minutes`);