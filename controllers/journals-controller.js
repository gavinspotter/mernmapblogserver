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
