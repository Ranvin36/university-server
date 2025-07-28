import { Request, Response } from 'express';
import Grades from '../Schemas/grades';

// GET /grades/:studentId - All grades of a student
export const getGradesByStudent = async (req: Request, res: Response) => {
  try {
    const grades = await Grades.find({ studentId: req.params.studentId });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// POST /grades - Add/update grade 
export const addOrUpdateGrade = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, grade, semester } = req.body;
    // Update if exists, else create
    const updated = await Grades.findOneAndUpdate(
      { studentId, courseId, semester },
      { grade },
      { new: true, upsert: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};