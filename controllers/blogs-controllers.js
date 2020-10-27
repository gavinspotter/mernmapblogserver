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

const createBlog = (req, res, next) => {
  const { blgentry, creator } = req.body;
  const createdBlog = {
    id: uuidv4(),
    blgentry,
    creator,
  };

  DUMMY_BLOG.push(createdBlog);
  res.status(201).json({ blog: createdBlog });
};

const updateBlog = (req, res, next) => {
  const { blgentry } = req.body;
  const blogId = req.params.bid;

  const updateBlog = { ...DUMMY_BLOG.find((b) => b.id === blogId) };
  const blogIndex = DUMMY_BLOG.findIndex((b) => b.id === blogId);
  updateBlog.blgentry = blgentry;

  DUMMY_BLOG[blogIndex] = updateBlog;

  res.status(200).json({ blog: updateBlog });
};

const deleteBlog = (req, res, next) => {};

exports.getBlogsByUserId = getBlogsByUserId;

exports.createBlog = createBlog;

exports.updateBlog = updateBlog;

exports.deleteBlog = deleteBlog;
