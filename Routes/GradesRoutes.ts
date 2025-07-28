import express from 'express';
import { getGradesByStudent, addOrUpdateGrade } from '../Controller/GradesController';

const gradesRouter = express.Router();

gradesRouter.get('/:studentId', getGradesByStudent);
gradesRouter.post('/', addOrUpdateGrade);

export default gradesRouter