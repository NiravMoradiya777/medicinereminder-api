const careGiverModel = require("../../../models/PatientCaregiver");
const user = require("../../../models/User");

const getPatientsByCaregiverId = async (req, res) => {
  try {
    const caregiverId = req.query.careGiverId;

    // Find documents for the specified caregiverId
    const documentsForCaregiverId = await careGiverModel.find({ careGiverId: caregiverId });

    // Extract patientIds from the documents
    const patientIds = documentsForCaregiverId.map(doc => doc.patientId);

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

const deletePatientsByCaregiverId = async (req, res) => {
  try {
    // const {careGiverId, patientId} = req.body;
    // // Delete all entries with the specified caregiverId and patientId
    // const deletedPatientDetails = await careGiverModel.deleteMany({ careGiverId: careGiverId, patientId: patientId });

    // res.status(200).json({
    //   patientsDeleted: true,
    //   deletedPatientDetails: deletedPatientDetails
    // });
    const patientId = req.query.patientId;
    const careTakerId = req.query.careGiverId;
    console.log(req.query);

    const ifRelationExists = await careGiverModel.findOne({
      patientId: patientId,
      careGiverId: careTakerId
    });
    console.log(ifRelationExists);
    // Delete all entries with the specified caregiverId and patientId
    const deletedCareGiverDetails = await careGiverModel.findByIdAndDelete(ifRelationExists._id);

    res.status(200).json({
      careGiverDeleted: true,
      deletedCareGiverDetails: deletedCareGiverDetails
    });
  } catch (err) {
    res.status(400).json({
      patientsDeleted: false,
      deletedPatientDetails: null
    });
  }
};

module.exports = {
  getPatientsByCaregiverId,
  deletePatientsByCaregiverId
};
