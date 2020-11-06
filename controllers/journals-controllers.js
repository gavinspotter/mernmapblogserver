const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Journal = require("../models/journal");

let DUMMY_JOURNAL = [
  {
    id: "j1",
    date: "october 25",
    entry: "my first entry",
    creator: "u1",
  },
];

const getJournalsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let journal;

  try {
    journal = await Journal.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "fetching journals failed, please try again",
      500
    );
    return next(error);
  }

  if (!journal || journal.length === 0) {
    return next(new HttpError("could not find journals"));
  }

  res.json({
    journal: journal.map((jour) => jour.toObject({ getters: true })),
  });
};

const createJournal = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("invalid inputs passed", 422));
  }

  const { date, entry, creator } = req.body;
  const createdJournal = new Journal({
    date,
    entry,
    creator,
  });

  try {
    await createdJournal.save();
  } catch (err) {
    const error = new HttpError("created journal failed please try again", 500);
    return next(error);
  }

  res.status(201).json({ journal: createdJournal });
};

const updateJournal = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("invalid inputs passed", 422));
  }

  const { date, entry } = req.body;
  const journalId = req.params.jid;

  const updateJournal = { ...DUMMY_JOURNAL.find((j) => j.id === journalId) };
  const journalIndex = DUMMY_JOURNAL.findIndex((j) => j.id === journalId);
  updateJournal.date = date;
  updateJournal.entry = entry;

  DUMMY_JOURNAL[journalIndex] = updateJournal;

  res.status(200).json({ journal: updateJournal });
};

const deleteJournal = (req, res, next) => {
  const journalId = req.params.jid;
  DUMMY_JOURNAL = DUMMY_JOURNAL.filter((j) => j.id !== journalId);
  res.status(200).json({ message: "deleted journal entry" });
};

exports.getJournalsByUserId = getJournalsByUserId;
exports.createJournal = createJournal;
exports.updateJournal = updateJournal;
exports.deleteJournal = deleteJournal;
