# 💈 Barbershop Backend - Micro SaaS

Backend completo para sistema de gerenciamento de barbearia desenvolvido com Node.js, Express, TypeScript, Prisma ORM e PostgreSQL.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset JavaScript com tipagem estática
- **Prisma ORM** - ORM moderno para Node.js
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via JSON Web Tokens
- **bcrypt** - Hash de senhas
- **Zod** - Validação de schemas

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado e rodando
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório (ou use os arquivos fornecidos)

```bash
cd barbershop-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/barbershop?schema=public"
JWT_SECRET="seu-secret-super-seguro-aqui-mude-em-producao"
PORT=3000
NODE_ENV=development
```

### 4. Execute as migrations do Prisma

```bash
npm run migrate
```

### 5. Popule o banco de dados com dados iniciais

```bash
npm run seed
```

### 6. Inicie o servidor

**Modo desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
barbershop-backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.ts                # Script de seed
├── src/
│   ├── controllers/           # Controllers da aplicação
│   │   ├── authController.ts
│   │   ├── serviceController.ts
│   │   ├── barberController.ts
│   │   ├── appointmentController.ts
│   │   └── aiController.ts
│   ├── services/              # Lógica de negócio
│   │   ├── authService.ts
│   │   ├── serviceService.ts
│   │   ├── barberService.ts
│   │   ├── appointmentService.ts
│   │   └── aiService.ts
│   ├── routes/                # Definição de rotas
│   │   ├── authRoutes.ts
│   │   ├── serviceRoutes.ts
│   │   ├── barberRoutes.ts
│   │   ├── appointmentRoutes.ts
│   │   └── aiRoutes.ts
│   ├── middlewares/           # Middlewares customizados
│   │   └── auth.ts
│   ├── utils/                 # Utilitários
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── validations.ts
│   ├── prisma/                # Cliente Prisma
│   │   └── client.ts
│   └── server.ts              # Arquivo principal do servidor
├── .env.example               # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer {seu-token-jwt}
```

## 📡 Endpoints da API

### **Autenticação** (`/api/auth`)

#### POST `/api/auth/signup`
Cadastrar novo usuário

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "client",
  "phone": "(11) 99999-9999",
  "bio": "Especialista em cortes clássicos",
  "color": "#FF6B6B"
}
```

**Roles disponíveis:** `admin`, `barber`, `client`

**Nota:** Os campos `bio` e `color` são opcionais e só são utilizados quando `role` é `barber`.

#### POST `/api/auth/login`
Fazer login

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "client",
    "phone": "(11) 99999-9999"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/me`
Obter dados do usuário autenticado

**Headers:** `Authorization: Bearer {token}`

---

### **Serviços** (`/api/services`)

#### GET `/api/services`
Listar todos os serviços (público)

#### POST `/api/services`
Criar novo serviço (apenas admin)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "name": "Corte Simples",
  "durationMinutes": 30,
  "priceCents": 3500,
  "description": "Corte de cabelo tradicional"
}
```

#### PUT `/api/services/:id`
Atualizar serviço (apenas admin)

**Headers:** `Authorization: Bearer {token}`

**Body:** (todos os campos são opcionais)
```json
{
  "name": "Corte Premium",
  "durationMinutes": 45,
  "priceCents": 5000,
  "description": "Corte premium com finalização"
}
```

#### DELETE `/api/services/:id`
Excluir serviço (apenas admin)

**Headers:** `Authorization: Bearer {token}`

---

### **Barbeiros** (`/api/barbers`)

#### GET `/api/barbers`
Listar todos os barbeiros (público)

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "bio": "Especialista em cortes clássicos",
    "color": "#FF6B6B",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@barbershop.com",
      "phone": "(11) 99999-1111"
    }
  }
]
```

#### GET `/api/barbers/:id`
Obter detalhes de um barbeiro específico (público)

---

### **Agendamentos** (`/api/appointments`)

#### GET `/api/appointments?barberId={id}&date={YYYY-MM-DD}`
Listar agendamentos (autenticado)

**Headers:** `Authorization: Bearer {token}`

**Query params (opcionais):**
- `barberId`: Filtrar por barbeiro
- `date`: Filtrar por data (formato: YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "uuid",
    "startAt": "2024-01-15T10:00:00.000Z",
    "endAt": "2024-01-15T10:30:00.000Z",
    "status": "scheduled",
    "priceCents": 3500,
    "client": {
      "id": "uuid",
      "name": "Maria Oliveira",
      "email": "maria@example.com",
      "phone": "(11) 98888-1111"
    },
    "barber": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@barbershop.com"
    },
    "service": {
      "id": "uuid",
      "name": "Corte Simples",
      "durationMinutes": 30,
      "priceCents": 3500
    }
  }
]
```

#### POST `/api/appointments`
Criar novo agendamento (autenticado)

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "clientId": "uuid-do-cliente",
  "barberId": "uuid-do-barbeiro",
  "serviceId": "uuid-do-servico",
  "startAt": "2024-01-15T10:00:00.000Z"
}
```

**Validações automáticas:**
- Verifica se o serviço existe e busca duração + preço
- Calcula automaticamente o `endAt` baseado na duração
- Valida conflitos de horário para o barbeiro
- Status inicial é sempre `scheduled`

---

### **IA - Sugestão de Horários** (`/api/ai`)

#### POST `/api/ai/suggest-times`
Sugerir horários disponíveis (público)

**Body:**
```json
{
  "barberId": "uuid-do-barbeiro",
  "serviceId": "uuid-do-servico",
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "barberId": "uuid",
  "barberName": "João Silva",
  "serviceId": "uuid",
  "serviceName": "Corte Simples",
  "serviceDuration": 30,
  "date": "2024-01-15",
  "availableSlots": [
    {
      "startAt": "2024-01-15T09:00:00.000Z",
      "endAt": "2024-01-15T09:30:00.000Z"
    },
    {
      "startAt": "2024-01-15T09:15:00.000Z",
      "endAt": "2024-01-15T09:45:00.000Z"
    }
  ],
  "totalAvailable": 24
}
```

**Lógica:**
- Horário de funcionamento: 9h às 18h
- Intervalos de 15 minutos
- Verifica conflitos com agendamentos existentes
- Não utiliza OpenAI, apenas lógica local

---

## 👥 Credenciais de Teste (após seed)

```
Admin:
- Email: admin@barbershop.com
- Senha: 123456

Barbeiros:
- Email: joao@barbershop.com / Senha: 123456
- Email: pedro@barbershop.com / Senha: 123456
- Email: carlos@barbershop.com / Senha: 123456

Clientes:
- Email: maria@example.com / Senha: 123456
- Email: lucas@example.com / Senha: 123456
```

## 🗄️ Banco de Dados

### Models

- **User**: Usuários do sistema (admin, barber, client)
- **Barber**: Perfil de barbeiro (vinculado a User)
- **Service**: Serviços oferecidos
- **Appointment**: Agendamentos

### Enums

- **Role**: `admin`, `barber`, `client`
- **AppointmentStatus**: `scheduled`, `confirmed`, `completed`, `cancelled`

## 🛠️ Scripts Disponíveis

```bash
npm run dev       # Inicia servidor em modo desenvolvimento
npm run build     # Compila TypeScript para JavaScript
npm start         # Inicia servidor em modo produção
npm run migrate   # Executa migrations do Prisma
npm run seed      # Popula banco com dados iniciais
npm run studio    # Abre Prisma Studio (interface visual do banco)
```

## 🔒 Segurança

- Senhas são armazenadas com hash bcrypt (10 rounds)
- Tokens JWT expiram em 7 dias
- Validação de dados com Zod em todas as rotas
- Middleware de autenticação e autorização por role

## 📝 Observações

- O sistema valida automaticamente conflitos de horário ao criar agendamentos
- Serviços não podem ser excluídos se houver agendamentos vinculados
- A sugestão de horários considera apenas agendamentos com status `scheduled` ou `confirmed`
- Todos os preços são armazenados em centavos (ex: R$ 35,00 = 3500)

## 🤝 Contribuindo

Este é um projeto de demonstração. Sinta-se livre para adaptá-lo às suas necessidades.

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para a comunidade de desenvolvedores**
