import { USER } from "../../models/userModel.js";
import { hashPassword } from "../../utils";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});
export const AddDoctor = async (req, res) => {
  try {
    const existingUser = await USER.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }
    // Ensure the role is set to 'doctor'
    req.body.role = "doctor";
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const newUser = await USER.create(req.body);
    if (!newUser) {
      return res.status(404).json({ message: "Failed to register new doctor" });
    }

    res.status(201).json({
      message: "Doctor registered successfully",
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
    console.error("Error in Create Doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Clients
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await USER.find({ role: "doctor" }).sort({ date: -1 });
    res.status(200).json({
      message: "All doctors",
      doctors,
    });
  } catch (error) {
    console.error("Error in Get All Doctors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await USER.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({
      message: "Doctor details",
      doctor,
    });
  } catch (error) {
    console.error("Error in Get Single Doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateDoctor = async (req, res) => {
    try {
      const updatedDoctor = await USER.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedDoctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.status(200).json({
        message: 'Doctor updated successfully',
        doctor: updatedDoctor,
      });
    } catch (error) {
      console.error('Error in Update Doctor:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  export const deleteDoctor = async (req, res) => {
    try {
      const deletedDoctor = await USER.findByIdAndDelete(req.params.id);
      if (!deletedDoctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.status(200).json({
        message: 'Doctor deleted successfully',
      });
    } catch (error) {
      console.error('Error in Delete Doctor:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }