const mongoose = require("mongoose");

const collection = mongoose.Schema({
   medicineId: { type: String },
   name: { type: String },
   dosage: { type: String},
   frequency: { type: String },
   start_date: { type: String },
   end_date: { type: String,  },
   time_to_take: { type: String },
   userId: { type: String },
   doctorId: { type: String },
 });

 const MedicineDetails = mongoose.model("medicinedetails", collection);
 
 module.exports = MedicineDetails;