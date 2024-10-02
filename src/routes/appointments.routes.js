// routes/appointmentRoutes.js
import express from "express";
const { getAppointments, createAppointment, updateAppointment, getAppointmentById, deleteAppointment } = require('../controllers/appointments');
const { verifyToken } = require('../middleware');


const appointmentRoutes = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - date
 *         - doctor
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the appointment
 *         user:
 *           type: string
 *           description: The ID of the user who made the appointment
 *         doctor:
 *           type: string
 *           description: The ID of the doctor with whom the appointment is made
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the appointment
 *         status:
 *           type: string
 *           description: The current status of the appointment (e.g., pending, confirmed, completed)
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         user: 60d0fe4f5311236168a109cb
 *         doctor: 60d0fe4f5311236168a109cc
 *         date: 2024-08-27T15:00:00Z
 *         status: pending
 */

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: API endpoints for managing appointments
 */

/**
 * @swagger
 * /booking:
 *   get:
 *     summary: Get all appointments for the logged-in user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The auto-generated ID of the appointment
 *                   user:
 *                     type: string
 *                     description: The ID of the user
 *                   doctor:
 *                     type: string
 *                     description: The ID of the doctor
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time of the appointment
 *                   status:
 *                     type: string
 *                     description: The status of the appointment
 *                 example:
 *                   id: 60d0fe4f5311236168a109ca
 *                   user: 60d0fe4f5311236168a109cb
 *                   doctor: 60d0fe4f5311236168a109cc
 *                   date: 2024-08-27T15:00:00Z
 *                   status: confirmed
 */

appointmentRoutes.get('/', verifyToken, getAppointments);

/**
 * @swagger
 * /booking:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time of the appointment
 *               doctor:
 *                 type: string
 *                 description: The ID of the doctor
 *             required:
 *               - date
 *               - doctor
 *     responses:
 *       200:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the appointment
 *                 user:
 *                   type: string
 *                   description: The ID of the user
 *                 doctor:
 *                   type: string
 *                   description: The ID of the doctor
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time of the appointment
 *                 status:
 *                   type: string
 *                   description: The status of the appointment
 *               example:
 *                 id: 60d0fe4f5311236168a109ca
 *                 user: 60d0fe4f5311236168a109cb
 *                 doctor: 60d0fe4f5311236168a109cc
 *                 date: 2024-08-27T15:00:00Z
 *                 status: pending
 *       500:
 *         description: Internal Server Error
 */
appointmentRoutes.post('/', verifyToken, createAppointment);
/**
 * @swagger
 * /booking/{id}:
 *   get:
 *     summary: Get a single appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment
 *     responses:
 *       200:
 *         description: Details of a single appointment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the appointment
 *                 user:
 *                   type: string
 *                   description: The ID of the user
 *                 doctor:
 *                   type: string
 *                   description: The ID of the doctor
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time of the appointment
 *                 status:
 *                   type: string
 *                   description: The status of the appointment
 *               example:
 *                 id: 60d0fe4f5311236168a109ca
 *                 user: 60d0fe4f5311236168a109cb
 *                 doctor: 60d0fe4f5311236168a109cc
 *                 date: 2024-08-27T15:00:00Z
 *                 status: confirmed
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal Server Error
 */
appointmentRoutes.get('/:id',verifyToken, getAppointmentById);
/**
 * @swagger
 * /booking/{id}:
 *   put:
 *     summary: Update an appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The status of the appointment
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the appointment
 *                 user:
 *                   type: string
 *                   description: The ID of the user
 *                 doctor:
 *                   type: string
 *                   description: The ID of the doctor
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time of the appointment
 *                 status:
 *                   type: string
 *                   description: The status of the appointment
 *               example:
 *                 id: 60d0fe4f5311236168a109ca
 *                 user: 60d0fe4f5311236168a109cb
 *                 doctor: 60d0fe4f5311236168a109cc
 *                 date: 2024-08-27T15:00:00Z
 *                 status: completed
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal Server Error
 */
appointmentRoutes.put('/:id', verifyToken, updateAppointment);

/**
 * @swagger
 * /booking/{id}:
 *   delete:
 *     summary: Delete an appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal Server Error
 */
appointmentRoutes.delete('/:id',verifyToken, deleteAppointment);

export default appointmentRoutes;
