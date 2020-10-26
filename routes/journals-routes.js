const express = require("express");

const journalsControllers = require("../controllers/journals-controllers");

const router = express.Router();

router.get("/user/:uid", journalsControllers.getJournalsByUserId);

router.post("/");

router.patch("/:jid");

router.delete("/:jid");

module.exports = router;
