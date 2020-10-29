const express = require("express");

const { check } = require("express-validator");

const journalsControllers = require("../controllers/journals-controllers");

const router = express.Router();

router.get("/user/:uid", journalsControllers.getJournalsByUserId);

router.post("/", journalsControllers.createJournal);

router.patch("/:jid", journalsControllers.updateJournal);

router.delete("/:jid", journalsControllers.deleteJournal);

module.exports = router;
