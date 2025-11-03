# Bohemian System (Sistema de E-commerce)

O **Bohemian System** é uma aplicação Full-Stack de e-commerce. O projeto é construído com um frontend moderno em React (utilizando Vite) e um backend robusto em Node.js com Express e MySQL.

A plataforma permite que clientes naveguem por produtos, gerenciem seus carrinhos e finalizem compras, enquanto administradores têm acesso a um painel completo para gerenciar produtos, pedidos e visualizar estatísticas de vendas.

## Funcionalidades Principais

### Para Clientes

  * **Autenticação de Usuário:** Cadastro, login e recuperação de senha.
  * **Catálogo de Produtos:** Navegação por produtos com filtros por categoria e barra de pesquisa.
  * **Carrinho de Compras:** Adicionar, remover e atualizar quantidades de produtos no carrinho.
  * **Lista de Desejos (Favoritos):** Salvar produtos para visualização futura.
  * **Checkout:** Processo de finalização de compra com gerenciamento de endereços.
  * **Integração de Pagamento:** Finalização de pedidos integrada com o MercadoPago.
  * **Painel do Cliente:** Visualização do histórico de pedidos e gerenciamento de dados pessoais e endereços.

### Para Administradores

  * **Dashboard:** Painel com KPIs (Key Performance Indicators) sobre vendas, total de pedidos, novos clientes e receita.
  * **Gráficos de Vendas:** Visualização de dados de vendas ao longo do tempo.
  * **Gerenciamento de Produtos (CRUD):** Criar, ler, atualizar e deletar produtos, incluindo upload de imagens (integrado ao Cloudinary).
  * **Gerenciamento de Pedidos:** Visualização e atualização do status de todos os pedidos realizados.
  * **Script de Seed:** Um script (`seed:admin`) está disponível para criar o primeiro usuário administrador no banco de dados.

## Tecnologias Utilizadas

Este projeto é dividido em duas partes principais: `frontend` e `backend`.

### Backend

  * **Node.js**
  * **Express**
  * **MySQL2** (Banco de Dados)
  * **JSON Web Token (JWT)** (Autenticação)
  * **Bcrypt** (Hashing de senhas)
  * **MercadoPago** (Processamento de pagamento)
  * **Cloudinary** (Armazenamento de imagens de produtos)
  * **Multer** (Upload de arquivos)
  * **Nodemailer** (Envio de e-mails para recuperação de senha)
  * **Nodemon** (Desenvolvimento)

### Frontend

  * **React**
  * **Vite** (Build tool)
  * **React Router DOM** (Roteamento)
  * **Axios** (Requisições HTTP)
  * **React Toastify** (Notificações)
  * **Chart.js / Recharts** (Gráficos do dashboard)
  * **React Icons**

-----

## Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:

  * [Node.js](https://nodejs.org/en/) (v18 ou superior)
  * [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
  * Um servidor de banco de dados **MySQL**.

Você também precisará de contas nos seguintes serviços:

  * **Cloudinary** (para upload de imagens)
  * **MercadoPago** (para processamento de pagamentos)

## Guia de Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1\. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/bohemian-system.git
cd bohemian-system
```

### 2\. Configurar o Backend

1.  Navegue até a pasta do backend e instale as dependências:

    ```bash
    cd backend
    npm install
    ```

2.  Crie um arquivo `.env` na raiz da pasta `/backend` baseado no exemplo abaixo:

    ```env
    # Configuração do Banco de Dados
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=sua_senha_mysql
    DB_NAME=bohemian_db

    # Configuração do Servidor
    PORT=3001
    JWT_SECRET=seu_segredo_jwt_super_secreto

    # API Keys (Cloudinary)
    CLOUDINARY_CLOUD_NAME=seu_cloud_name
    CLOUDINARY_API_KEY=sua_api_key
    CLOUDINARY_API_SECRET=seu_api_secret

    # API Keys (MercadoPago)
    MERCADOPAGO_ACCESS_TOKEN=seu_access_token

    # Configuração do Nodemailer (Ex: Gmail)
    EMAIL_USER=seu_email@gmail.com
    EMAIL_PASS=sua_senha_de_app_gmail
    ```

3.  **Configurar o Banco de Dados:**

      * Crie um banco de dados no MySQL com o nome definido em `DB_NAME`.
      * Importe o dump SQL `database/Dump20251014.sql` para o seu banco de dados.

4.  **Criar Usuário Administrador:**
    Execute o script de *seed* para criar o primeiro usuário administrador (os dados de login serão exibidos no console):

    ```bash
    npm run seed:admin
    ```

### 3\. Configurar o Frontend

1.  Em um novo terminal, navegue até a pasta do frontend e instale as dependências:

    ```bash
    cd frontend
    npm install
    ```

2.  Crie um arquivo `.env` na raiz da pasta `/frontend`:

    ```env
    # Define a URL base da API do backend
    VITE_API_URL=http://localhost:3001
    ```

### 4\. Executar o Projeto

Você precisará de dois terminais abertos para executar o frontend e o backend simultaneamente.

1.  **Terminal 1 (Backend):**

    ```bash
    cd backend
    npm run dev
    ```

    O servidor backend estará rodando em `http://localhost:3001`.

2.  **Terminal 2 (Frontend):**

    ```bash
    cd frontend
    npm run dev
    ```

    A aplicação React estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).
