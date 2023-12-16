const MedicineDetails = require("../../../models/Medicine");

const findDoctorsForPatient = async (req, res) => {
  const patientId = req.params.patientId;

  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId in params", doctorsDetail: null });
  }

  try {
    // Find medications for the patient
    const medications = await MedicineDetails.find({ userId: patientId });

    // if (medications.length === 0) {
    //   return res.status(404).json({ error: "No medications found for the given patient", doctorsDetail: null });
    // }

    // Extract unique doctor IDs from the medications
    const doctorIds = [...new Set(medications.map((medication) => medication.doctor_id))];

    // Find doctors using the unique doctor IDs
    const doctors = await User.find({ _id: { $in: doctorIds } }); // Assuming you have a Doctor model

    // if (doctors.length === 0) {
    //   return res.status(404).json({ error: "No doctors found for the given patient's medications", doctorsDetail: null });
    // }

    res.status(200).json({
      doctorsDetail: doctors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, doctorsDetail: null });
  }
};

//TO-DO Make this API proper
const findNextUpcomingReminder = async (req, res) => {
  const patientId = req.query.patientId;

  if (!patientId) {
    return res.status(400).json({ error: "Missing patientId in params", upcomingMedications: null });
  }

  const currentDate = new Date(); // Get the current date and time
  try {
    // Find medications for the patient with a start_date greater than or equal to the current date
    const upcomingMedications = await MedicineDetails.find({
      userId: patientId
    }).sort({ time_to_take: 1, frequency: 1 }); // Sort by time_to_take and frequency

    if (upcomingMedications.length === 0) {
      return res.status(404).json({ error: "No upcoming reminders found", upcomingMedications: null });
    }

    res.status(200).json({upcomingMedications: upcomingMedications[0]});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  findDoctorsForPatient,
  findNextUpcomingReminder,
};
