### Bohemian System - Nova Branch Carrinho

Este projeto é uma aplicação de e-commerce full-stack, com um backend em Node.js e um frontend em React. A aplicação gerencia produtos, categorias, carrinhos de compras e pedidos, além de um painel de administração para visualização de dados.

### Pré-requisitos

Para rodar este projeto, você precisará ter instalado em sua máquina:

  * **Node.js**: Certifique-se de que a versão 16.0.0 ou superior está instalada.
  * **MySQL**: O banco de dados utilizado é o MySQL.
  * **Git**: Para clonar o repositório.

### Passo a passo para rodar o projeto

Siga os passos abaixo para configurar e iniciar a aplicação.

#### 1\. Configuração do Banco de Dados

O projeto utiliza MySQL para o banco de dados. Você precisará criar um banco de dados e importar o esquema fornecido.

1.  Crie um banco de dados chamado `bohemian` no seu servidor MySQL.
2.  Importe o arquivo `database/banco_completo.sql` para o banco de dados `bohemian` que você criou. Este arquivo contém a estrutura completa do banco de dados e as views necessárias.

#### 2\. Configuração do Backend

O backend é construído com Node.js e Express.

1.  Navegue até o diretório `backend`:

    ```sh
    cd backend
    ```

2.  Instale as dependências do Node.js:

    ```sh
    npm install
    ```

3.  Crie um arquivo `.env` na raiz do diretório `backend`. Este arquivo conterá as variáveis de ambiente necessárias para a conexão com o banco de dados e outras configurações. O arquivo de configuração do banco de dados (`backend/config/db.js`) espera as seguintes variáveis:

    ```
    DB_HOST=localhost
    DB_USER=seu_usuario_mysql
    DB_PASSWORD=sua_senha_mysql
    DB_DATABASE=bohemian
    PORT=3000
    ```

    **Nota:** `PORT=3000` é a porta padrão, mas pode ser configurada para outra.

4.  Inicie o servidor backend em modo de desenvolvimento:

    ```sh
    npm run dev
    ```

    O servidor iniciará em `http://localhost:3000`. Para rodar em modo de produção, use `npm start`.

#### 3\. Configuração do Frontend

O frontend é construído com React e Vite.

1.  Navegue até o diretório `frontend`:
    ```sh
    cd ../frontend
    ```
2.  Instale as dependências do Node.js:
    ```sh
    npm install
    ```
3.  Inicie a aplicação frontend em modo de desenvolvimento:
    ```sh
    npm run dev
    ```
    O servidor de desenvolvimento do frontend será iniciado. Você pode acessá-lo no endereço que aparecerá no seu terminal.

#### 4\. Uso da Aplicação

Com ambos os servidores (backend e frontend) rodando, a aplicação estará totalmente funcional. Você pode interagir com o sistema, fazer login como administrador (se você rodou o script de seed), navegar pelo catálogo de produtos e utilizar as funcionalidades de carrinho de compras.
