const express = require("express");

const { check } = require("express-validator");

const blogsControllers = require("../controllers/blogs-controllers");

const checkAuth = require("../middleware/check-auth")

const router = express.Router();

router.get("/user/:uid", blogsControllers.getBlogsByUserId);

router.get("/:bid", blogsControllers.getBlogById)

router.use(checkAuth)

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
