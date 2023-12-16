
const mongoose = require("mongoose");

const collection = mongoose.Schema({
   careGiverId: { type: String },
   patientId: { type: String },
 });

 const CareGiverDetails = mongoose.model("careGiverdetails", collection);
 
 module.exports = CareGiverDetails;