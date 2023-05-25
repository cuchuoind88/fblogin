const mongoose = require("mongoose");
const testSchema = mongoose.Schema({
  name: {
    type: String,
  },
});
const testModel = mongoose.model("testModel", testSchema);
module.exports = testModel;
