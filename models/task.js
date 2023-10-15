const { Schema, default: mongoose } = require("mongoose");
const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  assignedTo: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

const TASK = mongoose.model("Task", taskSchema);

module.exports = TASK;
