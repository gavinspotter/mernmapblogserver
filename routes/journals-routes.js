const express = require("express");

const journalsControllers = require("../controllers/journals-controllers");

const router = express.Router();

router.get("/user/:uid", placesControllers.getJournalsByUserId);

router.post("/", placesControllers.createPlace);

router.patch("/:jid", placesControllers.updatePlace);

router.delete("/:jid", placesControllers.deletePlace);

module.exports = router;
