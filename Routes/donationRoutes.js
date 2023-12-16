const express=require("express");

const DonationController=require("../controller/DonationController.js");

const donationRouter = express.Router();

donationRouter.post('/create-checkout-session', DonationController.checkoutSession);

module.exports=donationRouter;