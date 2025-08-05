import { Request, Response } from 'express';
import Instructor from '../Schemas/instructor';
import CourseModel from '../Schemas/course';

// GET /instructors- Get all instructors 
export const getInstructors = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.find();
    if (!instructor) return res.status(404).json({ message: 'No Instructors found' });
    res.status(200).json(instructor);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// GET /instructors/:id - Get instructor profile
export const getInstructorById = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// GET /instructors?search=alex
export const searchInstructors = async (req: Request, res: Response) => {
  try {
    const search = req.query.search || "";
    const lecturers = await Instructor.find({
      name: { $regex: search, $options: "i" } 
    });

    res.status(200).json(lecturers);
  } catch (err) {
    console.error("Error fetching lecturers", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /instructors/:id/courses - Courses taught by instructor
export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    res.json(instructor.coursesTaught);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// POST /instructors - Add new instructor (admin only)
export const addInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = new Instructor(req.body);
    if(instructor.coursesTaught.length > 0) {
      for(const course of instructor.coursesTaught) {
        const courseModel = await CourseModel.findById(course.courseId)
        if(!courseModel) {
          return res.status(404).json({ message: `Course with ID ${course.courseId} not found` });
        }
        const instructorExists = courseModel.instructors.find((i: any) => String(i.id) === String(instructor._id));
        console.log(instructorExists)
        if (!instructorExists) {
          console.log(course)
          courseModel.instructors.push({
            id: instructor._id,
            name: instructor.name,
            email: instructor.email,
            phoneNumber: instructor.phoneNumber, 
          });
      }
        await courseModel.save();
      }
    }
    await instructor.save();
    res.status(201).json(instructor);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// PUT /instructors/:id - Update info
export const updateInstructor = async (req: Request, res: Response) => {
  try {
    const updated = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Instructor not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// POST /instructors/:id/add-course - Add a course to instructor's coursesTaught
export const addCourseToInstructor = async (req: Request, res: Response) => {
  try {
    const { instructors } = req.body;
    const course = await  CourseModel.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    for(const instructor of instructors){
      const instructorId = instructor.id;
      const instructorModel = await Instructor.findById(instructorId)
      if (instructorModel.coursesTaught.some((c: any) => c.courseId === course._id)) {
        return res.status(400).json({ message: 'Course already assigned to instructor' });
      }
      const courseTaught = {
        courseId:course._id, 
        courseName:course.title,
      }
      const instructorDataModel = {
        id:instructorModel._id,
        name:instructorModel.name,
        email:instructorModel.email,
        phoneNumber:instructorModel.phoneNumber
      }
      instructorModel.coursesTaught.push(courseTaught);
      course.instructors.push(instructorDataModel)
      await instructorModel.save();
    }
    await course.save();
    res.json({ message: 'Course added to instructor'});
    } catch (err) {
    res.status(400).json({ message: err instanceof Error ? err.message : err });
  }
};

// POST /instructors/:id/remove-course - Remove a course from instructor's coursesTaught
export const removeCourseFromInstructor = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });

    const initialLength = instructor.coursesTaught.length;
    instructor.coursesTaught = instructor.coursesTaught.filter((c: any) => c.courseId !== courseId);
    if (instructor.coursesTaught.length === initialLength) {
      return res.status(404).json({ message: 'Course not found in instructor\'s coursesTaught' });
    }
    const courseModel = await CourseModel.findById(req.body.courseId);
    console.log(courseModel.instructors,instructor.id)
    courseModel.instructors = courseModel.instructors.filter((c:any) => c.id != instructor.id);
    await courseModel.save();
    await instructor.save();
    res.json({ message: 'Course removed from instructor', coursesTaught: instructor.coursesTaught });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// DELETE /instructors/:id - Delete an instructor
export const deleteInstructor = async (req: Request, res: Response) => {
  try {
    console.log("Deleting instructor with ID:", req.params.id);
    const deleted = await Instructor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Instructor not found' });
    res.status(200).json({ message: 'Instructor deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}