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

const signup = (req, res, next) => {};

const login = (req, res, next) => {};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
