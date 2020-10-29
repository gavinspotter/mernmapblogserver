const express = require("express");

const { check } = require("express-validator");

const journalsControllers = require("../controllers/journals-controllers");

const router = express.Router();

router.get("/user/:uid", journalsControllers.getJournalsByUserId);

router.post(
  "/",
  [check("date").isLength({ min: 3 }), check("entry").not().isEmpty()],
  journalsControllers.createJournal
);

router.patch(
  "/:jid",
  [check("date").isLength({ min: 3 }), check("entry").not().isEmpty()],
  journalsControllers.updateJournal
);

router.delete("/:jid", journalsControllers.deleteJournal);

module.exports = router;
