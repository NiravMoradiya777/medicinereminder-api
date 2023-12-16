const MedicineDetails = require('../../../models/Medicine');
const PatientCaregiver = require('../../../models/PatientCaregiver');
const User = require('../../../models/User');

const findCaregiverPatientDetails = async (req, res) => {
  const careGiverId = req.query.careGiverId;
  
  if (!careGiverId) {
    return res.status(400).json({ error: "Missing careGiverId in params", caregiverDashboard: null });
  }

  try {
    // Find patients associated with the caregiver
    const patients = await PatientCaregiver.find({ careGiverId: careGiverId });

    // if (patients.length === 0) {
    //   return res.status(404).json({ error: "No patients found for the given caregiver", caregiverDashboard: null });
    // }

    // Extract patient IDs
    const patientIds = patients.map(patient => patient.patientId);

    // Find user details for the associated patients
    const patientDetails = await User.find({ userId: { $in: patientIds } });
    
    // Find upcoming medications for the associated patients
    const upcomingMedications = await MedicineDetails.find({
      userId: { $in: patientIds }
    }).sort({ time_to_take: 1, frequency: 1 }); // Sort by time_to_take and frequency

    // if (upcomingMedications.length === 0) {
    //   return res.status(404).json({ error: "No upcoming reminders found for the patients", caregiverDashboard: null });
    // }

    // Prepare the response
    const caregiverDashboard = {
      patients: patientDetails.map(patient => ({
        patientId: patient._id,
        name: `${patient.fname} ${patient.lname}`,
        email: patient.email,
        phone: patient.phone,
        dob: patient.dob,
        upcomingMedications: upcomingMedications.filter(medication => medication.userId === patient.userId).map(medication => ({
          medicineId: medication.medicineId,
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          start_date: medication.start_date,
          end_date: medication.end_date,
          time_to_take: medication.time_to_take,
        })),
      })),
    };

    res.status(200).json({ caregiverDashboard });
  } catch (error) {
    res.status(500).json({ error: error.message, caregiverDashboard: null });
  }
}

module.exports = {
  findCaregiverPatientDetails
  };