const { StatusCodes } = require("http-status-codes");
const { describe } = require("jest-circus");
const supertest = require("supertest");
const app = require("../../app");
const db = require("../../models");

const api = supertest(app);

describe("GET", () => {
  it("should fetch all beers", async () => {
    const res = await api.get("/api/beer").expect(StatusCodes.OK);

    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveLength(5);
  });

  it("should fetch a single beer", async () => {
    const res = await api.get("/api/beer/2").expect(StatusCodes.OK);

    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveProperty("name", "Electric Unicorn");
  });

  it("should return 404 when beer is not found", async () => {
    const res = await api.get("/api/beer/8").expect(StatusCodes.NOT_FOUND);
  });
});

describe("POST", () => {
  it("should create a beer successfully", async () => {
    const beersBefore = await db.Beer.findAll();
    const res = await api
      .post("/api/beer")
      .send({
        name: "Yummy Beer",
        brewer: "My Favourite Brewery",
        rating: 5,
        date: new Date(),
      })
      .expect(StatusCodes.CREATED);

    expect(res.body).toHaveProperty("payload");

    const beersAfter = await db.Beer.findAll();
    expect(beersAfter).toHaveLength(beersBefore.length + 1);
  });
});

describe("PUT", () => {
  it("should update a beer", async () => {
    const res = await api
      .put("/api/beer/3")
      .send({
        name: "Updated Name",
        brewer: "33 Acres",
        rating: 4,
        servingType: "can",
        beerType: "IPA",
        abv: 6.5,
        date: new Date("2021-10-01"),
        notes: "This is a lovely hazy IPA with citrusy notes.",
      })
      .expect(StatusCodes.OK);

    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveProperty("name", "Updated Name");
  });
});

describe("DELETE", () => {
  it("should delete a beer successfully", async () => {
    const beersBefore = await db.Beer.findAll();
    await api.delete("/api/beer/4").expect(StatusCodes.NO_CONTENT);
    const beersAfter = await db.Beer.findAll();
    expect(beersAfter).toHaveLength(beersBefore.length - 1);
  });

  it("should return 404 when beer is not found", async () => {
    await api.delete("/api/beer/9").expect(StatusCodes.NOT_FOUND);
  });
});

afterAll(() => {
  db.sequelize.close();
});
