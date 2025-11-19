import { z } from 'zod';

// Auth validations
export const signupSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'barber', 'client']),
  phone: z.string().optional(),
  bio: z.string().optional(),
  color: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Service validations
export const createServiceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  durationMinutes: z.number().int().positive('Duração deve ser positiva'),
  priceCents: z.number().int().positive('Preço deve ser positivo'),
  description: z.string().optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  durationMinutes: z.number().int().positive().optional(),
  priceCents: z.number().int().positive().optional(),
  description: z.string().optional(),
});

// Appointment validations
export const createAppointmentSchema = z.object({
  clientId: z.string().uuid('ID do cliente inválido'),
  barberId: z.string().uuid('ID do barbeiro inválido'),
  serviceId: z.string().uuid('ID do serviço inválido'),
  startAt: z.string().datetime('Data/hora inválida'),
});

export const suggestTimesSchema = z.object({
  barberId: z.string().uuid('ID do barbeiro inválido'),
  serviceId: z.string().uuid('ID do serviço inválido'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
});
