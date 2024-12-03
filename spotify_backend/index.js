// const express = require("express");
// const mongoose = require("mongoose");
// const JwtStrategy = require("passport-jwt").Strategy,
//   ExtractJwt = require("passport-jwt").ExtractJwt;
// const passport = require("passport");
// const User = require("./models/User");
// const playlistRoutes = require("./routes/playlist");
// const songRoutes = require("./routes/song");
// const authRoutes = require("./routes/auth");
// const app = express();
// require("dotenv").config();
// const cors = require("cors");
// const port = 8000;

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO)
//   .then(() => {
//     console.log("Connected to Mongo");
//   })
//   .catch((err) => {
//     console.log("Error", err);
//   }); // 2 arguments (db url, connection options)

// //passport jwt
// let opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = "secretKey";
// passport.use(
//   new JwtStrategy(opts, async function (jwt_payload, done) {
//     try {
//       const user = await User.findOne({ id: jwt_payload.sub });
//       if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false); // User not found
//       }
//     } catch (err) {
//       return done(err, false); // Handle errors
//     }
//   })
// );

// app.get("/", (req, res) => {
//   res.send("Hi");
// });
// app.use("/auth", authRoutes);
// app.use("/song", songRoutes);
// app.use("/playlist", playlistRoutes);

// app.listen(port, () => {
//   console.log("App is running on port " + port);
// });

// npm init : package.json -- This is a node project.
// npm i express : expressJs package install hogya. -- project came to know that we are using express
// We finally use express

// const express = require("express");
// const mongoose = require("mongoose");
// const JwtStrategy = require("passport-jwt").Strategy,
//   ExtractJwt = require("passport-jwt").ExtractJwt;
// const passport = require("passport");
// const User = require("./models/User");
// const authRoutes = require("./routes/auth");
// const songRoutes = require("./routes/song");
// const playlistRoutes = require("./routes/playlist");
// require("dotenv").config();
// const cors = require("cors");
// const app = express();
// const port = 8080;

// app.use(cors());
// app.use(express.json());

// // connect mongodb to our node app.
// // mongoose.connect() takes 2 arguments : 1. Which db to connect to (db url), 2. 2. Connection options
// mongoose
//   .connect(
//     "mongodb+srv://vinay:" +
//       process.env.MONGO_PASSWORD +
//       "@vinay.pw0hy.mongodb.net/?retryWrites=true&w=majority&appName=Vinay"
//   )
//   .then((x) => {
//     console.log("Connected to Mongo!");
//   })
//   .catch((err) => {
//     console.log("Error while connecting to Mongo");
//   });

// // setup passport-jwt
// let opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
// passport.use(
//   new JwtStrategy(opts, function (jwt_payload, done) {
//     User.findOne({ _id: jwt_payload.identifier }, function (err, user) {
//       // done(error, doesTheUserExist)
//       if (err) {
//         return done(err, false);
//       }
//       if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//         // or you could create a new account
//       }
//     });
//   })
// );

// // API : GET type : / : return text "Hello world"
// app.get("/", (req, res) => {
//   // req contains all data for the request
//   // res contains all data for the response
//   res.send("Hello World");
// });
// app.use("/auth", authRoutes);
// app.use("/song", songRoutes);
// app.use("/playlist", playlistRoutes);

// // Now we want to tell express that our server will run on localhost:8000
// app.listen(port, () => {
//   console.log("App is running on port " + port);
// });


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
const port = 8080;

app.use(cors());
app.use(express.json());

// Connect MongoDB to our Node app
mongoose
  .connect(
    "mongodb+srv://vinay:" +
      process.env.MONGO_PASSWORD +
      "@vinay.pw0hy.mongodb.net/?retryWrites=true&w=majority&appName=Vinay"
  )
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch((err) => {
    console.error("Error while connecting to Mongo:", err.message);
  });

// Setup passport-jwt
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload.identifier });
      if (user) {
        return done(null, user); // User found
      } else {
        return done(null, false); // User not found
      }
    } catch (err) {
      return done(err, false); // Error occurred
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
