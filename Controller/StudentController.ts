import { Request, Response } from 'express';
import { StudentService } from '../Services/StudentService';
import Student from '../Schemas/student';
import Course from '../Schemas/course';

const studentService = new StudentService();

// GET / - Get all students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await studentService.getAllStudents();
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }
    res.status(200).json(students);
  } catch (err) {
    console.error('Students error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /:id - Get student by ID
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error('Student error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /search - Search students
export const searchStudents = async (req: Request, res: Response) => {
  try {
    const search = req.query.search || '';
    const students = await Student.find({
      name: { $regex: search, $options: 'i' }
    });
    res.status(200).json(students);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST / - Register new student
export const registerStudent = async (req: Request, res: Response) => {
  try {
    console.log(req?.body)
    const student = await studentService.registerStudent(req.body);
    res.status(201).json(student);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /:id - Update student
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const updated = await studentService.updateStudent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /:id/courses - Get student's courses
export const getStudentCourses = async (req: Request, res: Response) => {
  try {
    const courses = await studentService.getStudentCourses(req.params.id);
    res.status(200).json(courses);
  } catch (err) {
    console.error('Courses error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /:id/enroll - Enroll in course
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Students list is required" });
    }

    const result = await studentService.enrollInCourse(courseId, students);
    res.status(200).json(result);
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /:id/remove-course - Remove from course
export const removeFromCourse = async (req: Request, res: Response) => {
  try {
    const student = await studentService.removeFromCourse(req.params.id, req.body.courseId);
    res.status(200).json(student);
  } catch (err) {
    console.error('Removal error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /:id - Delete student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: `Student With Id:${req.params.id} Not Found!` });
    }
    res.status(200).json({ message: "Student deleted successfully." });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUnpaidStudents = async (req:Request, res:Response) => {
  console.log("Inside")
  try {
    const unpaidStudents = await Student.find({
      $or: [
        { payments: { $eq: [] } },
        { 'payments.status': 'unpaid' }
      ]
    });
    

    res.json(unpaidStudents);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// GET /total-payments - Get total payments
export const getTotalPayments = async (req: Request, res: Response) => {
  try {
    const total = await studentService.getTotalPayments();
    res.status(200).json({ totalAmount: total });
  } catch (err) {
    console.error('Total payments error:', err);
    res.status(500).json({ error: 'Failed to calculate total payments' });
  }
};

// controllers/studentController.js
export const createPayment = async (req:Request, res:Response) => {
  try {
    const studentId = req.params.id;
    const { amount, description } = req.body; 

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.payments.push({
      amount,
      status:'paid',
      description
    });

    await student.save();
    res.status(201).json({ message: "Payment added", student });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};