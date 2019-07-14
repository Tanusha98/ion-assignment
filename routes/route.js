const express = require("express");
const router = express.Router();

const ThermoData = require("../models/thermo-data");

router.get("/thermoData/:from/:to", (req, res, next) => {
  ThermoData.find({ts: {$lte:req.params.to, $gte:req.params.from}},function(err, thermoData) {
    res.json(thermoData);
  });
});

router.post("/thermoData", (req, res, next) => {
  console.log(req);
  let thermoData = new ThermoData({
    ts: req.body.ts,
    value: req.body.value
  });
  thermoData.save((err, thermoData) => {
    if (err) {
      res.json({ msg: "failed to store thermometer data"+err });
    } else {
      res.json({ msg: "Data stored succesfully" });
    }
  });
});

module.exports = router;
