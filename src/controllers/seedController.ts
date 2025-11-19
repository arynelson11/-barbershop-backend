import { Request, Response } from 'express';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';

export const runSeed = async (req: Request, res: Response ) => {
  try {
    console.log('🌱 Iniciando seed do banco de dados via HTTP...');

    // Limpar dados existentes
    await prisma.appointment.deleteMany();
    await prisma.barber.deleteMany();
    await prisma.service.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Dados antigos removidos');

    // Hash padrão para senhas de teste
    const passwordHash = await bcrypt.hash('123456', 10);

    // Criar admin
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@barbershop.com',
        passwordHash,
        role: 'admin',
        phone: '(11) 99999-0000',
      },
    });

    // Criar barbeiros
    const barber1 = await prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@barbershop.com',
        passwordHash,
        role: 'barber',
        phone: '(11) 99999-1111',
        barberProfile: {
          create: {
            bio: 'Especialista em cortes clássicos e modernos. 10 anos de experiência.',
            color: '#FF6B6B',
          },
        },
      },
    });

    const barber2 = await prisma.user.create({
      data: {
        name: 'Pedro Santos',
        email: 'pedro@barbershop.com',
        passwordHash,
        role: 'barber',
        phone: '(11) 99999-2222',
        barberProfile: {
          create: {
            bio: 'Expert em barbas e degradês. Atendimento personalizado.',
            color: '#4ECDC4',
          },
        },
      },
    });

    const barber3 = await prisma.user.create({
      data: {
        name: 'Carlos Oliveira',
        email: 'carlos@barbershop.com',
        passwordHash,
        role: 'barber',
        phone: '(11) 99999-3333',
        barberProfile: {
          create: {
            bio: 'Especializado em cortes infantis e estilos contemporâneos.',
            color: '#95E1D3',
          },
        },
      },
    });

    // Criar clientes de exemplo
    const client1 = await prisma.user.create({
      data: {
        name: 'Maria Oliveira',
        email: 'maria@example.com',
        passwordHash,
        role: 'client',
        phone: '(11) 98888-1111',
      },
    });

    const client2 = await prisma.user.create({
      data: {
        name: 'Lucas Ferreira',
        email: 'lucas@example.com',
        passwordHash,
        role: 'client',
        phone: '(11) 98888-2222',
      },
    });

    // Criar serviços
    const services = await Promise.all([
      prisma.service.create({
        data: {
          name: 'Corte Simples',
          durationMinutes: 30,
          priceCents: 3500,
          description: 'Corte de cabelo tradicional com máquina e tesoura',
        },
      }),
      prisma.service.create({
        data: {
          name: 'Corte + Barba',
          durationMinutes: 45,
          priceCents: 5500,
          description: 'Corte de cabelo completo + barba aparada e finalizada',
        },
      }),
      prisma.service.create({
        data: {
          name: 'Barba',
          durationMinutes: 20,
          priceCents: 2500,
          description: 'Aparar e finalizar barba com navalha',
        },
      }),
      prisma.service.create({
        data: {
          name: 'Corte Premium',
          durationMinutes: 60,
          priceCents: 8000,
          description: 'Corte personalizado com lavagem, massagem e finalização premium',
        },
      }),
      prisma.service.create({
        data: {
          name: 'Corte Infantil',
          durationMinutes: 25,
          priceCents: 3000,
          description: 'Corte especial para crianças até 12 anos',
        },
      }),
      prisma.service.create({
        data: {
          name: 'Pigmentação de Barba',
          durationMinutes: 40,
          priceCents: 6000,
          description: 'Pigmentação profissional para disfarçar fios brancos',
        },
      }),
    ]);

    // Criar alguns agendamentos de exemplo
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    await prisma.appointment.create({
      data: {
        clientId: client1.id,
        barberId: barber1.id,
        serviceId: services[0].id,
        startAt: tomorrow,
        endAt: new Date(tomorrow.getTime() + services[0].durationMinutes * 60000),
        status: 'scheduled',
        priceCents: services[0].priceCents,
      },
    });

    const afternoon = new Date(tomorrow);
    afternoon.setHours(14, 30, 0, 0);

    await prisma.appointment.create({
      data: {
        clientId: client2.id,
        barberId: barber2.id,
        serviceId: services[1].id,
        startAt: afternoon,
        endAt: new Date(afternoon.getTime() + services[1].durationMinutes * 60000),
        status: 'confirmed',
        priceCents: services[1].priceCents,
      },
    });

    res.status(200).json({
      success: true,
      message: '✅ Seed concluído com sucesso!',
      data: {
        users: {
          admin: 1,
          barbers: 3,
          clients: 2,
        },
        services: services.length,
        appointments: 2,
        credentials: {
          admin: { email: 'admin@barbershop.com', password: '123456' },
          barbers: [
            { email: 'joao@barbershop.com', password: '123456' },
            { email: 'pedro@barbershop.com', password: '123456' },
            { email: 'carlos@barbershop.com', password: '123456' },
          ],
          clients: [
            { email: 'maria@example.com', password: '123456' },
            { email: 'lucas@example.com', password: '123456' },
          ],
        },
      },
    });
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao popular banco de dados',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
};
