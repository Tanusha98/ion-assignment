// importing modules
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");

var app = express();

const route = require("./routes/route");
const upload = require("./routes/upload")

// connecting to mongodb
mongoose.connect("mongodb://localhost:27017/thermoData",function(){
  // to refresh db
  mongoose.connection.db.dropDatabase((err,res)=>{
    console.log('dropped db')
  });
});

// on connection established
mongoose.connection.on("connected", () => {
  console.log("Connected to mongodb");
});

// on connection error
mongoose.connection.on("error", err => {
  console.log("Error in database connection: ", err);
});


const port = 3000;

// adding middleware - cors
app.use(cors());

// adding body-parser
app.use(bodyParser.json());

// static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", route);

app.get("/", (req, res) => {
  res.send("foobar");
});

app.post("/upload", upload);

app.listen(port, () => {
  console.log("Server started at port:", port);
});


