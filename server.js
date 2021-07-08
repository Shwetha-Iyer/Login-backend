const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const router = express.Router();
const mongoose = require("mongoose");
const cors = require("cors");


const {
    HOST,
    PORT,
    SESS_SECRET,
    NODE_ENV,
    IS_PROD,
    COOKIE_NAME
  } = require("./config/config");
const { MongoURI } = require("./config/database");
const MAX_AGE = 1000 * 60 * 60 * 3; // Three hours

var corsOptions = {
  credentials:true
}
app.use(cors(corsOptions));

// Connecting to Database
mongoose
  .connect(MongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// setting up connect-mongodb-session store
const mongoDBstore = new MongoDBStore({
  uri: MongoURI,
  collection: "mySessions"
});

// Express Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express-Session
app.use(
  session({
    name: COOKIE_NAME, //name to be put in "key" field in postman etc
    secret: SESS_SECRET,
    resave: true,
    saveUninitialized: false,
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE,
      sameSite: "none",
      secure: false
    }
  })
);

app.use("/api/users", require("./routes/users"));

app.listen(PORT, () => console.log(`Server started on http://${HOST}:${PORT}`));