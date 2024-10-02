import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http'; 
import socketIo from 'socket.io'; 
import mainRouter from './src/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './src/utils/swaggerConfig';

require('dotenv').config();

const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', mainRouter);
// Initialize Middlewares


// Create an HTTP server using the express app
const server = http.createServer(app);

// Initialize Socket.io and pass the server instance
const io = socketIo(server);

// Make the io object accessible in other modules
app.set('io', io);

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API'});
});

// Setup Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  socket.on('signal', ({ roomId, signalData }) => {
    socket.to(roomId).emit('signal', { userId: socket.id, signalData });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

mongoose.connect(process.env.DB_CONNECTION_PROD)
  .then(() => {
    console.log('Database is connected');
    server.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
