const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

let DUMMY_JOURNAL = [
  {
    id: "j1",
    date: "october 25",
    entry: "my first entry",
    creator: "u1",
  },
];

const getJournalsByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const journal = DUMMY_JOURNAL.filter((p) => {
    return p.creator === userId;
  });

  if (!journal || journal.length === 0) {
    return next(new HttpError("could not find journals"));
  }

  res.json({ journal });
};

const createJournal = (req, res, next) => {
  const { date, entry, creator } = req.body;
  const createdJournal = {
    id: uuidv4(),
    date,
    entry,
    creator,
  };

  DUMMY_JOURNAL.push(createdJournal);

  res.status(201).json({ journal: createdJournal });
};

const updateJournal = (req, res, next) => {
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
