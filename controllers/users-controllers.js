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

const signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("invalid inputs passed", 422);
  }

  const { name, email, password } = req.body;

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  const hasUser = DUMMY_USER.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("could not create user email exists");
  }

  DUMMY_USER.push(createdUser);

  res.status(201).json({ user: createdUser });
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
