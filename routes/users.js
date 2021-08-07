const express = require("express");
const router = express.Router();

const { isAuth, checkAndCreateRefreshToken } = require("../middleware/auth");

const { login, registration } = require("../controllers/users");

router.post("/login", login);
router.post("/registration", registration);

module.exports = router;
