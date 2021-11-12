const { StatusCodes } = require("http-status-codes");
const { describe } = require("jest-circus");
const supertest = require("supertest");
const app = require("../../app");
const { Beer } = require("../../models");
const { token, userId } = require("../constants");

const api = supertest(app);

describe("when no authenticated user is provided", () => {
  describe("GET /", () => {
    it("should return 401 when getting all beers", async () => {
      await api.get("/api/beer").expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("GET /:id", () => {
    it("should return 401 when getting a single", async () => {
      await api.get("/api/beer/2").expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("POST /", () => {
    it("should return 401 when creating a beer", async () => {
      await api
        .post("/api/beer")
        .send({
          name: "Yummy Beer",
          brewer: "My Favourite Brewery",
          rating: 5,
          date: new Date(),
        })
        .expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("PUT /:id", () => {
    it("should return 401 when editing a beer", async () => {
      await api
        .put("/api/beer/1")
        .send({
          name: "33 Acres of Life",
          brewer: "33 Acres",
          rating: 4,
          date: new Date(),
        })
        .expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 401 when deleting a beer", async () => {
      await api.delete("/api/beer/1").expect(StatusCodes.UNAUTHORIZED);
    });
  });
});

describe("when a user is authenticated", () => {
  describe("GET / ", () => {
    it("should fetch all beers", async () => {
      const res = await api
        .get("/api/beer")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(res.body).toHaveProperty("payload");
      expect(res.body.payload).toHaveLength(5);
    });
  });

  describe("GET /:id", () => {
    it("should fetch a single beer", async () => {
      const res = await api
        .get("/api/beer/2")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(res.body).toHaveProperty("payload");
      expect(res.body.payload).toHaveProperty("name", "Electric Unicorn");
    });

    it("should return 404 when beer is not found", async () => {
      const res = await api
        .get("/api/beer/8")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND);
    });
  });

  describe("POST /", () => {
    it("should create a beer successfully", async () => {
      const beersBefore = await Beer.findAll();
      const res = await api
        .post("/api/beer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Yummy Beer",
          brewer: "My Favourite Brewery",
          rating: 5,
          date: new Date(),
        })
        .expect(StatusCodes.CREATED);

      expect(res.body).toHaveProperty("payload");
      expect(res.body.payload).toHaveProperty("userId", userId);

      const beersAfter = await Beer.findAll();
      expect(beersAfter).toHaveLength(beersBefore.length + 1);
    });
  });

  describe("PUT /:id", () => {
    it("should update a beer when it was created by the authenticated user", async () => {
      const res = await api
        .put("/api/beer/1")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Updated Beer Name",
          brewer: "33 Acres",
          rating: 4.5,
          servingType: "bottle",
          beerType: "pale ale",
          abv: 5.3,
          ibu: null,
          notes:
            "This is a classic everyday beer made for glugging. Citrusy, hoppey and piney.",
          date: "2021-09-20",
        })
        .expect(StatusCodes.OK);

      expect(res.body).toHaveProperty("payload");
      expect(res.body.payload).toHaveProperty("name", "Updated Beer Name");
    });

    it("should return 401 when editing a beer created by a different user", async () => {
      const res = await api
        .put("/api/beer/2")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: 2,
          name: "Electric Unicorn",
          brewer: "Phillips",
          rating: 3.5,
          servingType: "can",
          beerType: "IPA",
          abv: 6.5,
          ibu: 75,
          notes:
            "A light, citrusy and bitter IPA. Great for sipping on the beach or watching a game",
          date: "2021-09-23",
        })
        .expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("DELETE /:id", () => {
    it("should delete a beer successfully when it was created by the authenticated user", async () => {
      const beersBefore = await Beer.findAll();
      await api
        .delete("/api/beer/1")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.NO_CONTENT);
      const beersAfter = await Beer.findAll();
      expect(beersAfter).toHaveLength(beersBefore.length - 1);
    });

    it("should return 404 when beer is not found", async () => {
      await api
        .delete("/api/beer/9")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.NOT_FOUND);
    });

    it("should return 401 when deleting a beer created by a different user", async () => {
      await api
        .delete("/api/beer/2")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.UNAUTHORIZED);
    });
  });
});
