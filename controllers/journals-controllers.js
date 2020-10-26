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
  const journals = DUMMY_JOURNAL.filter((p) => {
    return p.creator === userId;
  });

  if (!journals || journals.length === 0) {
    return next(new HttpError("could not find journals"));
  }

  res.json({ journals });
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

const updateJournal = (req, res, next) => {};

const deleteJournal = (req, res, next) => {};

exports.getJournalsByUserId = getJournalsByUserId;
exports.createJournal = createJournal;
exports.updateJournal = updateJournal;
exports.deleteJournal = deleteJournal;
