const express = require("express");

const router = express.Router();

router.get("/:pid");

router.get("/user/:uid");

module.exports = router;
