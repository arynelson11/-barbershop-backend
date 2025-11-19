import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authenticate } from '../middlewares/auth';

const router = Router();
const appointmentController = new AppointmentController();

router.get('/', authenticate, (req, res) => appointmentController.getAppointments(req, res));
router.post('/', authenticate, (req, res) => appointmentController.create(req, res));

export default router;
