const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const PaymentModel = mongoose.model("Payment", PaymentSchema);
export default PaymentModel;