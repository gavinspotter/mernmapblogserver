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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("could not find a place for the provided id.", 404);
  }

  res.json({ place: place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError("could not find a place for the provided id.", 404)
    );
  }

  res.json({ place });
};
