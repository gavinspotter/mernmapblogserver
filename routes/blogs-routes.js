const express = require("express");

const { check } = require("express-validator");

const blogsControllers = require("../controllers/blogs-controllers");

const router = express.Router();

router.get("/user/:uid", blogsControllers.getBlogsByUserId);

router.post(
  "/",
  [check("blgentry").not().isEmpty()],
  blogsControllers.createBlog
);

router.patch(
  "/:bid",
  [check("blgentry").not().isEmpty()],
  blogsControllers.updateBlog
);

router.delete("/:bid", blogsControllers.deleteBlog);

module.exports = router;
