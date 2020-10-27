const express = require("express");

const blogsControllers = require("../controllers/blogs-controllers");

const router = express.Router();

router.get("/user/:uid", blogsControllers.getBlogsByUserId);

router.post("/", blogsControllers.createBlog);

router.patch("/:bid", blogsControllers.updateBlog);

router.delete("/:bid");

module.exports = router;
