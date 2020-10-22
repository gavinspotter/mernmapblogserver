const express = require("express");

const placesControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/");

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post("/", placesControllers.createPlace);

router.patch("/:pid", placesControllers.updatePlace);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
