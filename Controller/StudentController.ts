import { Request, Response } from 'express';
import Student from '../Schemas/student';
import Course from '../Schemas/course';
import Grade from '../Schemas/grades';

// GET /- Get all student profile
export const getStudents = async (req: Request, res: Response) => {
  try {
    const student = await Student.find();
    if (!student) return res.status(404).json({ message: 'No Students Found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
// GET /students/:id - Get student profile
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// POST / - Register new student
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const findStudent = await Student.find({email:req.body.email});
    console.log(findStudent + " " + req.body.email);
    if (findStudent.length === 0) {
      const student = new Student(req.body);
      await student.save();
      return res.status(201).json(student);
    }
    return res.status(404).json({ message: 'Student Already Exists' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// PUT /students/:id - Update profile
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// GET /students/:id/grades - Get student grades
export const getStudentGrades = async (req: Request, res: Response) => {
  try {
    const grades = await Grade.find({ studentId: req.params.id });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// GET /students/:id/courses - Get enrolled courses
export const getStudentCourses = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const courses = await Course.find({ _id: { $in: student.courses } });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// POST /students/:id/enroll - Enroll in a course
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findById(req.params.id);
    const course = await Course.findById(courseId);
    if (!student || !course) return res.status(404).json({ message: 'Student or Course not found' });
    
    // Check if already enrolled
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    const enrollCourse = {
      courseId,
      courseName:course.title
    }

    const enrollStudent = {
      studentId:student._id, 
      studentName:student.name
    }

    student.enrolledCourses.push(enrollCourse);
    course.students.push(enrollStudent);

    await student.save();
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// POST /students/:id/remove-course - Remove student from a course
export const removeFromCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findById(req.params.id);
    const course = await Course.findById(courseId);
    if (!student || !course) return res.status(404).json({ message: 'Student or Course not found' });

    // Remove course from student's enrolledCourses
    student.enrolledCourses = student.enrolledCourses.filter(
      (c: any) => c.courseId !== courseId
    );
    await student.save();

    // Remove student from course's students
    course.students = course.students.filter(
      (s: any) => s.studentId !== student._id.toString()
    );
    await course.save();

    res.json({ message: 'Removed from course successfully' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// DELETE /:id - Delete course 
export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: `Student With Id:${req.params.id} Not Found!` });
        res.status(200).json({ message: "Student deleted successfully." });
    } catch (error) {
        res.status(501).json({ message: error });
    }
};