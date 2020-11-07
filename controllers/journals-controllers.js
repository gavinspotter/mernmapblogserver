const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Journal = require("../models/journal");
const blog = require("../models/blog");
const place = require("../models/place");

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

const updateJournal = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("invalid inputs passed", 422));
  }

  const { date, entry } = req.body;
  const journalId = req.params.jid;

  let journal;

  try {
    journal = await Journal.findById(journalId);
  } catch (err) {
    const error = new HttpError(
      "something went wrong could not update jounral",
      500
    );
    return next(error);
  }

  journal.date = date;
  journal.entry = entry;

  try {
    await journal.save();
  } catch (err) {
    const error = new HttpError(
      " something went wrong could not update journal",
      500
    );
    return next(error);
  }

  res.status(200).json({ journal: journal.toObject({ getters: true }) });
};

const deleteJournal = async (req, res, next) => {
  const journalId = req.params.jid;

  let journal;

  try {
    journal = await Journal.findById(journalId);
  } catch (err) {
    const error = new HttpError(
      " something went wrong could not locate journal",
      500
    );
    return next(error);
  }

  try {
    await journal.remove();
  } catch (err) {
    const error = new HttpError(
      "something went wrong could not remove journal",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "deleted journal entry" });
};

exports.getJournalsByUserId = getJournalsByUserId;
exports.createJournal = createJournal;
exports.updateJournal = updateJournal;
exports.deleteJournal = deleteJournal;
