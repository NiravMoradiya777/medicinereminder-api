const mongooes = require("mongoose");

const userDetailsSchema = new mongooes.Schema({
  userId: mongooes.Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: [true, "First Name is requierd"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is requierd"],
  },
  phone: {
    type: String,
    required: [true, "Phone Number is requierd"],
  },
  dob: {
    type: String,
    required: [true, "DOB is requierd"],
  },
});

module.exports = mongooes.model("userDetails", userDetailsSchema);
