const mongoose = require("mongoose");

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
        type: Number,
        required: true,
        unique: true
    }
})


const studentsSchema = mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    }
})


const CourseSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    credits: {
        type: Number,
        required: true
    },
    instructors:[instructorSchema],
    students: [studentsSchema]
},{
    timestamp:true
});

const CourseModel = mongoose.model("Course", CourseSchema);
export default CourseModel;