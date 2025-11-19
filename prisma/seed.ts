import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional - remova se não quiser limpar)
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

  console.log('👤 Admin criado:', admin.email);

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

  console.log('💈 Barbeiros criados:', barber1.email, barber2.email, barber3.email);

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

  console.log('👥 Clientes criados:', client1.email, client2.email);

  // Criar serviços
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Corte Simples',
        durationMinutes: 30,
        priceCents: 3500, // R$ 35,00
        description: 'Corte de cabelo tradicional com máquina e tesoura',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Corte + Barba',
        durationMinutes: 45,
        priceCents: 5500, // R$ 55,00
        description: 'Corte de cabelo completo + barba aparada e finalizada',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Barba',
        durationMinutes: 20,
        priceCents: 2500, // R$ 25,00
        description: 'Aparar e finalizar barba com navalha',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Corte Premium',
        durationMinutes: 60,
        priceCents: 8000, // R$ 80,00
        description: 'Corte personalizado com lavagem, massagem e finalização premium',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Corte Infantil',
        durationMinutes: 25,
        priceCents: 3000, // R$ 30,00
        description: 'Corte especial para crianças até 12 anos',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Pigmentação de Barba',
        durationMinutes: 40,
        priceCents: 6000, // R$ 60,00
        description: 'Pigmentação profissional para disfarçar fios brancos',
      },
    }),
  ]);

  console.log(`✂️  ${services.length} serviços criados`);

  // Criar alguns agendamentos de exemplo
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const appointment1 = await prisma.appointment.create({
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

  const appointment2 = await prisma.appointment.create({
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

  console.log(`📅 ${2} agendamentos de exemplo criados`);

  console.log('\n✅ Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('   Admin: admin@barbershop.com / 123456');
  console.log('   Barbeiro 1: joao@barbershop.com / 123456');
  console.log('   Barbeiro 2: pedro@barbershop.com / 123456');
  console.log('   Barbeiro 3: carlos@barbershop.com / 123456');
  console.log('   Cliente 1: maria@example.com / 123456');
  console.log('   Cliente 2: lucas@example.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
