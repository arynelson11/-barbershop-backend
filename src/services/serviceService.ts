import prisma from '../prisma/client';

export interface CreateServiceData {
  name: string;
  durationMinutes: number;
  priceCents: number;
  description?: string;
}

export interface UpdateServiceData {
  name?: string;
  durationMinutes?: number;
  priceCents?: number;
  description?: string;
}

export class ServiceService {
  async getAll() {
    return prisma.service.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreateServiceData) {
    return prisma.service.create({
      data,
    });
  }

  async update(id: string, data: UpdateServiceData) {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    return prisma.service.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    // Verificar se há agendamentos vinculados
    const appointmentsCount = await prisma.appointment.count({
      where: { serviceId: id },
    });

    if (appointmentsCount > 0) {
      throw new Error('Não é possível excluir um serviço com agendamentos vinculados');
    }

    await prisma.service.delete({
      where: { id },
    });

    return { message: 'Serviço excluído com sucesso' };
  }
}
