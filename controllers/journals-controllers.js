const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");

const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Journal = require("../models/journal");
const User = require("../models/user");

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

  let user;

  try {
    user = await User.findById(creator);
  } catch {
    const error = new HttpError("creating place failed please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("could not find user for provided id", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdJournal.save({ session: sess });
    user.journals.push(createdJournal);
    await user.save({ session: sess });
    await sess.commitTransaction();
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
    journal = await Journal.findById(journalId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      " something went wrong could not locate journal",
      500
    );
    return next(error);
  }

  if (!journal) {
    const error = new HttpError("could not find journal");
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await journal.remove({ session: sess });
    journal.creator.journals.pull(journal);
    await journal.creator.save({ session: sess });
    await sess.commitTransaction();
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
