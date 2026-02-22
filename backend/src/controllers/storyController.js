class StoryController {
  constructor(service, cache) {
    this.service = service;
    this.cache = cache;
  }

  async getStories(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";

      let stories = this.cache.get("stories");

      if (!stories) {
        stories = await this.service.fetchNewestStories();
        this.cache.set("stories", stories);
      }

      const filtered = stories.filter((story) => {
        if (!story || !story.title) return false;
        if (!search) return true;
        return story.title.toLowerCase().includes(search.toLowerCase());
      });

      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      res.json({
        total: filtered.length,
        page: Number(page),
        data: paginated
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = StoryController;