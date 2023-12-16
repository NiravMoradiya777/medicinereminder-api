const User = require("../models/User");
const bcrypt = require("bcrypt");

const authenticateUser = async (req, res) => {
  const credentials = req.body;

    // Validate if email and password are present and not empty
    if (!credentials.email || !credentials.password) {
      return res.status(400).json({
          userLogin: false,
          message: "Email and password are required fields."
      });
    }

    const isUserExist = await User.findOne({
        email: credentials.email
    });

    if (isUserExist) {

      const user = await bcrypt.compare(credentials.password, isUserExist.password);
        if(user){
                  const user = await User.findOne({
            email: credentials.email,
        });
    
            const dataToBeSend={
                userId: user.userId,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                password: user.password,
                phone: user.phone,
                dob: user.dob,
                userType: user.userType
        }
    
        res.status(200).json({
            userLogin: true,
            userData: dataToBeSend
        });

        }else{
            res.status(401).json({
                userLogin: false,
                message: "Incorrect credentials"
            });
        }        
    } else {
        res.status(404).json({
            userLogin: false,
            message: "User is not registered with given email address"
        });
    }
};

const saveLoginDetails = async (req, res) => {
  const userDetails = req.body;

  // Validate if required fields are present and not empty
  if (
    !userDetails.fname ||
    !userDetails.lname ||
    !userDetails.email ||
    !userDetails.userType ||
    !userDetails.password ||
    !userDetails.phone ||
    !userDetails.dob
  ) {
    return res.status(400).json({
      error: "All fields are required. Please fill in all the details.",
    });
  }

  try {
    const existingUser = await User.findOne({ email: userDetails.email });

    //business logic comes here to register user
    let userId = Math.random().toString().substring(2, 8);

    if (!existingUser) {
      await User.create({
        userId: userId,
        fname: userDetails.fname,
        lname: userDetails.lname,
        email: userDetails.email,
        userType: userDetails.userType,
        password: userDetails.password,
        phone: userDetails.phone,
        dob: userDetails.dob
      });
      res.status(200).json({ message: "User created successfully", userRegister: true });
      
    } else {
      res
        .status(400)
        .json({ error: "User already registered with the same User Name" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserDetails = async (req, res) => {
  try{
      const userDetails = req.body;
      const user=await User.findOne({
          email: userDetails.email
      });
      console.log(user);
      const _id = { _id: user._id };
      
      const dataToBeUpdate={
          userId: userDetails.userId,
          fname: userDetails.fname,
          lname: userDetails.lname,
          email: userDetails.email,
          password: userDetails.password,
          phone: userDetails.phone,
          dob: userDetails.dob
      }
      const updatedUserDetails = await User.findByIdAndUpdate(
          _id,
          { ...dataToBeUpdate },
          { new: true }
      );
      res.status(200).json({
          userUpdate: true,
          updatedUserData: updatedUserDetails
      });
  }catch(err){
      console.log(err);
      res.status(400).json({
          userUpdate: false,
          updatedUserData: null
      });
  }
}

const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({ error: "Logout failed" });
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
};

module.exports = { saveLoginDetails, authenticateUser, logout, updateUserDetails };
