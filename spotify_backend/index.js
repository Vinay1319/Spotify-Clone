const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const playlistRoutes = require("./routes/playlist");
const songRoutes = require("./routes/song");
const authRoutes = require("./routes/auth");
const app = express();
require("dotenv").config();
const port = 8000;

app.use(express.json());

mongoose
  .connect(
    process.env.MONGO
  )
  .then(() => {
    console.log("Connected to Mongo");
  })
  .catch((err) => {
    console.log("Error", err);
  }); // 2 arguments (db url, connection options)

//passport jwt
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secretKey";
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false); // User not found
      }
    } catch (err) {
      return done(err, false); // Handle errors
    }
  })
);


app.get("/", (req, res) => {
  res.send("Hi");
});
app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

app.listen(port, () => {
  console.log("App is running on port " + port);
});
