import express from "express";
import {
    create,
    view,
    viewSingle,
    editSingle,
    deleteSingle,
    sendMessage,
    deleteAll,
    checkIfChatExists,
    getUserChats,
    getUserChatById,
} from "../controllers/chat/index.js";
import { verifyToken, uploaded, isAdmin } from '../middleware/index.js';

const chatRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         title:
 *           type: string
 *         type:
 *           type: string
 *           enum: ["private"]
 *         privateUser1:
 *           type: string
 *           format: uuid
 *         privateUser2:
 *           type: string
 *           format: uuid
 *     Message:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *         type:
 *           type: string
 *           enum: ["text"]
 *         chat:
 *           type: string
 *           format: uuid
 *         sender:
 *           type: string
 *           format: uuid
 */

/**
 * @swagger
 * /chat/create-individual:
 *   post:
 *     summary: Create a new individual chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chat'
 *     responses:
 *       201:
 *         description: Created successfully
 *       400:
 *         description: Failed to create item, make sure data is valid
 */
chatRouter.post("/create-individual", uploaded, verifyToken, create);

/**
 * @swagger
 * /chat/view:
 *   get:
 *     summary: View all chats
 *     tags: [Chats]
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chat'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       400:
 *         description: Failed to retrieve data
 */
chatRouter.get("/view", verifyToken, view);

/**
 * @swagger
 * /chat/view/{id}:
 *   get:
 *     summary: View a single chat by ID
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Failed to retrieve data, make sure item exists
 */
chatRouter.get("/view/:id", verifyToken, viewSingle);

/**
 * @swagger
 * /chat/edit/{id}:
 *   patch:
 *     summary: Edit a single chat by ID
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Chat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chat'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       400:
 *         description: Failed to update item, make sure data is valid
 */
chatRouter.patch("/edit/:id", uploaded, verifyToken, editSingle);

/**
 * @swagger
 * /chat/send-message/{id}:
 *   post:
 *     summary: Send a message to a chat
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Chat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Created successfully
 *       400:
 *         description: Failed to create item, make sure data is valid
 */
chatRouter.post("/send-message/:id", uploaded, verifyToken, sendMessage);

/**
 * @swagger
 * /chat/delete-message/{messageId}:
 *   delete:
 *     summary: Delete a message by ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       400:
 *         description: Failed to delete item, make sure item exists
 */
chatRouter.delete("/delete-message/:messageId", verifyToken, deleteSingle);

/**
 * @swagger
 * /chat/delete-all:
 *   delete:
 *     summary: Delete all chats
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       400:
 *         description: Failed to delete. Make sure item exists
 */
chatRouter.delete("/delete-all", verifyToken, deleteAll);

/**
 * @swagger
 * /chat/check-if-chat-exists/{user1Id}/{user2Id}:
 *   get:
 *     summary: Check if a private chat exists between two users
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user1Id
 *         schema:
 *           type: string
 *         required: true
 *         description: User 1 ID
 *       - in: path
 *         name: user2Id
 *         schema:
 *           type: string
 *         required: true
 *         description: User 2 ID
 *     responses:
 *       200:
 *         description: Status of chat existence
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                 chatId:
 *                   type: string
 *                   format: uuid
 *       500:
 *         description: Server error
 */
chatRouter.get("/check-if-chat-exists/:user1Id/:user2Id", verifyToken, checkIfChatExists);



/**
 * @swagger
 * /chat/get-user-chats:
 *   get:
 *     summary: Get all chats for the authenticated user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Failed to retrieve chats
 */
chatRouter.get("/get-user-chats", verifyToken, getUserChats);

/**
 * @swagger
 * /chat/get-user-chat/{id}:
 *   get:
 *     summary: Get a single chat for the authenticated user by chat ID
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: Chat retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Failed to retrieve chat
 */
chatRouter.get("/get-user-chat/:id", verifyToken, getUserChatById);

/**
 * @swagger
 * /chat/signal/{roomId}:
 *   post:
 *     summary: Send signal data for WebRTC connection
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               signalData:
 *                 type: object  # Adjust as per your signal data structure
 *     responses:
 *       200:
 *         description: Signal sent successfully
 *       400:
 *         description: Failed to send signal
 */
chatRouter.post("/signal/:roomId", verifyToken, (req, res) => {
    const { io } = req.app;
    const { roomId } = req.params;
    const { signalData } = req.body;

    io.to(roomId).emit('signal', { userId: req.userId, signalData });
    console.log("id:", userId);
    res.status(200).send('Signal sent');
});

export default chatRouter;
