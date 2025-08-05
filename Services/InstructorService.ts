import Instructor from '../Schemas/instructor';
import Course from '../Schemas/course';

export class InstructorService {
    async getAllInstructors() {
        return await Instructor.find();
    }

    async getInstructorById(id: string) {
        return await Instructor.findById(id);
    }

    async createInstructor(data: any) {
        const instructor = new Instructor(data);
        await instructor.save();
        return instructor;
    }

    async updateInstructor(id: string, data: any) {
        return await Instructor.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteInstructor(id: string) {
        return await Instructor.findByIdAndDelete(id);
    }

    async getInstructorCourses(id: string) {
        const instructor = await Instructor.findById(id);
        if (!instructor) throw new Error("Instructor not found");
        return await Course.find({ _id: { $in: instructor.coursesTaught.map((c: any) => c.courseId) } });
    }

    async addCourse(courseId: string, instructors: { id: string }[]) {
        const course = await Course.findById(courseId);
        if (!course) throw new Error("Course not found");
      
        const courseData = {
          courseId: course._id,
          courseName: course.title,
        };
      
        for (const inst of instructors) {
          const instructor = await Instructor.findById(inst.id);
          if (!instructor) continue;
      
          // Check if instructor already teaches the course
          const alreadyTeaching = instructor.coursesTaught.find(
            (c: any) => String(c.courseId) == String(courseId)
          );
          if (alreadyTeaching) continue;
      
          // Prevent duplicate instructor in course
          const alreadyInCourse = course.instructors.find(
            (i: any) => String(i.id) == String(instructor._id)
          );
          if (alreadyInCourse) continue;
      
          // Update instructor and course
          instructor.coursesTaught.push(courseData);
      
          course.instructors.push({
            id: instructor._id,
            name: instructor.name,
            email: instructor.email,
            phoneNumber: instructor.phoneNumber,
          });
      
          await instructor.save();
        }
      
        await course.save();

        return { message: "Instructors added to course successfully" };
      }
      

    async removeCourse(instructorId: string, courseId: string) {
        const instructor = await Instructor.findById(instructorId);
        const course = await Course.findById(courseId);

        if (!instructor || !course) throw new Error("Instructor or Course not found");

        // Remove from instructor's courses
        instructor.coursesTaught = instructor.coursesTaught.filter(
            (c: any) => String(c.courseId) != String(courseId)
        );

        // Remove from course's instructors
        course.instructors = course.instructors.filter(
            (i: any) => String(i.id) != String(instructorId)
        );

        await Promise.all([
            instructor.save(),
            course.save()
        ]);

        return instructor;
    }
}
