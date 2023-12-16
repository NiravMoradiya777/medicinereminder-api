const express = require("express");
require("./db/config");
const cron = require('node-cron');

const User = require("./models/User");
require('dotenv').config();

//Common Controller
const userRouter = require("./Routes/userRoutes");
const donationRouter = require("./Routes/donationRoutes");

//Patient Controller
const medicineRouter = require("./Routes/Patient/medicineRoute.js");
const careTakerRouter = require("./Routes/Patient/careTakerRoute.js");
const dashboardRouter = require("./Routes/Patient/dashboardRoute");

//Caregiver Controller
const caregiverDashboardRoute = require("./Routes/Caregiver/CaregiverDashboardRoute");
const managePatientRoute = require("./Routes/Caregiver/ManagePatientRoute");

//Doctor Controller
const managePatientDoctorRoute = require("./Routes/Doctor/patientRoute.js")

//Reminder
const reminder = require("./Reminder/reminder.js");

const PORT = process.env.PORT || 4000;

var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()) // Use this after the variable declaration
const appParent = "/medicinereminder/";

var module ="patient/"

app.use(appParent, donationRouter)
app.use(appParent + "userdetails", userRouter);
app.use(appParent + module + "medicines", medicineRouter);
app.use(appParent + module + "caretaker", careTakerRouter);
app.use(appParent + module + "dashboard", dashboardRouter);

module = "caregiver/"
app.use(appParent + module + "dashboard", caregiverDashboardRoute)
app.use(appParent + module + "managepatient", managePatientRoute)

module = "doctor/"
app.use(appParent + module + "managepatient", managePatientDoctorRoute);

app.get("/", (req, resp) => {
  resp.send("App is working");
});

//sheduler that executes every minutes 
cron.schedule('* * * * *', async () => {
  console.log("scheduler executes");
  reminder.sendReminder();
});

app.listen(PORT, () => {
  console.log("API running on port " + PORT);
  
});