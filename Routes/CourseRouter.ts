import express from "express";
import { 
createCourse, 
deleteCourse, 
getAllCourses,
getCourse, 
updateCourse
} from "../Controller/CourseController";

const courseRouter = express.Router()

courseRouter.get('/',getAllCourses)
courseRouter.post('/',createCourse)
courseRouter.get('/:id',getCourse)
courseRouter.put('/:id',updateCourse) 
courseRouter.delete('/:id',deleteCourse)
export default courseRouter
