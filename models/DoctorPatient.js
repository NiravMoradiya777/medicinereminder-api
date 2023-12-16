
const mongoose = require("mongoose");

const collection = mongoose.Schema({
   doctorId: { type: String },
   patientId: { type: String },
 });

 const DoctorPatientDetails = mongoose.model("DoctorPatientDetails", collection);
 
 module.exports = DoctorPatientDetails;