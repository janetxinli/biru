const router = require("express").Router();
const userController = require("../controllers/user");
const { requireLogin } = require("../utils/middleware");

router.get("/", requireLogin, userController.getAll);

router.post("/", userController.createUser);

router.get("/search", requireLogin, userController.searchUsers);

router.get("/:username", requireLogin, userController.getUser);

router.get("/:username/profile", requireLogin, userController.getProfile);

router.post("/:id/follow", requireLogin, userController.followUser);

router.post("/:id/unfollow", requireLogin, userController.unfollowUser);

router.get("/:id/following", requireLogin, userController.getFollowing);

router.get("/:id/followers", requireLogin, userController.getFollowers);

router.get("/:id/feed", requireLogin, userController.getFeed);

module.exports = router;
