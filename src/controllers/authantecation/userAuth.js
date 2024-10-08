/* C:\Users\gdush\Documents\GitHub\keya-health-backend\src\controllers\authantecation\userAuth.js */
import { USER } from '../../models/userModel.js';
import { transporter } from '../../utils/mailTransport.js';
import { generateToken, comparePassword, hashPassword, generateOTP, isOTPValid,
   passHashing, sendEmail } from '../../utils';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';



dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

// Signup for both individual and organization clients
export const signup = async (req, res) => {
  try {
    const User = await USER.findOne({ email: req.body.email });

    if (User) {
      return res.status(409).json({
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await hashPassword(req.body.password);
   const hashedConfirmPassword = await hashPassword(req.body.confirmPassword);
    req.body.confirmPassword = hashedConfirmPassword;
    req.body.password = hashedPassword;

    const newUser = await USER.create(req.body);

    // console.log("signup data",newUser);
    if (!newUser) {
      res.status(404).json({ message: 'Failed to register' });
    }

    // // Send a welcome email to the user
    // const mailOptions = {
    //   from: 'gdushimimana6@gmail.com',
    //   to: newUser.email,
    //   subject: 'Welcome to Keya Health SITE',
    //   text: 'Thank you for signing up!',
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Email sending failed:', error);
    //   } else {
    //     console.log('Email sent:', info.response);
    //   }
    // });

    const token = generateToken({
      id: newUser.id,
      role:newUser.role,
      name:newUser.name,
      phone:newUser.phone,
      location:newUser.location,
      email:newUser.email,
      photo:newUser.photo,
      


    });

    res.status(201).json({
      message: 'User registered successfully',
      access_token: token,
      USER: {
        email: newUser.email,
        location: newUser.location,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        photo: newUser.photo,
        userId: newUser.id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
//##################################################################################
// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await USER.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Wrong password',
      });
    }

    const token = generateToken({
      id: user.id,
      role:user.role

    });

    res.status(200).json({
      message: 'User logged in successfully',
      access_token: token,
      USER: {
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        userId: user.id,
        location: user.location,
        photo: user.photo,
        // Add other relevant fields based on userType
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
//#######################################################
// Forgot Password
export const forgotPassword = async (req, res) => {
  const otp = generateOTP().code
  const expiresAt=generateOTP().expiresAt;
  const userEmail = req.body.email
  const user = await USER.findOne({ email: userEmail })
  if (!user) {
    return res
      .status(404)
      .json({
        message: `No user with email ${userEmail} found. Please use a correct registered email if you have ever signed up.`
      })
  }
  const hashedOTP = await passHashing(otp);
  user.otp = hashedOTP;
  user.otpExpiresAt=expiresAt;
  await user.save()
  await sendEmail(
    user.email,
    'Password OTP Code Reset',
    'Password Resetting!',
    `Use this ${otp} to change your password.  it is valid for five minutes  it will expire at ${expiresAt}`
  )

  return res
    .status(200)
    .json({
      message:
        'OTP sent successfully!! you can go to your email and came back with it.'
    })
}

//############################################################################

// Reset Password

export const resetPassword = async (req, res) => {
  const userEmail = req.body.email
  const user = await USER.findOne({ email: userEmail })
  if (!user) {
    return res
      .status(404)
      .json({
        message: `No user with email ${userEmail} found. Please use a correct registered email if you have ever signed up.`
      })
  }

  const receivedOTP = req.body.otp
  const storedOTP = user.otp;
  let validotp = isOTPValid(storedOTP, receivedOTP,user.otpExpiresAt,res)
  if (validotp) {
    const newpassword = req.body.newPassword;
    const hashedPassword = await hashPassword(newpassword)

    user.password = hashedPassword
    user.otp = undefined;
    user.otpExpiresAt=undefined;
    await user.save()
    return res.status(200).json({ message: 'Password updated successfully.' })
  }
  
}


//##################################################
// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req;
    const user = await USER.findById(userId);

    const isPasswordCorrect = await comparePassword(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Wrong password',
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};


// Get All Clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await USER.find();
    // sort clients by latest
    clients.sort((a, b) => b.date - a.date);
      res.status(200).json({
      message: 'All clients',
      clients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

//delete client by id 
export const deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await USER.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
      });
    }
    res.status(200).json({
      message: 'Client deleted successfully',
      client,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// user update his profile photo, name, location, phone, nationalId
export const updateProfile = async (req, res) => {
  try {
      const { userId } = req;
      const user = await USER.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // update user profile
      user.name = req.body.name || user.name;
      user.location = req.body.location || user.location;
      user.phone = req.body.phone || user.phone;
      user.nationalId = req.body.nationalId || user.nationalId;
      

      // Check for file upload
      if(req.files && req.files['photo'] && req.files['photo'][0]) {
        const result = await cloudinary.uploader.upload(req.files['photo'][0].path);
        user.photo = result.secure_url;
      }

      await user.save();

      res.status(200).json({
        message: 'Profile updated successfully',
        user,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};


