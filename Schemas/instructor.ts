const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({  
    courseId: {
        type: String,
        required: true,
        unique: true
    },
    courseName: {       
        type: String,
        required: true
    },
})

const instructorSchema = mongoose.Schema({
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
        type:Number,
        required: true,
    },
    department: {
        type: String,
        required: true
    },
    coursesTaught: [courseSchema]
});

const InstructorModel = mongoose.model("Instructor", instructorSchema);
export default InstructorModel;