const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Employee Schema
const EmployeeSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
  },
  department: {
    type: String,
  },
  position: {
    type: String,
  },
  salary: {
    type: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;