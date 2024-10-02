import express from 'express';
import { AddDoctor, deleteDoctor, getAllDoctors, getDoctorById, updateDoctor } from '../controllers/dictors';
import { isAdmin, verifyToken } from '../middleware';

const doctorRouter = express.Router();


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the doctor
 *         email:
 *           type: string
 *           description: The email of the doctor
 *         name:
 *           type: string
 *           description: The name of the doctor
 *         phone:
 *           type: string
 *           description: The phone number of the doctor
 *         password:
 *           type: string
 *           description: The password of the doctor
 *         location:
 *           type: string
 *           description: The location of the doctor
 *         photo:
 *           type: string
 *           description: The photo URL of the doctor
 *         role:
 *           type: string
 *           description: The role of the user (doctor)
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         email: doctor@example.com
 *         name: Dr. John Doe
 *         phone: 1234567890
 *         password: 123456789
 *         location: Hospital XYZ
 *         photo: http://example.com/photo.jpg
 *         role: doctor
 */

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: API endpoints for managing doctors
 */

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       409:
 *         description: User with this email already exists
 *       500:
 *         description: Internal Server Error
 */

doctorRouter.post('/',verifyToken, isAdmin, AddDoctor)


/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       200:
 *         description: A list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Internal Server Error
 */

doctorRouter.get('/',verifyToken, getAllDoctors)


/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get a single doctor by ID
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the doctor
 *     responses:
 *       200:
 *         description: Details of a single doctor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal Server Error
 */

doctorRouter.get('/:id',verifyToken, getDoctorById)

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Update a doctor by ID
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal Server Error
 */
doctorRouter.put('/:id',verifyToken, isAdmin, updateDoctor)

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Delete a doctor by ID
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the doctor
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal Server Error
 */
doctorRouter.delete('/:id',verifyToken, isAdmin, deleteDoctor)

export default doctorRouter;