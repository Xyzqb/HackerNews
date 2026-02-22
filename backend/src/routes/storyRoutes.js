const express = require("express");

module.exports = (controller) => {
  const router = express.Router();

  router.get("/", (req, res) => controller.getStories(req, res));

  return router;
};