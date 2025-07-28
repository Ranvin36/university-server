const mongoose = require("mongoose");

const gradesSchema = mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        default: 0
    },
    semester: {
        type: String,
        required: true
    }
},{
    timestamp:true
});

const GradesModel = mongoose.model("Grades", gradesSchema);
export default GradesModel;