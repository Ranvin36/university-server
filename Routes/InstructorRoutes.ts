import express from 'express';
import {
  getInstructorById,
  getInstructorCourses,
  addInstructor,
  updateInstructor
} from '../Controller/InstructorController';

const instructorRouter = express.Router();

instructorRouter.get('/:id', getInstructorById);
instructorRouter.get('/:id/courses', getInstructorCourses);
instructorRouter.post('/', addInstructor);
instructorRouter.put('/:id', updateInstructor);

export default instructorRouter