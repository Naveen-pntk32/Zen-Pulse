process.env.NODE_ENV = "test";
process.env.ALLOW_MOCK_AUTH = "true";

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";

describe("ZenPulse Backend REST API Test Suite", () => {
  describe("Health Endpoint", () => {
    it("GET /api/health returns 200 and system status", async () => {
      const res = await request(app).get("/api/health");
      assert.equal(res.status, 200);
      assert.equal(res.body.status, "ok");
      assert.ok(typeof res.body.uptimeSeconds === "number");
      assert.ok(typeof res.body.database === "string");
    });
  });

  describe("Authentication Middleware & Security", () => {
    it("rejects unauthenticated request to /api/tasks with 401", async () => {
      const res = await request(app).get("/api/tasks");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects unauthenticated request to /api/projects with 401", async () => {
      const res = await request(app).get("/api/projects");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects unauthenticated request to /api/task-lists with 401", async () => {
      const res = await request(app).get("/api/task-lists");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects unauthenticated request to /api/habits with 401", async () => {
      const res = await request(app).get("/api/habits");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects unauthenticated request to /api/profile with 401", async () => {
      const res = await request(app).get("/api/profile");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects unauthenticated request to /api/settings with 401", async () => {
      const res = await request(app).get("/api/settings");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects unauthenticated request to /api/analytics/summary with 401", async () => {
      const res = await request(app).get("/api/analytics/summary");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects unauthenticated request to /api/search with 401", async () => {
      const res = await request(app).get("/api/search?q=test");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects unauthenticated request to /api/migrate with 401", async () => {
      const res = await request(app).post("/api/migrate").send({});
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects malformed token format without Bearer prefix", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Basic dXNlcjpwYXNz");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });
  });

  describe("Input Validation Middleware (Zod)", () => {
    it("rejects invalid task payload (missing title) with 400", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("x-mock-user-id", "00000000-0000-0000-0000-000000000001")
        .send({ description: "No title provided" });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "Validation failed");
      assert.ok(Array.isArray(res.body.details));
      assert.equal(res.body.details[0].field, "title");
    });

    it("rejects invalid project payload (empty name) with 400", async () => {
      const res = await request(app)
        .post("/api/projects")
        .set("x-mock-user-id", "00000000-0000-0000-0000-000000000001")
        .send({ name: "" });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "Validation failed");
    });

    it("rejects invalid subtask payload (empty title) with 400", async () => {
      const res = await request(app)
        .post("/api/subtasks/task/00000000-0000-0000-0000-000000000002")
        .set("x-mock-user-id", "00000000-0000-0000-0000-000000000001")
        .send({ title: "" });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "Validation failed");
    });

    it("rejects invalid habit payload (missing name) with 400", async () => {
      const res = await request(app)
        .post("/api/habits")
        .set("x-mock-user-id", "00000000-0000-0000-0000-000000000001")
        .send({ goalType: "simple" });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "Validation failed");
    });

    it("rejects invalid habit completion date format with 400", async () => {
      const res = await request(app)
        .post("/api/habit-completions")
        .set("x-mock-user-id", "00000000-0000-0000-0000-000000000001")
        .send({
          habitId: "00000000-0000-0000-0000-000000000002",
          date: "13-10-2026", // Invalid format, expected YYYY-MM-DD
        });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "Validation failed");
    });

    it("rejects invalid settings theme with 400", async () => {
      const res = await request(app)
        .patch("/api/settings")
        .set("x-mock-user-id", "00000000-0000-0000-0000-000000000001")
        .send({ theme: "neon-pink" });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "Validation failed");
    });

    it("rejects invalid focus session date format with 400", async () => {
      const res = await request(app)
        .post("/api/focus-sessions")
        .set("x-mock-user-id", "00000000-0000-0000-0000-000000000001")
        .send({
          startedAt: new Date().toISOString(),
          date: "not-a-date",
        });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "Validation failed");
    });
  });

  describe("AI Deep-Work Intelligence Endpoints", () => {
    it("rejects unauthenticated request to /api/ai/briefing with 401", async () => {
      const res = await request(app).get("/api/ai/briefing");
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("rejects unauthenticated request to /api/ai/decompose with 401", async () => {
      const res = await request(app).post("/api/ai/decompose").send({
        taskId: "00000000-0000-0000-0000-000000000001",
      });
      assert.equal(res.status, 401);
      assert.ok(res.body.error.includes("Unauthorized"));
    });

    it("GET /api/ai/briefing returns 200 and briefing payload for authenticated user", async () => {
      const res = await request(app)
        .get("/api/ai/briefing")
        .set("x-mock-user-id", "00000000-0000-0000-0000-000000000001");
      assert.equal(res.status, 200);
      assert.ok(res.body.date);
      assert.ok(typeof res.body.briefing === "string");
      assert.ok(res.body.stats);
    });

    it("POST /api/ai/decompose validates taskId UUID", async () => {
      const res = await request(app)
        .post("/api/ai/decompose")
        .set("x-mock-user-id", "00000000-0000-0000-0000-000000000001")
        .send({ taskId: "not-a-uuid" });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, "Validation failed");
    });
  });

  describe("API Routing & Not Found Handler", () => {
    it("returns 404 for unknown /api endpoint", async () => {
      const res = await request(app).get("/api/non-existent-route");
      assert.equal(res.status, 404);
      assert.equal(res.body.error, "Not Found");
    });
  });
});

