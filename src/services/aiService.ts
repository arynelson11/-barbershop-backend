import prisma from '../prisma/client';

export interface SuggestTimesData {
  barberId: string;
  serviceId: string;
  date: string;
}

export class AIService {
  async suggestTimes(data: SuggestTimesData) {
    // Buscar o serviço para obter a duração
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    // Verificar se o barbeiro existe
    const barber = await prisma.user.findUnique({
      where: { id: data.barberId },
      include: { barberProfile: true },
    });

    if (!barber || barber.role !== 'barber' || !barber.barberProfile) {
      throw new Error('Barbeiro não encontrado ou inválido');
    }

    // Buscar agendamentos do barbeiro na data especificada
    const startOfDay = new Date(data.date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(data.date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        barberId: data.barberId,
        startAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['scheduled', 'confirmed'],
        },
      },
      orderBy: {
        startAt: 'asc',
      },
    });

    // Definir horário de funcionamento (9h às 18h)
    const workStartHour = 9;
    const workEndHour = 18;

    // Gerar todos os horários possíveis em intervalos de 15 minutos
    const allTimeSlots: Date[] = [];
    const targetDate = new Date(data.date);
    
    for (let hour = workStartHour; hour < workEndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const slot = new Date(targetDate);
        slot.setHours(hour, minute, 0, 0);
        
        // Verificar se o slot + duração do serviço não ultrapassa o horário de fechamento
        const slotEnd = new Date(slot.getTime() + service.durationMinutes * 60000);
        const workEnd = new Date(targetDate);
        workEnd.setHours(workEndHour, 0, 0, 0);
        
        if (slotEnd <= workEnd) {
          allTimeSlots.push(slot);
        }
      }
    }

    // Filtrar horários disponíveis (sem conflito)
    const availableSlots = allTimeSlots.filter(slot => {
      const slotEnd = new Date(slot.getTime() + service.durationMinutes * 60000);
      
      // Verificar se há conflito com algum agendamento existente
      const hasConflict = appointments.some(appointment => {
        const appointmentStart = new Date(appointment.startAt);
        const appointmentEnd = new Date(appointment.endAt);
        
        // Verificar sobreposição
        return (
          (slot >= appointmentStart && slot < appointmentEnd) ||
          (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
          (slot <= appointmentStart && slotEnd >= appointmentEnd)
        );
      });
      
      return !hasConflict;
    });

    // Formatar resultado
    return {
      barberId: data.barberId,
      barberName: barber.name,
      serviceId: data.serviceId,
      serviceName: service.name,
      serviceDuration: service.durationMinutes,
      date: data.date,
      availableSlots: availableSlots.map(slot => ({
        startAt: slot.toISOString(),
        endAt: new Date(slot.getTime() + service.durationMinutes * 60000).toISOString(),
      })),
      totalAvailable: availableSlots.length,
    };
  }
}
