const mongooes = require("mongoose");
const bcrypt = require("bcrypt");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongooes.Schema({
  userId: { type: String },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Email address is required"],
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is requierd"],
  },
  userType: {
    type: String,
    required: [true, "User Type is requierd"],
    enum: ["Patient", "Doctor", "Caregiver"],
  }, //Here allowed values will be only (Patients, Doctor, CareGiver)
  fname: {
    type: String,
    required: [true, "First Name is requierd"],
  },
  lname: {
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

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash;
    next();
  });
});

userSchema.pre("update", function (next) {
  const user = this;
  bcrypt.hash(user.licenceNo, 10, (error, hash) => {
    user.licenceNo = hash;
    next();
  });
});

module.exports = mongooes.model("users", userSchema);
