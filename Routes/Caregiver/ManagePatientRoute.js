
const express=require("express");

const ManagePatientController=require("../../controller/Users/Caregiver/ManagePatientController");

const managePatientRoute = express.Router();

managePatientRoute.get('/getPatientsByCaregiverId', ManagePatientController.getPatientsByCaregiverId);
managePatientRoute.delete('/deletePatientsByCaregiverId', ManagePatientController.deletePatientsByCaregiverId);

module.exports=managePatientRoute;