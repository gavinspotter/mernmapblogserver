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

exports.getJournalsByUserId = getJournalsByUserId;
