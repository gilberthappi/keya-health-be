
// routes/walletRoutes.js
const express = require('express');
const { getWallet, addTransaction } = require('../controllers/wallet');
import { verifyToken } from '../middleware';

const walletRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet Keya Health
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Wallet:
 *       type: object
 *       properties: 
 *         type:
 *           type: string
 *         amount:
 *           type: string
 *         number:
 *           type: string  
 *       required:
 *         - type
 *         - amount
 *         - number 
 */


/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: all clients transactions
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []  
 *     description: Get all transaction.
 *     responses:
 *       200:
 *         description: All transactions
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Bad request
 */

walletRouter.get('/', verifyToken, getWallet);
/**
 * @swagger
 * /wallet/transact:
 *   post:
 *     summary: Patient transaction api
 *     tags: [Wallet]
 *     description: Perform transaction.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *               number:
 *                 type: string
 *               
 *             required:
 *               - type
 *               - amount
 *               - number
 *     responses:
 *       201:
 *         description: Transaction done successfully
 *       401:
 *         description: unauthorized
 *       500:
 *         description: internal server error
 */
walletRouter.post('/transact', verifyToken, addTransaction);

export default walletRouter;
