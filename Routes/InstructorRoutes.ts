import express from 'express';
import {
  getInstructorById,
  getInstructorCourses,
  addInstructor,
  updateInstructor,
  addCourseToInstructor
} from '../Controller/InstructorController';

const instructorRouter = express.Router();

instructorRouter.get('/:id', getInstructorById);
instructorRouter.get('/:id/courses', getInstructorCourses);
instructorRouter.post('/', addInstructor);
instructorRouter.put('/:id', updateInstructor);
instructorRouter.post('/:id/add-course', addCourseToInstructor);

export default instructorRouter;