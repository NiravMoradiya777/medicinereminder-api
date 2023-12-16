
const express=require("express");

const careGiverController=require("../../controller/Users/Patient/ManageCaregiverController");

const careGiverRouter = express.Router();

//HTTP post request to register user map to registerUser function.
careGiverRouter.post('/registerCareGiver', careGiverController.registerCareGiver);
careGiverRouter.get('/getCareGiverList', careGiverController.getCaregiverList);
careGiverRouter.get('/getCareGiverData', careGiverController.getCareGiverByUserId);
careGiverRouter.delete('/deleteCareGiver', careGiverController.deleteCaregiverByUserId);

module.exports=careGiverRouter;