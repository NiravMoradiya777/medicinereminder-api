const medicineModel = require("../../../models/Medicine");

const getMedicineByUserId = async (req, res) => {
    const userId = req.query.userId; // Assuming you pass the userId as a URL parameter
    if (!userId) {
        return res.status(400).json({ error: "Missing patientId in query", medicinesData: null, medicinesRetrieved:false });
    }
    try {
        const medications = await medicineModel.find({ userId: userId });

        res.status(200).json({
            medicinesData: medications,
            medicinesRetrieved:true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, medicinesData: null, medicinesRetrieved:false });
    }
};

const saveMedicine = async (req, res) => {
    const medicineDetails = req.body;

    //business logic comes here to register user
    let medicineId = Math.random().toString().substring(2, 8);
   
    try {
        const obj = {
            medicineId: medicineId,
            name: medicineDetails.name,
            dosage: medicineDetails.dosage,
            frequency: medicineDetails.frequency,
            start_date: medicineDetails.start_date,
            end_date: medicineDetails.end_date,
            time_to_take: medicineDetails.time_to_take,
            userId:medicineDetails.userId
        };

        await medicineModel.create(obj);
        
        res.status(200).json({
            medicineSaved: true,
            message: "Medicine details are saved"
        });
    } catch (err) {
        res.status(400).json({
            medicineSaved: false,
            message: "Error while saving medicine details"
        });
    }
};

const updateMedicineDetails = async (req, res) => {
    try {
        const medicineDetails = req.body;

        const medicine = await medicineModel.findOne({
            medicineId: medicineDetails.medicineId
        });

        const _id = { _id: medicine._id };

        const dataToBeUpdate = {
            medicineId: medicine.medicineId,
            name: medicineDetails.name,
            dosage: medicineDetails.dosage,
            frequency: medicineDetails.frequency,
            start_date: medicineDetails.start_date,
            end_date: medicineDetails.end_date,
            time_to_take: medicineDetails.time_to_take,
            userId: medicineDetails.userId
        };

        const updatedMedicineDetails = await medicineModel.findByIdAndUpdate(
            _id,
            { ...dataToBeUpdate },
            { new: true }
        );

        res.status(200).json({
            medicineUpdate: true,
            updatedMedicineData: updatedMedicineDetails
        });
    } catch (err) {
        res.status(400).json({
            medicineUpdate: false,
            updatedMedicineData: null
        });
    }
};

const deleteMeidineByMedicineId = async (req, res) => {
    try {
        const medicineId = req.query.medicineId;
        const query = { medicineId: medicineId };
        const medicine = await medicineModel.findOne(query);
        
        const _id = { _id: medicine._id };

        const deletMedicineDetails = await medicineModel.findByIdAndDelete(_id);

        res.status(200).json({
            medicineDeleted: true,
            deletMedicineDetails: deletMedicineDetails
        });    
    } catch (err) {
        res.status(400).json({
            medicineDeleted: false,
            deletMedicineDetails: null 
        }); 
    }
};

module.exports = {
    saveMedicine,
    getMedicineByUserId,
    updateMedicineDetails,
    deleteMeidineByMedicineId
};
