const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const authorize = require("../middleware/authorize");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/verify", authorize, controller.verifyUser);
router.get("/users/:id", authorize, controller.getAllUsers);

module.exports = router;
