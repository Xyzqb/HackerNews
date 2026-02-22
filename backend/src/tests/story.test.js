const request = require("supertest");
const app = require("../app");

describe("GET /api/stories", () => {
  it("should return stories", async () => {
    const res = await request(app).get("/api/stories");
    expect(res.statusCode).toBe(200);
  });
});