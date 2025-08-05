import { Router } from 'express';
import { getSystemStats } from '../Controller/StatsController';

const statsRouter = Router();

statsRouter.get('/', getSystemStats);

export default statsRouter;
