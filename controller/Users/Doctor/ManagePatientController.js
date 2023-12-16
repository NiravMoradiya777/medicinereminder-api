const doctorPatientModel = require("../../../models/DoctorPatient");
const user = require("../../../models/User");

const getPatientList = async (req, res) => {
    try {
        const userId = req.query.userId;
        const collectionADocs = await user.find({ userType: "Patient" });
        const collectionBPatientIds = await doctorPatientModel.find({ doctorId: userId }).distinct('patientId');
        const documentsNotInB = collectionADocs.filter(doc => !collectionBPatientIds.includes(doc.userId));
        res.status(200).json(documentsNotInB);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPatientByUserId = async (req, res) => {
    try {
        const userId = req.query.userId;
        // console.log(userId);

        // Find documents for the specified DoctorId
        const documentsForPatientId = await doctorPatientModel.find({ doctorId: userId });

        // Extract patientIds from the documents
        const patientIds = documentsForPatientId.map(doc => doc.patientId);

        // Find corresponding documents from UserModal based on patientIds
        const patientDocuments = await user.find({ userId: { $in: patientIds } });

        res.status(200).json({
            patientData: patientDocuments,
            dataRetrieved: true
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            patientData: null,
            dataRetrieved: false
        });
    }
};

const registerPatient = async (req, res) => {
    const patientDetails = req.body;

    try {
        const ifRelationExists = await doctorPatientModel.findOne({
            patientId: patientDetails.patientId,
            doctorId: patientDetails.doctorId
        });

        if (ifRelationExists) {
            res.status(200).json({
                patientRegister: false,
                message: "Patient is already registered with the Doctor"
            });
        } else {
            await doctorPatientModel.create({
                doctorId: patientDetails.doctorId,
                patientId: patientDetails.patientId
            });

            res.status(200).json({
                patientRegister: true,
                message: "Patient is registered"
            });
        }
    } catch (err) {
        res.status(400).json({
            patientRegister: false,
            message: err.message
        });
    }
};

const deletePatientByUserId = async (req, res) => {
    try {
      const patientId = req.query.patientId;
      const doctorId = req.query.doctorId;
    //   console.log(req.query);
  
      const ifRelationExists = await doctorPatientModel.findOne({
        patientId: patientId,
        doctorId: doctorId
      });
    
      // Delete all entries with the specified doctorId and patientId
      const deletedPatientDetails = await doctorPatientModel.findByIdAndDelete(ifRelationExists._id);
  
      res.status(200).json({
        patientDeleted: true,
        deletedPatientDetails: deletedPatientDetails
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        patientDeleted: false,
        deletedPatientDetails: null
      });
    }
  };

module.exports = {
    registerPatient,
    getPatientList,
    getPatientByUserId,
    deletePatientByUserId
};
