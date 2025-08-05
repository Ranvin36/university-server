# University Server

A TypeScript-based RESTful API server for managing university operations including students, courses, instructors, and payments.

## Features

- Student Management:
  - CRUD operations for students
  - Course enrollment management
  - Payment tracking
  - Search functionality

- Course Management:
  - Course registration
  - Student enrollment
  - Course statistics

- Instructor Management:
  - Instructor profiles
  - Assign To Courses

- Authentication:
  - Secure user authentication

- Statistics:
  - Payment tracking

## Tech Stack

- **Backend**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Development Tools**:
  - Nodemon for development
  - TypeScript compiler
  - ESLint and Prettier for code quality

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd university-server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### Running the Server

For development:
```bash
npm run server
```

For production:
```bash
npm start
```

## API Documentation

The API is built with RESTful principles and follows these conventions:

- Base URL: `http://localhost:3000`
- Authentication: JWT tokens
- Response Format: JSON
- Error Handling: Standard HTTP status codes

### Available Routes

- **Students**:
  - GET `/api/students` - List all students
  - GET `/api/students/:id` - Get student by ID
  - POST `/api/students` - Create new student
  - PUT `/api/students/:id` - Update student
  - DELETE `/api/students/:id` - Delete student
  - GET `/api/students/:id/courses` - Get student's courses
  - POST `/api/students/:id/enroll` - Enroll in course
  - POST `/api/students/:id/remove-course` - Remove from course
  - GET `/api/students/unpaid` - Get unpaid students
  - GET `/api/students/total-payments` - Get total payments

- **Courses**:
  - GET `/api/courses` - List all courses
  - POST `/api/courses` - Create new course
  - PUT `/api/courses/:id` - Update course
  - DELETE `/api/courses/:id` - Delete course

- **Instructors**:
  - GET `/api/instructors` - List all instructors
  - POST `/api/instructors` - Create new instructor
  - PUT `/api/instructors/:id` - Update instructor
  - DELETE `/api/instructors/:id` - Delete instructor

- **Authentication**:
  - POST `/api/auth/login` - Login
  - POST `/api/auth/register` - Register

## Project Structure

```
university-server/
├── Controller/        # Express route controllers
├── Routes/           # Express route definitions
├── Schemas/          # MongoDB schemas
├── Services/         # Business logic services
├── utils/           # Utility functions
├── server.ts        # Main server file
├── package.json     # Project dependencies
└── tsconfig.json    # TypeScript configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.
