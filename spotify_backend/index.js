const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

// Connect MongoDB to our Node app
mongoose
  .connect(
    "mongodb+srv://vinay:" +
      process.env.MONGO_PASSWORD +
      "@vinay.pw0hy.mongodb.net/?retryWrites=true&w=majority&appName=Vinay",
  )
  .then((x) => {
    console.log("Connected to Mongo!");
  })
  .catch((err) => {
    console.error("Error while connecting to Mongo:", err.message);
  });

// Setup passport-jwt

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // How JWT is extracted from the request
  secretOrKey: 'thisKeyIsSupposedToBeSecret'  // Replace with your secret key
};

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
          if (!jwt_payload.identifier) {
              return done(new Error("Invalid JWT payload: missing identifier"), false);
          }

          // Use async/await for handling the database query
          const user = await User.findOne({_id: jwt_payload.identifier});
          
          if (user) {
              console.log("User found:", user);
              return done(null, user);
          } else {
              console.log("User not found");
              return done(null, false);
              // Alternatively, you can create a new account or return a specific error
          }
      } catch (err) {
          console.error("Error finding user:", err);
          return done(err, false);
      }
  })
);

// API : GET type : / : return text "Hello World"
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

// Start the server
app.listen(port, () => {
  console.log("App is running on port " + port);
});
