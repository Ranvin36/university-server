import { Request, Response } from 'express';
import Instructor from '../Schemas/instructor';
import { InstructorService } from '../Services/InstructorService';

const instructorService = new InstructorService();

// GET / - Get all instructors
export const getInstructors = async (req: Request, res: Response) => {
  try {
    const instructors = await instructorService.getAllInstructors();
    if (instructors.length === 0) {
      return res.status(404).json({ message: 'No instructors found' });
    }
    res.status(200).json(instructors);
  } catch (error) {
    console.error('Instructors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /:id - Get instructor by ID
export const getInstructorById = async (req: Request, res: Response) => {
  try {
    const instructor = await instructorService.getInstructorById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.status(200).json(instructor);
  } catch (error) {
    console.error('Instructor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /search - Search instructors
export const searchInstructors = async (req: Request, res: Response) => {
  try {
    const search = req.query.search || '';
    const instructors = await Instructor.find({
      name: { $regex: search, $options: 'i' }
    });
    res.status(200).json(instructors);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /:id/courses - Get instructor's courses
export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    const courses = await instructorService.getInstructorCourses(req.params.id);
    res.status(200).json(courses);
  } catch (error) {
    console.error('Courses error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST / - Create new instructor
export const addInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = await instructorService.createInstructor(req.body);
    res.status(201).json(instructor);
  } catch (error) {
    console.error('Instructor creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /:id - Update instructor
export const updateInstructor = async (req: Request, res: Response) => {
  try {
    const updated = await instructorService.updateInstructor(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /:id/add-course - Add course to instructor
export const addCourseToInstructor = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    const { instructors } = req.body;

    if (!Array.isArray(instructors) || instructors.length === 0) {
      return res.status(400).json({ message: "Instructors list is required" });
    }

    const result = await instructorService.addCourse(courseId, instructors);
    res.status(200).json(result);
  } catch (err) {
    console.error("Add instructors error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /:id/remove-course - Remove course from instructor
export const removeCourseFromInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = await instructorService.removeCourse(req.params.id, req.body.courseId);
    res.status(200).json(instructor);
  } catch (error) {
    console.error('Remove course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /:id - Delete instructor
export const deleteInstructor = async (req: Request, res: Response) => {
  try {
    const deleted = await instructorService.deleteInstructor(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.status(200).json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};