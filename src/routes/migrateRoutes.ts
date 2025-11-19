import { Router } from 'express';
import { runMigrate } from '../controllers/migrateController';

const router = Router( );

// Rota para executar migrations
router.get('/', runMigrate);

export default router;
