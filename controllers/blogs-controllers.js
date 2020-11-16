const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");

const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Blog = require("../models/blog");
const User = require("../models/user");

const getBlogsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let blog;

  try {
    blog = await Blog.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "fetching blog posts failed, please try again",
      500
    );
    return next(error);
  }

  if (!blog || blog.length === 0) {
    return next(new HttpError("could not find blog"));
  }

  res.json({ blog: blog.map((blg) => blg.toObject({ getters: true })) });
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

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBlog.save({ session: sess });
    user.blogs.push(createdBlog);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("create blog failed please try again", 500);
    return next(error);
  }

  res.status(201).json({ blog: createdBlog });
};

const updateBlog = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new HttpError("invalid inputs passed", 422));
  }

  const { blgentry } = req.body;
  const blogId = req.params.bid;

  let blog;

  try {
    blog = await Blog.findById(blogId);
  } catch (err) {
    const error = new HttpError(
      " something went wrong could not update blog posts",
      500
    );
    return next(error);
  }

  blog.blgentry = blgentry;

  try {
    await blog.save();
  } catch (err) {
    const error = new HttpError(
      "something went wrong couldnt update blog",
      500
    );
    return next(error);
  }

  res.status(200).json({ blog: blog.toObject({ getters: true }) });
};

const deleteBlog = async (req, res, next) => {
  const blogId = req.params.bid;

  let blog;

  try {
    blog = await Blog.findById(blogId).populate("creator");
  } catch (err) {
    const error = new HttpError("something went from could not find blog", 500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await blog.remove({ session: sess });
    blog.creator.blogs.pull(blog);
    await blog.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "something went wrong could not delete blog post",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "deleted blog post" });
};

exports.getBlogsByUserId = getBlogsByUserId;

exports.createBlog = createBlog;

exports.updateBlog = updateBlog;

exports.deleteBlog = deleteBlog;
