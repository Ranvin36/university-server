import { Request,Response } from "express"
import Courses from "../Schemas/course"

// GET /- Get all the courses 
export const getAllCourses = async(req:Request,res:Response) => {    
    try{
        const courses = await Courses.find()
        if(courses.length === 0) return res.status(404).json({message:"No Courses Found!"})
        res.status(200).json(courses)
    }
    catch(error){
        res.status(501).json({message:error})
    }

}
// GET /:id - Get a specific course 
export const getCourse = async(req:Request,res:Response) => {    
    try{
        const course = await Courses.findById(req.params.id)
        if(course.length === 0) return res.status(404).json({message:`Course With Id:${req.params.id} Not Found!`})
        res.status(200).json(course)
    }
    catch(error){
        res.status(501).json({message:error})
    }

}

// POST /- Create new course 
export const createCourse = async(req:Request,res:Response) =>{
    try{
        const create = new Courses(req.body)
        await create.save()
        res.status(201).json(req.body)
    }
        catch(error){
        res.status(501).json({message:error})
    }  
}

// PUT /courses/:id - Update course info
export const updateCourse = async (req: Request, res: Response) => {
    try {
        const updated = await Courses.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: `Course With Id:${req.params.id} Not Found!` });
        res.status(200).json(updated);
    } catch (error) {
        res.status(501).json({ message: error });
    }
};

// DELETE /courses/:id - Delete course 
export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const deleted = await Courses.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: `Course With Id:${req.params.id} Not Found!` });
        res.status(200).json({ message: "Course deleted successfully." });
    } catch (error) {
        res.status(501).json({ message: error });
    }
};