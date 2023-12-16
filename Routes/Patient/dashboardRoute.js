const express=require("express");

const dashboardController=require("../../controller/Users/Patient/PatientDashboardController");

const dashboardRouter = express.Router();

dashboardRouter.get('/getDoctors', dashboardController.findDoctorsForPatient)
dashboardRouter.get('/getUpcomingMedication', dashboardController.findNextUpcomingReminder)

module.exports=dashboardRouter;