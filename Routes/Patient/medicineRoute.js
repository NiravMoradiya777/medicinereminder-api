
const express=require("express");

const medicineController=require("../../controller/Users/Patient/ManageMedicineController");

const medicineRouter = express.Router();

//HTTP post request to register user map to registerUser function.
medicineRouter.post('/addMedicine', medicineController.saveMedicine);
medicineRouter.get('/getMedicinesByUserId', medicineController.getMedicineByUserId);
medicineRouter.put('/updateMedicine', medicineController.updateMedicineDetails);
medicineRouter.delete('/deleteMedicine', medicineController.deleteMeidineByMedicineId);



module.exports=medicineRouter;