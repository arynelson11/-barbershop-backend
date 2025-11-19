import { Request, Response } from 'express';
import { BarberService } from '../services/barberService';

const barberService = new BarberService();

export class BarberController {
  async getAll(req: Request, res: Response) {
    try {
      const barbers = await barberService.getAll();
      return res.status(200).json(barbers);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const barber = await barberService.getById(id);
      return res.status(200).json(barber);
    } catch (error: any) {
      if (error.message === 'Barbeiro não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
