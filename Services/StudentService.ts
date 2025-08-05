import Student from '../Schemas/student';
import Course from '../Schemas/course';

export class StudentService {
    async getAllStudents() {
        return await Student.find();
    }

    async getTotalPayments() {
        const total = await Student.aggregate([
            { $unwind: '$payments' },
            { $group: { _id: null, totalAmount: { $sum: '$payments.amount' } } }
        ]);
        return total[0]?.totalAmount || 0;
    }

    async getStudentById(id: string) {
        return await Student.findById(id);
    }

    async registerStudent(data: any) {
        const existing = await Student.findOne({ email: data.email });
        if (existing) throw new Error("Student already exists");

        const student = new Student(data);
        await student.save();

        // Handle course enrollment if provided
        if (data.enrolledCourses) {
            await this.handleCourseEnrollment(student, data.enrolledCourses);
        }

        return student;
    }

    async updateStudent(id: string, data: any) {
        return await Student.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteStudent(id: string) {
        return await Student.findByIdAndDelete(id);
    }

    async getStudentCourses(id: string) {
        const student = await Student.findById(id);
        if (!student) throw new Error("Student not found");
        return await Course.find({ _id: { $in: student.enrolledCourses.map((c: any) => c.courseId) } });
    }

    async enrollInCourse(courseId: string, students: { id: string }[]) {
        const course = await Course.findById(courseId);
        if (!course) throw new Error("Course not found");
      
        const enrollCourse = {
          courseId: course._id,
          courseName: course.title,
        };
      
        for (const std of students) {
          const student = await Student.findById(std.id);
          if (!student) continue; // Skip if student doesn't exist
      
        //   const alreadyEnrolled = student.enrolledCourses.find(
        //     (c: any) => String(c.courseId) === String(courseId)
        //   );
        //   if (alreadyEnrolled) continue; // Skip if already enrolled
      
        //   // Prevent duplicate in course.students (optional)
        //   const alreadyInCourse = course.students.find(
        //     (s: any) => String(s.id) === String(student._id)
        //   );
        //   if (alreadyInCourse) continue;
      
          // Add course to student
          student.enrolledCourses.push(enrollCourse);
      
          // Add student to course
          course.students.push({
            id: student._id,
            name: student.name,
            email: student.email,
            phoneNumber: student.phoneNumber,
          });
      
          await student.save();
        }
      
        await course.save();
        return { message: "Enrollment successful" };
      }
      

    async removeFromCourse(studentId: string, courseId: string) {
        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!student || !course) throw new Error("Student or Course not found");

        // Remove from student's courses
        student.enrolledCourses = student.enrolledCourses.filter(
            (c: any) => String(c.courseId) !== String(courseId)
        );

        // Remove from course's students
        course.students = course.students.filter(
            (s: any) => String(s.id) !== String(student._id)
        );

        await Promise.all([
            student.save(),
            course.save()
        ]);

        return student;
    }

    private async handleCourseEnrollment(student: any, courses: any[]) {
        const uniqueCoursesMap = new Map();
        for (const course of courses) {
            uniqueCoursesMap.set(course.courseId, course);
        }

        const uniqueCourses = Array.from(uniqueCoursesMap.values());
        for (const course of uniqueCourses) {
            const courseModel = await Course.findById(course.courseId);
            if (!courseModel) throw new Error(`Course with ID ${course.courseId} not found`);

            student.enrolledCourses.push({
                courseId: courseModel._id,
                courseName: courseModel.title
            });

            courseModel.students.push({
                id: student._id,
                name: student.name,
                email: student.email,
                phoneNumber: student.phoneNumber
            });
        }
    }
}
