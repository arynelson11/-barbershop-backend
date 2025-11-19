import prisma from '../prisma/client';
import { AppointmentStatus } from '@prisma/client';

export interface CreateAppointmentData {
  clientId: string;
  barberId: string;
  serviceId: string;
  startAt: string;
}

export class AppointmentService {
  async getAppointments(barberId?: string, date?: string) {
    const where: any = {};

    if (barberId) {
      where.barberId = barberId;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.startAt = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    return prisma.appointment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        barber: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            durationMinutes: true,
            priceCents: true,
          },
        },
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  }

  async create(data: CreateAppointmentData) {
    // Buscar o serviço
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    // Verificar se o cliente existe
    const client = await prisma.user.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    // Verificar se o barbeiro existe e tem perfil de barbeiro
    const barber = await prisma.user.findUnique({
      where: { id: data.barberId },
      include: { barberProfile: true },
    });

    if (!barber || barber.role !== 'barber' || !barber.barberProfile) {
      throw new Error('Barbeiro não encontrado ou inválido');
    }

    // Calcular endAt
    const startAt = new Date(data.startAt);
    const endAt = new Date(startAt.getTime() + service.durationMinutes * 60000);

    // Validar conflito de horário
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        barberId: data.barberId,
        status: {
          in: ['scheduled', 'confirmed'],
        },
        OR: [
          {
            AND: [
              { startAt: { lte: startAt } },
              { endAt: { gt: startAt } },
            ],
          },
          {
            AND: [
              { startAt: { lt: endAt } },
              { endAt: { gte: endAt } },
            ],
          },
          {
            AND: [
              { startAt: { gte: startAt } },
              { endAt: { lte: endAt } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new Error('Já existe um agendamento neste horário para o barbeiro selecionado');
    }

    // Criar agendamento
    return prisma.appointment.create({
      data: {
        clientId: data.clientId,
        barberId: data.barberId,
        serviceId: data.serviceId,
        startAt,
        endAt,
        status: AppointmentStatus.scheduled,
        priceCents: service.priceCents,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        barber: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            durationMinutes: true,
            priceCents: true,
          },
        },
      },
    });
  }
}
