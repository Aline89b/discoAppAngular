const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signUpSchema = require("../middlewares/validators");
const User = require("../models/users.model");
const transport = require('../middlewares/sendMail')

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addUser = async (req, res) => {
 
  const { role, mail, pw } = req.body;

    try {
    const { error, value } = signUpSchema.validate({ role, mail, pw });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const ExistingUser = await User.findOne({ mail });
    if (ExistingUser) {
      
      return res
        .status(401)
        .json({ success: false, message: "user already exists" });
    }
      
    const hashedPassword = await bcrypt.hash(pw, 10);
    const user = await User.create({ role, mail, pw: hashedPassword });
    console.log(user);
    const token = jwt.sign(
      { userId: user._id, mail: user.mail, verified: user.verified },
      process.env.JWT_SECRET
    );
     const verificationLink =`http://localhostost:3000/verify?token=${token}`
     await transport.sendMail({
      from: process.env.NODE_MAILER_ADDRESS,
      to: mail,
      subject:"verify your email",
      html:`<p>Please click the link below to verify your email:</p>
     <a href="${verificationLink}">Verify Email</a>`
  })
  res.status(200).json({message:'Verification email sent successfully',role: user.role,
    mail: user.mail,});
          
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
};

const logIn = async (req, res) => {
    
    const { mail, pw } = req.body
  try {
    const user = User.findOne({ mail });
    
    const token = jwt.sign(
        { userId: user._id, mail: user.mail, verified: user.verified },
        process.env.JWT_SECRET
      );
   
    if (user) {
        bcrypt.compare(pw, user.pw, function(err, result) {
            res.cookie("Authorization", "Bearer" + token, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: (process.env.NODE_ENV = "production"),
                secure: (process.env.NODE_ENV = "production"),
              }).json({
                success: true,
                token,
                message:'logged in successfully'
              });
         
            } )
           
     
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logOut = async (req, res)=> {
    res.clearCookie('Authorizazion').status(200).json({success: true, message:"logged out successfully"})
}

const verifyUser = async(req,res)=>{
    const { mail, token } = req.body
   const user = await User.findOne({ mail });
   
    try {
     
        if (user.token === token) {
          user.verified = true;
          return res
            .status(404)
            .json({ success: true, message: "user email is verified" });
        }
           
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}
   

const updatedUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPW = async (req, res) => {
  try {
    const { id, pw } = req.body;
    const user = await User.findByIdAndUpdate(id, pw);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json({updatedUser, message: "password updated successfully"});
    await transport.sendMail({
      from: process.env.NODE_MAILER_ADDRESS,
      to: mail,
      subject:"password changed",
      html: '<p>Your password has been changed. If it is not you contact our assistance center as soon as possible.</p>'
   })  

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id, req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUsers = await User.find({});
    res.status(200).json(updatedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, addUser, updatedUser, deleteUser, logIn, logOut, verifyUser,resetPW };
