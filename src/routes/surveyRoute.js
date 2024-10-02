import express from 'express';
import {
    createSurvey,
    getSurveys,
    getSurveyById,
    updateSurvey,
    deleteSurvey,
    getUserSurveys,
    getUserWeights,
} from '../controllers/survey/surveyCrud';
import { verifyToken, uploaded } from '../middleware/index.js';

const surveyRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Survey:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user taking the survey
 *         age:
 *           type: string
 *           description: Age of the patient
 *         height:
 *           type: string
 *           description: Height of the patient in centimeters
 *         weight:
 *           type: string
 *           description: Weight of the patient in kilograms
 *         bloodType:
 *           type: string
 *           description: Blood type of the patient
 *         bloodPressure:
 *           type: object
 *           properties:
 *             systolic:
 *               type: string
 *             diastolic:
 *               type: string
 *           description: Blood pressure of the patient
 *         currentSymptoms:
 *           type: string
 *           description: Current symptoms the patient is experiencing
 *         medications:
 *           type: string
 *           description: Medications the patient is currently taking
 *         allergies:
 *           type: string
 *           description: Allergies the patient has
 *         chronicConditions:
 *           type: string
 *           description: Chronic conditions the patient has
 *         sleepQuality:
 *           type: string
 *           description: Quality of sleep the patient is experiencing
 *         foodDietRating:
 *           type: string
 *           description: Rating of the patient's food diet on a scale of 1 to 10
 */

/**
 * @swagger
 * /survey/create:
 *   post:
 *     summary: Create a new survey
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       201:
 *         description: Created successfully
 *       400:
 *         description: Error creating survey
 */
surveyRouter.post('/create',uploaded, verifyToken, createSurvey);

/**
 * @swagger
 * /survey/report:
 *   get:
 *     summary: Get all surveys
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Survey'
 *       400:
 *         description: Error fetching surveys
 */
surveyRouter.get('/report', verifyToken, getUserSurveys);

/**
 * @swagger
 * /survey/all:
 *   get:
 *     summary: Get all surveys
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Survey'
 *       400:
 *         description: Error fetching surveys
 */
surveyRouter.get('/all', verifyToken, getSurveys);

/**
 * @swagger
 * /survey/{id}:
 *   get:
 *     summary: Get a survey by ID
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Survey ID
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Survey'
 *       400:
 *         description: Error fetching survey
 *       404:
 *         description: Survey not found
 */
surveyRouter.get('/:id', verifyToken, getSurveyById);

/**
 * @swagger
 * /survey/update/{id}:
 *   patch:
 *     summary: Update a survey by ID
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Survey ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       400:
 *         description: Error updating survey
 *       404:
 *         description: Survey not found
 */
surveyRouter.patch('/update/:id', uploaded, verifyToken, updateSurvey);

/**
 * @swagger
 * /survey/delete/{id}:
 *   delete:
 *     summary: Delete a survey by ID
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Survey ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       400:
 *         description: Error deleting survey
 *       404:
 *         description: Survey not found
 */
surveyRouter.delete('/delete/:id', verifyToken, deleteSurvey);

/**
 * @swagger
 * /survey/user/weights:
 *   get:
 *     summary: Get user weight data for a graph
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 labels:
 *                   type: array
 *                   items:
 *                     type: string
 *                 datasets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           type: number
 *       400:
 *         description: Error fetching weight data
 */
surveyRouter.get('/user/weights', verifyToken, getUserWeights);


export default surveyRouter;
