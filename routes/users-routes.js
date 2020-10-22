const express = require("express");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.get("/");

router.post("/signup");

router.post("/login");

module.exports = router;
