const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USER = [
  {
    id: "u1",
    name: "gavin potter",
    email: "gavin@gmail.com",
    password: "testpassword",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USER });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs passed", 422);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "signing up failed please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "user exists already, please login instead",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Ra_Barque.jpg",
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("signing up failed please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USER.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("could not identified user", 401);
  }

  res.json({ message: "logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
