const careGiverModel = require("../../../models/PatientCaregiver");
const user = require("../../../models/User");

const getCaregiverList = async (req, res) => {
  try {
    const userId = req.query.userId;
    const collectionADocs = await user.find({userType: "Caregiver"});
    const collectionBCaregiverIds = await careGiverModel.find({ patientId: userId }).distinct('careGiverId');
    const documentsNotInB = collectionADocs.filter(doc => !collectionBCaregiverIds.includes(doc.userId));
    res.status(200).json(documentsNotInB);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCareGiverByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;

    // console.log(userId);

    // const query = { userId: userId };
    // const careGivers = await careGiverModel.find(query);

    // Find documents for the specified patientId
    const documentsForPatientId = await careGiverModel.find({ patientId: userId });

    // Extract caregiverIds from the documents
    const caregiverIds = documentsForPatientId.map(doc => doc.careGiverId);

    // Find corresponding documents from UserModal based on caregiverIds
    const caregiverDocuments = await user.find({ userId: { $in: caregiverIds } });

    res.status(200).json({
      careGiverData: caregiverDocuments,
      dataRetrieved: true
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      careGiverData: null,
      dataRetrieved: false
    });
  }
};

const registerCareGiver = async (req, res) => {
  const careGiverDetails = req.body;

  try {
    const ifRelationExists = await careGiverModel.findOne({
      patientId: careGiverDetails.patientId,
      careGiverId: careGiverDetails.careGiverId
    });

    if (ifRelationExists) {
      res.status(200).json({
        careGiverRegister: false,
        message: "User is already registered with the given careGiver"
      });
    } else {
      await careGiverModel.create({
        careGiverId: careGiverDetails.careGiverId,
        patientId: careGiverDetails.patientId
      });

      res.status(200).json({
        careGiverRegister: true,
        message: "CareGiver is registered"
      });
    }
  } catch (err) {
    res.status(400).json({
      careGiverRegister: false,
      message: err.message
    });
  }
};

const deleteCaregiverByUserId = async (req, res) => {
  try {
    // const {careTakerId, patientId} = req.body;
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
    console.log(err);
    res.status(400).json({
      careGiverDeleted: false,
      deletedCareGiverDetails: null
    });
  }
};

// const deleteCareGiverById = async (req, res) => {
//   try {
//     const _id = req.query.id;
//     const deletedCareGiverDetails = await careGiverModel.findByIdAndDelete(_id);

//     res.status(200).json({
//       careGiverDeleted: true,
//       deletedCareGiverDetails: deletedCareGiverDetails
//     });
//   } catch (err) {
//     res.status(400).json({
//       careGiverDeleted: false,
//       deletedCareGiverDetails: null
//     });
//   }
// };


module.exports = {
  getCaregiverList,
  registerCareGiver,
  getCareGiverByUserId,
  deleteCaregiverByUserId
};
