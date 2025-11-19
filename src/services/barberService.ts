import prisma from '../prisma/client';

export class BarberService {
  async getAll() {
    return prisma.barber.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });
  }

  async getById(id: string) {
    const barber = await prisma.barber.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!barber) {
      throw new Error('Barbeiro não encontrado');
    }

    return barber;
  }
}
