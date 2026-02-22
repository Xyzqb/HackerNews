const express = require("express");
const cors = require("cors");

const createStoryRoutes = require("./src/routes/storyRoutes");
const HackerNewsService = require("./src/services/hackerNewsService");
const StoryController = require("./src/controllers/storyController");
const cache = require("./src/cache/cache");

const app = express();
app.use(cors());
app.use(express.json());

// Dependency Injection
const hackerNewsService = new HackerNewsService();
const storyController = new StoryController(hackerNewsService, cache);

app.use("/api/stories", createStoryRoutes(storyController));

module.exports = { app, hackerNewsService, cache };