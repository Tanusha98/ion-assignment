const mongoose = require("mongoose");

const ThermoDataSchema = mongoose.Schema({
  ts: {
    type: Number,
    required: true
  },
  val: {
    type: Number,
    required: true
  }
});

const ThermoData = (module.exports = mongoose.model(
  "ThermoData",
  ThermoDataSchema
));
