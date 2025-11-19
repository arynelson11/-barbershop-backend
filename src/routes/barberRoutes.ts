import { Router } from 'express';
import { BarberController } from '../controllers/barberController';

const router = Router();
const barberController = new BarberController();

router.get('/', (req, res) => barberController.getAll(req, res));
router.get('/:id', (req, res) => barberController.getById(req, res));

export default router;
