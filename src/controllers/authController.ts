import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { signupSchema, loginSchema } from '../utils/validations';
import { AuthRequest } from '../middlewares/auth';

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const validatedData = signupSchema.parse(req.body);
      const result = await authService.signup(validatedData);
      return res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      return res.status(401).json({ error: error.message });
    }
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const user = await authService.getMe(req.user.userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }
}
