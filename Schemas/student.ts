const mongoose = require("mongoose");

const enrolledCourses = mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
    },
    courseName: {
        type: String,
        required: true
    },
})

const gradesSchema = mongoose.Schema({
    courseId: {
        type: String,
        required: true,
    },
    grade: {
        type: Number,
        default: 0
    },
})

const paymentSchema = mongoose.Schema({
  amount: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'pending',
  },
});

const Student = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true    
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    level:{
        type:Number,
        default:4
    },
    program:{
        type: String,
        required: true
    },
    enrolledCourses: [enrolledCourses],
    grades: [gradesSchema],
    payments:[paymentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timeStamp: true
})

const StudentModel = mongoose.model("Student", Student);
export default StudentModel;