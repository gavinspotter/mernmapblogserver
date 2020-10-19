const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "realm of the dead",
    description: "where osiris chills",
    location: {
      lat: 42.9463593,
      lng: -70.795102,
    },
    address: "163 northshore road hampton NH",
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new Error("could not find a place for the provided id.");
  }

  res.json({ place: place });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return res
      .status(404)
      .json({ message: "could not find a place for the provided user id" });
  }

  res.json({ place });
});

module.exports = router;
