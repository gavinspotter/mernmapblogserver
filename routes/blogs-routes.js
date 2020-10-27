const express = require("express");

const blogsControllers = require("../controllers/blogs-controllers");

const router = express.Router();

router.get("/user/:uid", blogsControllers.getBlogsByUserId);

router.post("/", blogsControllers.createBlog);

router.patch("/:jid");

router.delete("/:jid");

module.exports = router;
