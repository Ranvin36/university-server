import express from 'express';
import * as dotenv from 'dotenv'
import http from 'http';
import studentsRouter from './Routes/StudentRoutes';
import connectDatabase from './utils/Database';
import courseRouter from './Routes/CourseRouter';
import instructorRouter from './Routes/InstructorRoutes';
import cors from 'cors'
import authRouter from './Routes/AuthRouter';

const app = express();
const server = http.createServer(app);
connectDatabase()
dotenv.config()


const corsOptions = {
  origin: '*', 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/university/v1/api/auth',authRouter)
app.use('/university/v1/api/students', studentsRouter);
app.use('/university/v1/api/courses', courseRouter);
app.use('/university/v1/api/instructors', instructorRouter);

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
