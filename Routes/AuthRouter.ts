import express from 'express';
import { loginUser } from '../Controller/AuthController';
const authRouter = express.Router();

authRouter.post('/login',loginUser)

export default authRouter;
