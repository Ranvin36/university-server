const mongoose = require("mongoose");

const instructorSchema = mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {  
        type: Number,
        required: true,
    }
})


const studentsSchema = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {  
        type: Number,
        required: true,
    }
})


const CourseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
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