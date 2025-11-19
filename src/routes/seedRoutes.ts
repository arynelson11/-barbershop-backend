import { Router } from 'express';
import { runSeed } from '../controllers/seedController';

const router = Router( );

// Rota para popular o banco de dados
router.get('/', runSeed);

export default router;
