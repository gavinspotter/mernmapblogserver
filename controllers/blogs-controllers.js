const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");

const mongoose = require("mongoose");

const fs = require("fs")

const HttpError = require("../models/http-error");
const Blog = require("../models/blog");
const User = require("../models/user");


const getBlogById = async (req, res, next) => {
  const blogId = req.params.bid

  let blog

  try {
    blog = await Blog.findById(blogId)
  } catch (err) {
    const error = new HttpError("couldnt find blog", 500)
    return next(error)
  }

  if (!blog) {
    const error = new HttpError("couldnt find a blog", 404)
    return next(error)
  }

  res.json({ blog: blog.toObject({ getters: true }) })
}

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

  const { blgentry } = req.body;
  const createdBlog = new Blog({
    blgentry,
    imge: req.file.path,
    creator: req.userData.userId,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
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

  if (blog.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "you are not allowed to edit this blog",
      401
    )
    return next(error)
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

  if (blog.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "you are not allowed to edit this blog",
      401
    )
    return next(error)
  }

  const imagePath = blog.imge

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

  fs.unlink(imagePath, err => {
    console.log(err)
  })

  res.status(200).json({ message: "deleted blog post" });
};

exports.getBlogById = getBlogById

exports.getBlogsByUserId = getBlogsByUserId;

exports.createBlog = createBlog;

exports.updateBlog = updateBlog;

exports.deleteBlog = deleteBlog;
