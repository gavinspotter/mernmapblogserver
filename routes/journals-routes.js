const express = require("express");

const journalsControllers = require("../controllers/journals-controllers");

const router = express.Router();

router.get("/user/:uid", placesControllers.getJournalsByUserId);

router.post("/", placesControllers.createJournal);

router.patch("/:jid", placesControllers.updateJournal);

router.delete("/:jid", placesControllers.deleteJournal);

module.exports = router;
