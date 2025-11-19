import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import barberRoutes from './routes/barberRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import aiRoutes from './routes/aiRoutes';
import seedRoutes from './routes/seedRoutes';
import migrateRoutes from './routes/migrateRoutes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Barbershop API is running' });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/migrate', migrateRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`💈 Services: http://localhost:${PORT}/api/services`);
  console.log(`👨‍🦰 Barbers: http://localhost:${PORT}/api/barbers`);
  console.log(`📅 Appointments: http://localhost:${PORT}/api/appointments`);
  console.log(`🤖 AI: http://localhost:${PORT}/api/ai`);
  console.log(`🌱 Seed: http://localhost:${PORT}/api/seed` );
  console.log(`🔄 Migrate: http://localhost:${PORT}/api/migrate` );

});

export default app;
