const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const authorize = require("../middleware/authorize");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many request, try again later",
});

router.post("/register", controller.register);
router.post("/login", limiter, controller.login);
router.post("/verify", authorize, controller.verifyUser);
router.get("/users/:id", authorize, controller.getAllUsers);

module.exports = router;
