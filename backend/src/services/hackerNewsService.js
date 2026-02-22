const axios = require("axios");

class HackerNewsService {
  async fetchNewestStories() {
    try {
      const idsRes = await axios.get(
        "https://hacker-news.firebaseio.com/v0/newstories.json",
        { timeout: 10000 }
      );

      const ids = (idsRes.data || []).slice(0, 100);

      const promises = ids.map((id) =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 10000 })
          .then(res => res.data)
          .catch(() => null)
      );

      const stories = await Promise.all(promises);

      // Filter out nulls from failed individual requests
      return stories.filter(Boolean);
    } catch (error) {
      console.error("Failed to fetch from Firebase:", error.message);
      return [];
    }
  }
}

module.exports = HackerNewsService;