const express = require("express");
const router = express.Router();

const { isAuth, checkAndCreateRefreshToken } = require("../middleware/auth");

const { login, registration, loh } = require("../controllers/users");

router.get("/", loh);
router.post("/login", login);
router.post("/registration", registration);

module.exports = router;
