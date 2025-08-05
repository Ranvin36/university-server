import { Request, Response } from "express";
import { CourseService } from "../Services/CourseService";

const courseService = new CourseService();

// GET / - Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await courseService.getAllCourses();
        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }
        res.status(200).json(courses);
    } catch (error) {
        console.error("Courses error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /by-enrollment - Get courses ordered by student enrollment
export const getCoursesByEnrollment = async (req: Request, res: Response) => {
    try {
        const courses = await courseService.getCoursesByEnrollment();
        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }
        res.status(200).json(courses);
    } catch (error) {
        console.error("Courses by enrollment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /:id - Get a specific course
export const getCourse = async (req: Request, res: Response) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: `Course with ID ${req.params.id} not found` });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error("Course error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST / - Create new course
export const createCourse = async (req: Request, res: Response) => {
    try {
        const course = await courseService.createCourse(req.body);
        res.status(201).json(course);
    } catch (error) {
        console.error("Course creation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// PUT /:id - Update course info
export const updateCourse = async (req: Request, res: Response) => {
    try {
        const updated = await courseService.updateCourse(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: `Course with ID ${req.params.id} not found` });
        }
        res.status(200).json(updated);
    } catch (error) {
        console.error("Course update error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE /:id - Delete course
export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const deleted = await courseService.deleteCourse(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: `Course with ID ${req.params.id} not found` });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Course deletion error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /:id/add-instructor - Add instructor to course
export const addInstructor = async (req: Request, res: Response) => {
    try {
        const course = await courseService.addInstructor(req.params.id, req.body.instructorId);
        res.status(200).json(course);
    } catch (error) {
        console.error("Add instructor error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /:id/remove-instructor - Remove instructor from course
export const removeInstructor = async (req: Request, res: Response) => {
    try {
        const course = await courseService.removeInstructor(req.params.id, req.body.instructorId);
        res.status(200).json(course);
    } catch (error) {
        console.error("Remove instructor error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};