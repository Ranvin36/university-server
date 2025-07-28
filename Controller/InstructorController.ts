import { Request, Response } from 'express';
import Instructor from '../Schemas/instructor';

// GET /instructors/:id - Get instructor profile
export const getInstructorById = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// GET /instructors/:id/courses - Courses taught by instructor
export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    res.json(instructor.coursesTaught);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// POST /instructors - Add new instructor (admin only)
export const addInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json(instructor);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// PUT /instructors/:id - Update info
export const updateInstructor = async (req: Request, res: Response) => {
  try {
    const updated = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Instructor not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// POST /instructors/:id/add-course - Add a course to instructor's coursesTaught
export const addCourseToInstructor = async (req: Request, res: Response) => {
  try {
    const { courseId, courseName } = req.body;
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });

    // Prevent duplicate courseId
    if (instructor.coursesTaught.some((c: any) => c.courseId === courseId)) {
      return res.status(400).json({ message: 'Course already assigned to instructor' });
    }

    instructor.coursesTaught.push({ courseId, courseName });
    await instructor.save();
    res.json({ message: 'Course added to instructor', coursesTaught: instructor.coursesTaught });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};