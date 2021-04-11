const express = require("express");
const Joi = require("joi");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const authentication = require("./authentication/authentication.js");

const trefleroutes = require("./trefle_routes/trefleRoutes");
const studentroutes = require("./hostelapp/routes/student.js");
const categoryroutes = require("./hostelapp/routes/roomcategory.js");
const roomsroutes = require("./hostelapp/routes/rooms.js");
const adminroutes = require("./hostelapp/routes/HostelAdmin.js");
const reportroutes = require("./hostelapp/routes/report.js");
const hostelauthroutes = require("./hostelapp/routes/auth.js");
const departmentroutes = require("./hostelapp/routes/department.js");

mongoose.connect(
  "mongodb://localhost/members",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("connected");
  }
);

const hostel = ["kt hall", "hilda", "milda", "novotel", "dubai"];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/authentication", authentication);

app.use("/hostel/api/v1", studentroutes);
app.use("/hostel/api/v1", categoryroutes);
app.use("/hostel/api/v1", roomsroutes);
app.use("/hostel/api/v1", adminroutes);
app.use("/hostel/api/v1", reportroutes);
app.use("/hostel/api/v1", hostelauthroutes);
app.use("/hostel/api/v1", departmentroutes);

app.use("/api/v1", trefleroutes);

if (app.get("env") === "development") {
  app.use(morgan("dev"));
  console.log("Morgan enabled");
}

app.get("/", (req, res) => {
  res.send("API for managing Hostels");
});

app.get("/hostels", (req, res) => {
  res.send(hostel);
});

app.post("/hostel", (req, res) => {
  const { error, value } = validateHostelItem(req.body);

  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }

  let newHostel = [value.item, ...hostel];
  res.status(200).send(newHostel);
});

app.put("/hostel/:name", (req, res) => {
  const { error } = validateHostelItem(req.body);
  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }
  let name = hostel.find((name) => name === req.params.name);
  let nameIndex = hostel.indexOf(name);
  hostel[nameIndex] = req.body.item;

  res.status(200).send(hostel);
});

app.delete("/hostel/:name", (req, res) => {
  const { error } = validateHostelItem(req.body);
  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }

  let updatedHostel = hostel.filter((hostel) => hostel !== req.params.name);
  res.status(200).send(updatedHostel);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}... `);
});

const validateHostelItem = (data) => {
  const schema = Joi.object({
    item: Joi.string().min(3).max(20).required().label("Hostel Item"),
  });

  return schema.validate(data);
};
