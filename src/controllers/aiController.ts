import { Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { suggestTimesSchema } from '../utils/validations';

const aiService = new AIService();

export class AIController {
  async suggestTimes(req: Request, res: Response) {
    try {
      const validatedData = suggestTimesSchema.parse(req.body);
      const suggestions = await aiService.suggestTimes(validatedData);
      return res.status(200).json(suggestions);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}
