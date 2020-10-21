const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

router.get("/:pid");

router.get("/user/:uid");

module.exports = router;
