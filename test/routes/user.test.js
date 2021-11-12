const { StatusCodes } = require("http-status-codes");
const supertest = require("supertest");
const { describe } = require("jest-circus");
const app = require("../../app");
const { token, username, name, bio, userId } = require("../constants");

const api = supertest(app);

describe("when no authenticated user is provided", () => {
  describe("GET / ", () => {
    it("should return 401 when getting all users", async () => {
      await api.get("/api/user").expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("GET /:id", () => {
    it("should return 401 when getting a single user", async () => {
      await api.get("/api/user/1").expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("GET /:id/beer", () => {
    it("should return 401 when getting beers of a single user", async () => {
      await api.get("/api/user/1/beer").expect(StatusCodes.UNAUTHORIZED);
    });
  });
});

describe("when a user is authenticated", () => {
  describe("GET / ", () => {
    it("should return all users", async () => {
      const res = await api
        .get("/api/user")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(res.body).toHaveProperty("payload");
    });
  });

  describe("GET /:id", () => {
    it("should return a single user", async () => {
      const res = await api
        .get("/api/user/1")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(res.body).toHaveProperty("payload");
      expect(res.body.payload).toHaveProperty("username");
      expect(res.body.payload).toHaveProperty("name");
      expect(res.body.payload).toHaveProperty("bio");
      expect(res.body.payload).not.toHaveProperty("password");
    });
  });

  describe("GET /:id/beer", () => {
    it("should return a list of beers of a single user", async () => {
      const res = await api
        .get("/api/user/1/beer")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(res.body).toHaveProperty("payload");
      expect(res.body.payload).toHaveProperty("Beers");
    });
  });
});
