require('dotenv');
const accountSid = process.env.ACCOUNT_SID; // replace with your Twilio account SID
const authToken = process.env.AUTH_TOKEN; // replace with your Twilio auth token
console.log(process.env.ACCOUNT_SID);
const twilioPhoneNumber = "+18625052427";
const client = require('twilio')(accountSid, authToken);
const moment = require('moment');

const medicineModel = require("../models/Medicine.js");
const careGiverModel = require("../models/PatientCaregiver.js");
// const reminderModel = require("../Models/reminderModel.js");
const userModel = require("../models/User.js");

const sendReminder = async () => {
    console.log("Hello send the reminder");
    // get current time and date
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    // find all medicine records with a time_to_take value that is 10 minutes from now
    const medicines = await medicineModel.find({
        start_date: { $lte: today },
        end_date: { $gte: today }
    });

    console.log("medicines",medicines);

    for (const medicine of medicines) {
        // Get the current time
        const currentTime = new Date();
        const time1 = currentTime.getHours() + ':' + currentTime.getMinutes();
        const time2 = medicine.time_to_take;

        let timeDifference = getTimeDifference(time1.toString(), time2.toString());

        console.log("timeDifference",timeDifference);

        if (timeDifference == 5) {
            console.log("sendMessage is called");
            sendMessage(medicine.userId, medicine.name, medicine.time_to_take);
        }
    }
};

const sendMessage = async (userId, medicineName, time_to_take) => {

    //Send a message to user
    const user = await userModel.findOne({
        userId: userId
    });

    const userMessage = ` Hello ${user.fname}, It's almost time for  ${medicineName} medication. Please  take it at ${time_to_take}.`;

    client.messages
        .create({
            body: userMessage,
            from: twilioPhoneNumber, // replace with your Twilio phone number
            to: user.phone // send reminder text message to user's phone number
        })
        .then(message => console.log(`User: Reminder text message sent for ${medicineName}: ${message.sid}`))
        .catch(error => console.log(`User: Error sending reminder text message for ${medicineName}: ${error}`));

    // Find documents for the specified patientId
    const documentsForPatientId = await careGiverModel.find({ patientId: userId });

    // Extract caregiverIds from the documents
    const caregiverIds = documentsForPatientId.map(doc => doc.careGiverId);

    // Find corresponding documents from UserModal based on caregiverIds
    const caregiverDocuments = await userModel.find({ userId: { $in: caregiverIds } });

    for (const caretaker of caregiverDocuments) {

        const message = `It's almost time for  ${medicineName} medication for your beloved one. Please tell them to take it at ${time_to_take}.`;
        let phone = caretaker.phone;
        // send reminder text message
        client.messages
            .create({
                body: message,
                from: twilioPhoneNumber, // replace with your Twilio phone number
                to: phone // send reminder text message to user's phone number
            })
            .then(message => console.log(`Reminder text message sent for ${medicineName}: ${message.sid}`))
            .catch(error => console.log(`Error sending reminder text message for ${medicineName}: ${error}`));
    }
};

function getTimeDifference(time1, time2) {

    // Convert times to minutes since midnight
    const [hours1, minutes1] = time1.split(':').map(Number);
    const minutesSinceMidnight1 = hours1 * 60 + minutes1;
    const [hours2, minutes2] = time2.split(':').map(Number);
    const minutesSinceMidnight2 = hours2 * 60 + minutes2;

    // Calculate the time difference in minutes
    let timeDifference = minutesSinceMidnight2 - minutesSinceMidnight1;
    if (timeDifference < 0) {
        timeDifference += 24 * 60; // Add 24 hours' worth of minutes
    }

    return timeDifference;
}

module.exports = {
    sendReminder
};
