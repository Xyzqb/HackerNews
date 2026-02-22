const { app, hackerNewsService, cache } = require("./app");

const PORT = 5000;

console.log("Starting backend server...");
console.log("Pre-fetching stories from Hacker News in the background...");

hackerNewsService.fetchNewestStories()
  .then(stories => {
    if (stories && stories.length > 0) {
      cache.set("stories", stories);
      console.log("✅ Pre-fetch complete. API cache is now warm.");
    } else {
      console.log("⚠ Pre-fetch returned no stories.");
    }
  })
  .catch(err => {
    console.error("❌ Pre-fetch failed:", err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is successfully running and listening on port ${PORT}`);
      console.log(`(Press Ctrl+C to stop)`);
    });
  });