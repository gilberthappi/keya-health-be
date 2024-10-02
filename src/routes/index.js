import express from 'express';
import userRouter from './authRoute';
import contactRouter from './contactRoute';
// import walletRouter from './walletRoutes';
import appointmentRoutes from './appointments.routes';
import chatRouter from './chatsRoute'
import surveyRouter from './surveyRoute';
import doctorRouter from './doctors.routes';


const mainRouter = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/doctors', doctorRouter);
mainRouter.use('/cont',contactRouter);
// mainRouter.use('/wallet',walletRouter);
mainRouter.use('/booking',appointmentRoutes);
mainRouter.use('/chat', chatRouter)
mainRouter.use('/survey', surveyRouter)


export  default mainRouter;
