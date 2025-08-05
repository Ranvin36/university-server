import { Request, Response } from 'express';
import { StatsService } from '../Services/StatsService';

const statsService = new StatsService();

// GET /stats - Get system statistics
export const getSystemStats = async (req: Request, res: Response) => {
    try {
        const stats = await statsService.getSystemStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch system statistics' });
    }
};
