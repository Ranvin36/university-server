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
    console.log(err)
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

export const searchStudents = async(req:Request,res:Response) => {
  try{
    const search = req.query.search || "";
    const student = await Student.find(
     { name: { $regex: search, $options: "i" }
    })
    res.status(200).json(student)
  }
  catch(err){
    res.status(500).json({message:err})
  }
}

// POST / - Register new student
export const registerStudent = async (req: Request, res: Response) => {
  try {
    console.log("REGISTER STUDENT", req.body)
    const existingStudent = await Student.findOne({ email: req.body.email });
    if (existingStudent) {
      return res.status(409).json({ message: 'Student already exists' });
    }
    const student = new Student(req.body);
    const uniqueCoursesMap = new Map();

    // Step 1: De-duplicate courses by courseId
    for (const course of req.body.enrolledCourses) {
      uniqueCoursesMap.set(course.courseId, course); // keeps only one entry per courseId
    }

    const uniqueCourses = Array.from(uniqueCoursesMap.values());

    for (const course of uniqueCourses) {
      const courseModel = await Course.findById(course.courseId);
      if (!courseModel) {
        return res.status(404).json({ message: `Course with ID ${course.courseId} not found` });
      }

      // Check if student already exists in course
      const alreadyAdded = courseModel.students.find((s:any) => String(s.id) === String(student._id));
      if (!alreadyAdded) {
        courseModel.students.push({
          id: student._id,
          name: student.name,
          email:student.email,
          phoneNumber:student.phoneNumber
        });
        await courseModel.save();
      }

      // Check if course is already in student's enrolledCourses (optional if deduped earlier)
      const alreadyEnrolled = student.enrolledCourses.find(
        (c:any) => String(c.courseId) === String(course.courseId)
      );
      if (!alreadyEnrolled) {
        student.enrolledCourses.push({
          courseId: course.courseId,
          courseName: course.courseName,
        });
        await student.save();
      }
    }
    await student.save();
    return res.status(201).json(student);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
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
    const { id } = req.params;
    const { students } = req.body;
    console.log(id,students)  
    const course = await Course.findById(id);
    
    const enrollCourse = {
      courseId:id,
      courseName:course.title
    }
    
    for(const std of students){
      const studentId = std.id;
      console.log(studentId)
      const student = await Student.findById(studentId);    
      if (!student || !course) return res.status(404).json({ message: 'Student or Course not found' });
      
      // Check if already enrolled
      const alreadyEnrolled = student.enrolledCourses.find((c: any) => String(c.courseId) === String(id));
      if (alreadyEnrolled) {
        continue; 
      }

      const enrollStudent = {
        id:student._id, 
        name:student.name,
        email:student.email,
        phoneNumber:student.phoneNumber
      }
      
      student.enrolledCourses.push(enrollCourse);
      course.students.push(enrollStudent);
      await student.save();
    }
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
      (c: any) => c.courseId != courseId
    );
    await student.save();

    // Remove student from course's students
    course.students = course.students.filter(
      (s: any) => String(s.id) != String(student._id)
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

export const getUnpaidStudents = async (req:Request, res:Response) => {
  try {
    const unpaidStudents = await Student.find({
      $or: [
        { payments: { $eq: [] } },
        { payments: { $not: { $elemMatch: { status: 'paid' } } } }
      ]
    });

    res.json(unpaidStudents);
  } catch (err) {
    res.status(500).json({ error: err });
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