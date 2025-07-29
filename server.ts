import express from 'express';
import * as dotenv from 'dotenv'
import http from 'http';
import studentsRouter from './Routes/StudentRoutes';
import connectDatabase from './utils/Database';
import courseRouter from './Routes/CourseRouter';
import instructorRouter from './Routes/InstructorRoutes';
import gradesRouter from './Routes/GradesRoutes';
import paymentRouter from './Routes/PaymentRoutes';
const app = express();
const server = http.createServer(app);
connectDatabase()
dotenv.config()


import axios from 'axios';

const getToken = async () => {
  const clientId = process.env.clientId!;
  const clientSecret = process.env.clientSecret!;
  const username = 'admin';
  const password = 'admin';

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);
  params.append('scope', 'PRODUCTION');

  const response = await axios.post('https://localhost:9443/oauth2/token', params, {
    auth: {
      username: clientId,
      password: clientSecret,
    },
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  console.log('Access Token:', response.data.access_token);
  return response.data.access_token;
};


app.use(express.json());
app.post('/university/v1/api/login', async(req, res) => {
    console.log("Login endpoint hitted");
    const token = await getToken()
    res.json({ message: "Login endpoint is under construction" , token: token });
})
app.use('/university/v1/api/students', studentsRouter);
app.use('/university/v1/api/courses', courseRouter);
app.use('/university/v1/api/instructors', instructorRouter);
app.use('/university/v1/api/grades', gradesRouter);
app.use('/university/v1/api/payments', paymentRouter);

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
