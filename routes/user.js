const router = require("express").Router();
const userController = require("../controllers/user");

router.get("/", userController.getAll);

router.get("/:id", userController.getUser);

router.get("/:id/beer", userController.getUsersBeers);

module.exports = router;
