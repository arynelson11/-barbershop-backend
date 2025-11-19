## 🚀 Guia Rápido: Deploy em 5 Minutos

Preparei tudo para você! Siga estes 3 passos simples para colocar sua API no ar.

---

### Passo 1: Crie um Repositório no GitHub

1.  Acesse o GitHub e crie um **novo repositório**:
    [https://github.com/new](https://github.com/new)

2.  Dê um nome para o seu repositório (ex: `barbershop-backend`).
3.  **Importante:** Deixe o repositório **Público** (Public) e **NÃO** adicione `README`, `.gitignore` ou licença. Ele precisa começar vazio.
4.  Clique em **Create repository**.

Na próxima página, o GitHub mostrará a URL do seu repositório. Copie essa URL. Será algo como:
`https://github.com/seu-usuario/barbershop-backend.git`

---

### Passo 2: Envie o Código para o GitHub

Agora, vamos enviar o projeto que eu preparei para o seu novo repositório.

1.  **Descompacte o projeto:** Baixe e descompacte o arquivo `barbershop-backend.zip` que eu te enviei.

2.  **Abra o terminal:**
    - No Windows: Abra o `Git Bash` ou `PowerShell`.
    - No Mac/Linux: Abra o `Terminal`.

3.  **Navegue até a pasta do projeto:**
    ```bash
    cd caminho/para/a/pasta/barbershop-backend
    ```
    (Substitua `caminho/para/a/pasta` pelo local onde você descompactou o projeto).

4.  **Copie e cole os comandos abaixo**, um de cada vez, substituindo `URL_DO_SEU_REPOSITORIO` pela URL que você copiou no passo anterior.

    ```bash
    # Conecta seu repositório local ao do GitHub
    git remote add origin URL_DO_SEU_REPOSITORIO

    # Renomeia a branch principal para 'main' (se necessário)
    git branch -M main

    # Envia o código para o GitHub
    git push -u origin main
    ```

Pronto! Seu código agora está no GitHub.

---

### Passo 3: Faça o Deploy no Render

Este é o passo mais fácil, pois eu já configurei tudo para você no arquivo `render.yaml`.

1.  **Acesse o Render:**
    [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)

2.  Clique em **New Blueprint**.

3.  **Conecte seu repositório:** Encontre e selecione o repositório `barbershop-backend` que você acabou de criar.

4.  **Aplique o Blueprint:** O Render lerá o arquivo `render.yaml` e mostrará os dois serviços que serão criados (o banco de dados e a API). Apenas clique em **Apply**.

É isso! O Render vai cuidar de todo o resto. Em alguns minutos, sua API estará no ar.

---

### Pós-Deploy: Ative sua API

1.  **Popule o banco:** Após o deploy terminar, vá para o serviço da sua API no Render, clique na aba **Shell** e execute o comando `npm run seed`.

2.  **Encontre sua URL:** Na página do serviço, no topo, você encontrará a URL pública da sua API (ex: `https://barbershop-api.onrender.com`).

**Sua API está pronta para ser usada!** Se tiver qualquer dúvida, me avise!**
dúvida, me avise.**
ise chame!** ame chame.**
