import express from 'express';
import {
  getStudents,
  getStudentById,
  registerStudent,
  updateStudent,
  getStudentGrades,
  getStudentCourses,
  enrollInCourse,
  deleteStudent,
  removeFromCourse,
  getUnpaidStudents,
  searchStudents,
  createPayment
} from '../Controller/StudentController';

const studentsRouter = express.Router();

studentsRouter.post('/', registerStudent);
studentsRouter.get('/', getStudents);
studentsRouter.get('/unpaid', getUnpaidStudents);
studentsRouter.get('/src', searchStudents);
studentsRouter.get('/:id', getStudentById);
studentsRouter.put('/:id', updateStudent);
studentsRouter.get('/:id/grades', getStudentGrades);
studentsRouter.get('/:id/courses', getStudentCourses);
studentsRouter.post('/create-payment/:id', createPayment);
studentsRouter.post('/:id/enroll', enrollInCourse);
studentsRouter.post('/:id/remove-course', removeFromCourse);
studentsRouter.delete('/:id',deleteStudent)
export default studentsRouter;