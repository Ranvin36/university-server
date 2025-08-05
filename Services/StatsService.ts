import Student from '../Schemas/student';
import Instructor from '../Schemas/instructor';
import Course from '../Schemas/course';

export class StatsService {
    async getSystemStats() {
        try {
            const [studentCount, instructorCount, courseCount, paymentCount] = await Promise.all([
                Student.countDocuments(),
                Instructor.countDocuments(),
                Course.countDocuments(),
                Student.aggregate([
                    { $unwind: '$payments' },
                    { $group: { _id: null, count: { $sum: 1 } } }
                ]).then((result:any) => result[0]?.count || 0)
            ]);

            return {
                studentCount,
                instructorCount,
                courseCount,
                paymentCount
            };
        } catch (error) {
            console.error('Error fetching system stats:', error);
            throw error;
        }
    }
}
