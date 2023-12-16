const express=require("express");

const LoginController=require("../controller/LoginController.js");

const userRouter = express.Router();

//HTTP post request to register user map to registerUser function.
userRouter.post('/registerUser', LoginController.saveLoginDetails);
userRouter.post('/signin', LoginController.authenticateUser);
userRouter.post('/updateUser', LoginController.updateUserDetails);

module.exports=userRouter;