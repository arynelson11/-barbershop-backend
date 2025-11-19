import { Router } from 'express';
import { ServiceController } from '../controllers/serviceController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const serviceController = new ServiceController();

router.get('/', (req, res) => serviceController.getAll(req, res));
router.post('/', authenticate, authorize('admin'), (req, res) => serviceController.create(req, res));
router.put('/:id', authenticate, authorize('admin'), (req, res) => serviceController.update(req, res));
router.delete('/:id', authenticate, authorize('admin'), (req, res) => serviceController.delete(req, res));

export default router;
