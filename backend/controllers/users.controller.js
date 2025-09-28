const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {signUpSchema} = require("../middlewares/validators");
const User = require("../models/users.model");
const Token = require("../models/token");
const transport = require("../middlewares/sendMail");
const crypto = require("crypto");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  const { role, email, password } = req.body;
  console.log('🚀 INIZIO registrazione:', role, email);

  try {
    const { error, value } = signUpSchema.validate({ role, email, password });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message || 'Invalid input' });
    }

    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) {
      return res
        .status(401)
        .json({ success: false, message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ role, email, password: hashedPassword });
    const token = jwt.sign(
      { userId: user._id, email: user.email, verified: user.verified },
      process.env.JWT_SECRET
    );

    const userId = user._id;
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: { token: token },
      }
    );

    console.log('👤 Utente creato:', user.email);

    // ✅ RISPONDE SUBITO AL FRONTEND - Non aspetta l'email
    res.status(200).json({
      message: "Verification email sent successfully, check your email please",
      role: user.role,
      email: user.email,
      token,
    });
    
    console.log('✅ Risposta inviata al frontend');

    // 📧 INVIO EMAIL IN BACKGROUND - Non blocca la risposta
    console.log('📧 Invio email di verifica in background...');
    
    const verificationLink = `https://discoappangular-1.onrender.com/api/users/verify/${userId}/${token}`;
    
    transport.sendMail({
      from: process.env.NODE_MAILER_ADDRESS,
      to: email,
      subject: "verify your email",
      html: `<p>Please click the link below to verify your email:</p>
       <a href="${verificationLink}">Verify Email</a>`,
    })
    .then((info) => {
      console.log('✅ Email di verifica inviata con successo:', info.messageId);
      console.log('📧 Destinatario:', email);
    })
    .catch((error) => {
      console.error('❌ Errore invio email di verifica:', error.message);
      console.error('📧 Email fallita per:', email);
    });

  } catch (error) {
    console.error('❌ Errore durante registrazione:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const inviteUser = async (req, res) => {
  const { name, role, email, password } = req.body;
  console.log('🚀 INIZIO invito utente:', email);

  try {
    const { error, value } = signUpSchema.validate({
      name,
      role,
      email,
      password,
    });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const userID = decoded.userId;
    const userManager = await User.findById(userID);
    
    if (!userManager) {
      return res.status(404).json({ error: 'User not found' });
    }

    const companyId = userManager.companyId; 
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) {
      return res
        .status(401)
        .json({ success: false, message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      role,
      email,
      password: hashedPassword,
      companyId
    });

    const userId = user._id;
    const linkResetPW = `disco-app-angular.vercel.app/resetPW/${userId}`;
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    console.log('👤 Utente invitato creato:', user.email);

    // ✅ RISPONDE SUBITO AL FRONTEND
    res.status(200).json({ 
      success: true, 
      message: `invite has been sent to ${email}` 
    });

    console.log('✅ Risposta invite inviata al frontend');

    // 📧 INVIO EMAIL INVITE IN BACKGROUND
    console.log('📧 Invio email di invito in background...');
    
    transport.sendMail({
      from: process.env.NODE_MAILER_ADDRESS,
      to: email,
      subject: "invite to registration on DiscoApp",
      html: `<p>copy the code below and paste it in verification code input to reset your password:</p>
       <a href="${linkResetPW}">Go to the link</a> Verification code:${verificationCode} `,
    })
    .then((info) => {
      console.log('✅ Email di invito inviata con successo:', info.messageId);
      console.log('📧 Destinatario:', email);
    })
    .catch((error) => {
      console.error('❌ Errore invio email di invito:', error.message);
      console.error('📧 Email invite fallita per:', email);
    });

  } catch (error) {
    console.error('❌ Errore durante invito:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      console.log(user.email);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        verified: user.verified,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    console.log("Generated Token:", token, req.headers);

    if (!user.verified) {
      return res
        .status(400)
        .json({ message: "user not verified. Please check your email" });
    }

      res
      .cookie("Authorization", "Bearer " + token, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        token,
        email,
        message: "Logged in successfully",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logOut = async (req, res) => {
  res
    .clearCookie("Authorizazion")
    .status(200)
    .json({ success: true, message: "logged out successfully" });
};

const verifyUser = async (req, res) => {
  const { id, token } = req.params;
  const user = await User.findOne({ _id: id });
  console.log(user);
  console.log(id);

  try {
    if (user.token === token) {
      await User.updateOne({ _id: id }, { $set: { verified: true } });
      //await Token.findByIdAndRemove(token._id);
      return res.redirect("https://disco-app-angular.vercel.app/verify?status=success");
    }
  } catch (error) {
    res.redirect("https://disco-app-angular.vercel.app/verify?status=error");
  }
};

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

const resetPWrequest = async (req, res) => {
  const { email } = req.body;
  console.log('🚀 INIZIO reset password per:', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const userId = user._id;
    const linkResetPW = `https://disco-app-angular.vercel.app/resetPW/${userId}`;
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    console.log('👤 Codice reset generato per:', user.email);

    // ✅ RISPONDE SUBITO AL FRONTEND
    res.status(200).json({ 
      success: true, 
      message: `Reset link has been sent to ${email}` 
    });

    console.log('✅ Risposta reset inviata al frontend');

    // 📧 INVIO EMAIL RESET IN BACKGROUND
    console.log('📧 Invio email di reset in background...');
    
    transport.sendMail({
      from: process.env.NODE_MAILER_ADDRESS,
      to: email,
      subject: "reset password",
      html: `<p>copy the code below and paste it in verification code input to reset your password:</p>
       <a href="${linkResetPW}">Go to the link</a> Verification code:${verificationCode}.
       This code will expire in 10 minutes. `,
    })
    .then((info) => {
      console.log('✅ Email di reset inviata con successo:', info.messageId);
      console.log('📧 Destinatario:', email);
    })
    .catch((error) => {
      console.error('❌ Errore invio email di reset:', error.message);
      console.error('📧 Email reset fallita per:', email);
    });

  } catch (error) {
    console.error('❌ Errore durante reset password:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const resetPW = async (req, res) => {
  try {
    const { password, verificationCode } = req.body;
    const { id } = req.params;

    // Check if all required fields are provided
    if (!password || !verificationCode) {
      return res
        .status(400)
        .json({ message: "password and verification code are required" });
    }

    // Find the user by email and check the verification code and expiration
    const user = await User.findOne({
      _id: id,
      verificationCode: verificationCode,
      verificationCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset code
    user.password = hashedPassword;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "An error occurred while resetting password" });
  }
};

const getUserById = async(req,res) =>{
  const { id } = req.params;
  try {
   const user = await User.findById(id);
   return res.status(200).json(user)
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

module.exports = {
  getUsers,
  addUser,
  updatedUser,
  deleteUser,
  logIn,
  logOut,
  verifyUser,
  resetPWrequest,
  resetPW,
  inviteUser,
  getUserById
};