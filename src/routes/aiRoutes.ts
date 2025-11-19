import { Router } from 'express';
import { AIController } from '../controllers/aiController';

const router = Router();
const aiController = new AIController();

router.post('/suggest-times', (req, res) => aiController.suggestTimes(req, res));

export default router;
