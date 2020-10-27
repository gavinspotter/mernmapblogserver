const express = require("express");

const journalsControllers = require("../controllers/blogs-controllers");

const router = express.Router();

router.get("/user/:uid");

router.post("/");

router.patch("/:jid");

router.delete("/:jid");

module.exports = router;
