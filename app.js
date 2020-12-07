const fs = require("fs")

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const blogsRoutes = require("./routes/blogs-routes");
const usersRoutes = require("./routes/users-routes");
const journalsRoutes = require("./routes/journals-routes");
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/blog", blogsRoutes);

app.use("/api/journal", journalsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(req.file) {
    fs.unlink(req.file.path, (err)=>{
      console.log(err)
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://gavin:Password123@cluster0.d3tnt.mongodb.net/project3?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
