## 🚀 Guia de Deploy no Render.com

Este guia mostra como fazer o deploy do backend da barbearia no Render, uma plataforma de nuvem moderna com um plano gratuito generoso.

### Pré-requisitos

1.  **Conta no GitHub:** Seu código precisa estar em um repositório no GitHub.
2.  **Conta no Render:** Crie uma conta gratuita em [render.com](https://render.com).

---

### Método 1: Configuração Manual (Passo a Passo)

Este método é ótimo para entender o processo e como o Render funciona.

#### Passo 1: Criar o Banco de Dados PostgreSQL

1.  No seu [Dashboard do Render](https://dashboard.render.com), clique em **New +** e selecione **PostgreSQL**.
2.  Dê um nome para o seu banco (ex: `barbershop-db`).
3.  Verifique se o plano **Free** está selecionado.
4.  Clique em **Create Database**.

O Render levará alguns minutos para criar o banco. Ao final, você terá acesso às credenciais de conexão. Guarde o link da **Internal Connection String**, pois vamos usá-lo em breve.

#### Passo 2: Criar o Web Service (API)

1.  No Dashboard, clique em **New +** e selecione **Web Service**.
2.  Conecte seu repositório do GitHub onde o código está.
3.  Na tela de configuração, preencha os seguintes campos:

    - **Name:** Dê um nome para sua API (ex: `barbershop-api`).
    - **Region:** Escolha a região mais próxima de você (ex: `Oregon`).
    - **Branch:** `main` (ou a branch principal do seu projeto).
    - **Runtime:** `Node`.
    - **Build Command:** `./build.sh` (Usaremos o script que criei para você).
    - **Start Command:** `npm start`
    - **Instance Type:** `Free`

4.  Clique em **Advanced** para configurar as variáveis de ambiente.

5.  **Adicionar Variáveis de Ambiente:**

    - Clique em **Add Environment Variable**.
    - Adicione a primeira variável:
        - **Key:** `DATABASE_URL`
        - **Value:** Cole a **Internal Connection String** que você copiou do seu banco de dados PostgreSQL criado no passo 1.

    - Clique em **Add Environment Variable** novamente.
    - Adicione a segunda variável:
        - **Key:** `JWT_SECRET`
        - **Value:** Clique no botão **Generate** ao lado do campo de valor para que o Render crie um segredo seguro para você.

    - Adicione a terceira variável:
        - **Key:** `NODE_ENV`
        - **Value:** `production`

6.  Clique em **Create Web Service**.

O Render irá instalar as dependências, rodar o build, executar as migrations e iniciar seu servidor. Você pode acompanhar o progresso na aba **Events**.

---

### Método 2: Configuração Automática (Blueprint)

Este é o método mais rápido. Use o arquivo `render.yaml` que eu já adicionei ao projeto. Ele contém todas as configurações prontas.

1.  No [Dashboard do Render](https://dashboard.render.com), clique em **New +** e selecione **Blueprint**.
2.  Conecte o repositório do GitHub que contém o projeto.
3.  O Render irá ler o arquivo `render.yaml` e pré-configurar tudo para você: o banco de dados e o web service.
4.  Apenas confirme os nomes (se desejar) e clique em **Apply**.

Pronto! O Render irá criar os dois serviços e conectá-los automaticamente.

---

### Pós-Deploy: Passos Finais

#### 1. Popular o Banco de Dados (Seed)

Após o deploy, o banco de dados estará criado, mas vazio. Precisamos rodar o script `seed` para adicionar os barbeiros, serviços e clientes de exemplo.

1.  Vá para o seu **Web Service** no Render.
2.  Clique na aba **Shell**.
3.  Digite o comando abaixo e pressione Enter:

    ```bash
    npm run seed
    ```

4.  Aguarde o script finalizar. Ele irá imprimir no console as credenciais de teste.

#### 2. Encontrar a URL da sua API

Na página do seu Web Service no Render, no topo, você encontrará a URL pública da sua API (algo como `https://barbershop-api.onrender.com`).

Você pode testar se tudo está funcionando acessando a rota de health check:
`https://sua-api.onrender.com/health`

#### 3. Visualizar Logs

Na aba **Logs** do seu Web Service, você pode acompanhar em tempo real tudo o que acontece na sua aplicação, incluindo requisições e possíveis erros.

---

### Resumo dos Comandos no Render

- **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
  - Instala dependências, gera o cliente Prisma e aplica as migrations.
  - *Nota: O script `build.sh` que criei faz exatamente isso.*

- **Start Command:** `npm start`
  - Inicia o servidor em modo de produção.

- **Seed Command (via Shell):** `npm run seed`
  - Popula o banco de dados.

Se tiver qualquer dúvida durante o processo, pode me perguntar!
