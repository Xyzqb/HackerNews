class StoryController {
  constructor(service, cache) {
    this.service = service;
    this.cache = cache;
  }

  async getStories(req, res) {
    try {
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
      const search = (req.query.search || "").trim();
      const sort = (req.query.sort || "latest").toLowerCase();

      // 1️⃣ Get stories from cache or fetch fresh
      let stories = this.cache.get("stories");

      if (!stories || stories.length === 0) {
        console.log("📡 Cache miss - fetching fresh stories from API...");
        stories = await this.service.fetchNewestStories();
        if (stories && stories.length > 0) {
          this.cache.set("stories", stories);
          console.log(`✅ Cached ${stories.length} stories`);
        }
      }

      // 2️⃣ Filter stories by search term
      const filtered = stories.filter((story) => {
        if (!story || !story.title) return false;
        if (!search) return true;
        return story.title.toLowerCase().includes(search.toLowerCase());
      });

      // 3️⃣ Apply sorting (before pagination)
      if (sort === "oldest") {
        filtered.reverse();
      }
      // "latest" is default (newest first)

      // 4️⃣ Calculate pagination
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;

      // Validate page number
      if (page > totalPages && totalPages > 0) {
        return res.json({
          total: total,
          page: totalPages,
          totalPages: totalPages,
          limit: limit,
          data: [],
          message: `Page ${page} exceeds total pages (${totalPages}). Returning last page.`
        });
      }

      // 5️⃣ Slice for pagination (backend-side)
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = filtered.slice(start, end);

      return res.json({
        total: total,
        page: page,
        totalPages: totalPages,
        limit: limit,
        data: paginated,
        message: `Showing ${paginated.length} stories (${start + 1}-${start + paginated.length} of ${total})`
      });
    } catch (error) {
      console.error("Error in getStories:", error.message);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  }
}

module.exports = StoryController;