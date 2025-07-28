import { Request, Response } from 'express';
import Payment from '../Schemas/payment';

// POST /payments - Make a payment
export const makePayment = async (req: Request, res: Response) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// GET /payments/:studentId - Get payment history
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ studentId: req.params.studentId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// PUT /payments/:id/status - Update payment status
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};