const { v4: uuidv4 } = require("uuid");

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
  const { name, email, password } = req.body;

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USER.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
