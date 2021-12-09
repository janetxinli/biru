const router = require("express").Router();
const beerController = require("../controllers/beer");

router.get("/", beerController.getAll);

router.get("/:id", beerController.getBeer);

router.post("/", beerController.createBeer);

router.put("/:id", beerController.updateBeer);

router.delete("/:id", beerController.deleteBeer);

module.exports = router;
