const { StatusCodes } = require("http-status-codes");
const supertest = require("supertest");
const app = require("../../app");
const { User } = require("../../models");
const { username, password } = require("../constants");

const api = supertest(app);

describe("POST /signup", () => {
  it("should successfully create a new user", async () => {
    const usersBefore = await User.findAll();
    const res = await api
      .post("/api/auth/signup")
      .send({
        username: "newuser",
        password: "test",
        name: "Test User",
        bio: "Lalala",
      })
      .expect(StatusCodes.CREATED);

    expect(res.body).toHaveProperty("message", "User created successfully");

    const usersAfter = await User.findAll();
    expect(usersAfter).toHaveLength(usersBefore.length + 1);
  });
});

describe("POST /login", () => {
  it("should successfully log a user in", async () => {
    const res = await api
      .post("/api/auth/login")
      .send({
        username,
        password,
      })
      .expect(StatusCodes.OK);

    expect(res.body.payload).toHaveProperty("token");
  });

  it("should return 401 if given a wrong username", async () => {
    // TODO: create custom callback to send 404 if nonexisting username is given
    const res = await api
      .post("/api/auth/login")
      .send({
        username: "wronguser",
        password,
      })
      .expect(StatusCodes.UNAUTHORIZED);
  });
});
