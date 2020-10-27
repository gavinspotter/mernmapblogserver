const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

let DUMMY_BLOG = [
  {
    id: "b1",
    blgentry: "this is my first blog",
    creator: "u1",
  },
];

const getBlogsByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const blog = DUMMY_BLOG.filter((b) => {
    return b.creator === userId;
  });

  if (!blog || blog.length === 0) {
    return next(new HttpError("could not find blog"));
  }

  res.json({ blog });
};

exports.getBlogsByUserId = getBlogsByUserId;
