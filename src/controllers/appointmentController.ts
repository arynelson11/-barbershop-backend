import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService';
import { createAppointmentSchema } from '../utils/validations';

const appointmentService = new AppointmentService();

export class AppointmentController {
  async getAppointments(req: Request, res: Response) {
    try {
      const { barberId, date } = req.query;
      const appointments = await appointmentService.getAppointments(
        barberId as string | undefined,
        date as string | undefined
      );
      return res.status(200).json(appointments);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validatedData = createAppointmentSchema.parse(req.body);
      const appointment = await appointmentService.create(validatedData);
      return res.status(201).json(appointment);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}
