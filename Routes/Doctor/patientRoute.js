const express=require("express");

const patientController=require("../../controller/Users/Doctor/ManagePatientController");
const managePatientMedicineController = require("../../controller/Users/Doctor/ManagePatientMedicineController");
const patientRouter = express.Router();

//HTTP post request to register user map to registerUser function.
patientRouter.post('/registerPatient', patientController.registerPatient);
patientRouter.get('/getPatientList', patientController.getPatientList);
patientRouter.get('/getPatientByUserId', patientController.getPatientByUserId);
patientRouter.delete('/deletePatientByUserId', patientController.deletePatientByUserId);

patientRouter.post('/addMedicine', managePatientMedicineController.saveMedicine);
patientRouter.get('/getMedicinesByUserId', managePatientMedicineController.getMedicineByUserId);
patientRouter.put('/updateMedicine', managePatientMedicineController.updateMedicineDetails);
patientRouter.delete('/deleteMedicine', managePatientMedicineController.deleteMeidineByMedicineId);

module.exports=patientRouter;