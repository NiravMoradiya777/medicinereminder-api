
const express=require("express");

const CaregiverDashboardController=require("../../controller/Users/Caregiver/CaregiverDashboardController");

const careGiverRouter = express.Router();

careGiverRouter.get('/findCaregiverPatientDetails', CaregiverDashboardController.findCaregiverPatientDetails);

module.exports=careGiverRouter;