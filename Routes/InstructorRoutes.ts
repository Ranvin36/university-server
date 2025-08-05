import express from 'express';
import {
  getInstructorById,
  getInstructorCourses,
  addInstructor,
  updateInstructor,
  addCourseToInstructor,
  getInstructors,
  deleteInstructor,
  removeCourseFromInstructor,
  searchInstructors
} from '../Controller/InstructorController';

const instructorRouter = express.Router();

instructorRouter.get('/', getInstructors);
instructorRouter.get('/src', searchInstructors);
instructorRouter.get('/:id', getInstructorById);
instructorRouter.get('/:id/courses', getInstructorCourses);
instructorRouter.post('/', addInstructor);
instructorRouter.put('/:id', updateInstructor);
instructorRouter.post('/:id/add-course', addCourseToInstructor);
instructorRouter.post('/:id/remove-course', removeCourseFromInstructor);
instructorRouter.delete('/:id', deleteInstructor)

export default instructorRouter;