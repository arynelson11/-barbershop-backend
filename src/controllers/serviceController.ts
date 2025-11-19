import { Request, Response } from 'express';
import { ServiceService } from '../services/serviceService';
import { createServiceSchema, updateServiceSchema } from '../utils/validations';

const serviceService = new ServiceService();

export class ServiceController {
  async getAll(req: Request, res: Response) {
    try {
      const services = await serviceService.getAll();
      return res.status(200).json(services);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validatedData = createServiceSchema.parse(req.body);
      const service = await serviceService.create(validatedData);
      return res.status(201).json(service);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateServiceSchema.parse(req.body);
      const service = await serviceService.update(id, validatedData);
      return res.status(200).json(service);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      if (error.message === 'Serviço não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await serviceService.delete(id);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Serviço não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}
