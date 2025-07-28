import express from 'express';
import http from 'http';
import studentsRouter from './Routes/StudentRoutes';
import connectDatabase from './utils/Database';
import courseRouter from './Routes/CourseRouter';
const app = express();
const server = http.createServer(app);
connectDatabase()

app.use(express.json());
app.use('/university/v1/api/students', studentsRouter);
app.use('/university/v1/api/courses', courseRouter);



server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
