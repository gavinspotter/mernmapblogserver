const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Blog = require("../models/blog");

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

const createBlog = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("invalid inputs passed", 422));
  }

  const { blgentry, creator } = req.body;
  const createdBlog = new Blog({
    blgentry,
    imge:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/The_judgement_of_the_dead_in_the_presence_of_Osiris.jpg",
    creator,
  });

  try {
    await createdBlog.save();
  } catch (err) {
    const error = new HttpError("create blog failed please try again", 500);
    return next(error);
  }

  res.status(201).json({ blog: createdBlog });
};

const updateBlog = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("invalid inputs passed", 422));
  }

  const { blgentry } = req.body;
  const blogId = req.params.bid;

  const updateBlog = { ...DUMMY_BLOG.find((b) => b.id === blogId) };
  const blogIndex = DUMMY_BLOG.findIndex((b) => b.id === blogId);
  updateBlog.blgentry = blgentry;

  DUMMY_BLOG[blogIndex] = updateBlog;

  res.status(200).json({ blog: updateBlog });
};

const deleteBlog = (req, res, next) => {
  const blogId = req.params.bid;
  DUMMY_BLOG = DUMMY_BLOG.filter((j) => j.id !== blogId);
  res.status(200).json({ message: "deleted blog post" });
};

exports.getBlogsByUserId = getBlogsByUserId;

exports.createBlog = createBlog;

exports.updateBlog = updateBlog;

exports.deleteBlog = deleteBlog;
