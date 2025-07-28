import express from 'express';
import {
  getStudents,
  getStudentById,
  registerStudent,
  updateStudent,
  getStudentGrades,
  getStudentCourses,
  enrollInCourse,
  deleteStudent
} from '../Controller/StudentController';

const studentsRouter = express.Router();

studentsRouter.get('/', getStudents);
studentsRouter.get('/:id', getStudentById);
studentsRouter.post('/', registerStudent);
studentsRouter.put('/:id', updateStudent);
studentsRouter.get('/:id/grades', getStudentGrades);
studentsRouter.get('/:id/courses', getStudentCourses);
studentsRouter.post('/:id/enroll', enrollInCourse);
studentsRouter.delete('/:id',deleteStudent)
export default studentsRouter;