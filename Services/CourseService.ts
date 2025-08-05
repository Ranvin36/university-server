import Course from '../Schemas/course';
import Instructor from '../Schemas/instructor';

export class CourseService {
    async getAllCourses() {
        return await Course.find();
    }

    async getCoursesByEnrollment() {
        return await Course.find()
            .populate('students')
            .sort({ 'students.length': -1 });
    }

    async getCourseById(id: string) {
        return await Course.findById(id);
    }

    async createCourse(data: any) {
        const course = new Course(data);
        await course.save();
        return course;
    }

    async updateCourse(id: string, data: any) {
        return await Course.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteCourse(id: string) {
        return await Course.findByIdAndDelete(id);
    }

    async addInstructor(courseId: string, instructorId: string) {
        const course = await Course.findById(courseId);
        const instructor = await Instructor.findById(instructorId);

        if (!course || !instructor) throw new Error("Course or Instructor not found");

        // Check if already assigned
        const alreadyAssigned = course.instructors.find(
            (i: any) => String(i.id) === String(instructorId)
        );

        if (alreadyAssigned) throw new Error("Instructor already assigned to this course");

        // Update relationships
        course.instructors.push({
            id: instructor._id,
            name: instructor.name,
            email: instructor.email,
            phoneNumber: instructor.phoneNumber
        });

        instructor.coursesTaught.push({
            courseId: course._id,
            courseName: course.title
        });

        await Promise.all([
            course.save(),
            instructor.save()
        ]);

        return course;
    }

    async removeInstructor(courseId: string, instructorId: string) {
        const course = await Course.findById(courseId);
        const instructor = await Instructor.findById(instructorId);

        if (!course || !instructor) throw new Error("Course or Instructor not found");

        // Remove from course's instructors
        course.instructors = course.instructors.filter(
            (i: any) => String(i.id) !== String(instructorId)
        );

        // Remove from instructor's courses
        instructor.coursesTaught = instructor.coursesTaught.filter(
            (c: any) => String(c.courseId) !== String(courseId)
        );

        await Promise.all([
            course.save(),
            instructor.save()
        ]);

        return course;
    }
}
