import express from 'express';
import { makePayment, getPaymentHistory, updatePaymentStatus } from '../Controller/PaymentController';

const paymentRouter = express.Router();

paymentRouter.post('/', makePayment);
paymentRouter.get('/:studentId', getPaymentHistory);
paymentRouter.put('/:id/status', updatePaymentStatus);

export default paymentRouter;