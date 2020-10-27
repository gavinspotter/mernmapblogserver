const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

let DUMMY_BLOG = [
  {
    id: "b1",
    blgentry: "this is my first blog",
    creator: "u1",
  },
];

const getBlogsByUserId = (req, res, next) => {};

exports.getBlogsByUserId;
