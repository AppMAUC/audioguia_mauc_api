
---

# 🎨 App Mauc API

Esta é uma API RESTful desenvolvida em Node.js com Express e MongoDB, projetada para gerenciar obras de arte, exposições e artistas com um foco em acessibilidade, incluindo descrições em áudio em diferentes idiomas. A API foi planejada para um ambiente modular e escalável, incluindo funcionalidades de autenticação, pesquisa, manipulação de uploads, e acesso seguro aos dados. O desenvolvimento dessa API faz parte do projeto Aplicativo MAUC: para uma arte mais acessível.

## 📋 Índice
- [Recursos](#-recursos)
- [Tecnologias](#-tecnologias)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Instalação](#-instalação)
- [Estrutura de Pastas](#️-estrutura-de-pastas)
- [Endpoints Principais](#-endpoints-principais)
- [Upload de Arquivos](#-upload-de-arquivos)
- [Paginação e Filtros](#-paginação-e-filtros)
- [Autenticação e Segurança](#-autenticação-e-segurança)
- [Testes](#-testes)
- [Contribuição](#-contribuição)

## 📚 Recursos

A API permite gerenciar as seguintes entidades:
1. **Obras de Arte (ArtWorks):** Cadastro, edição, visualização e exclusão de obras.
2. **Áudios de Descrição:** Suporte a múltiplas línguas para áudio-descrições e guias de cada obra.
3. **Autores e Exposições:** Relacionamento entre autores e suas obras, exposições e a lista de obras que fazem parte.
4. **Busca Geral e Específica:** Implementação de buscas por relevância para encontrar obras e outros recursos com facilidade.
5. **Paginação e Ordenação:** Controle e navegação sobre os dados retornados.

## 🛠️ Tecnologias

- **Node.js** e **Express:** Para criar e gerenciar as rotas e middleware.
- **MongoDB** com Mongoose: Banco de dados NoSQL para armazenar informações das obras e de outras entidades relacionadas.
- **Multer:** Para o gerenciamento e upload de arquivos de imagem e áudio.
- **Firebase:** Utilizado para o armazenamento de arquivos na nuvem.
- **Postman:** Documentação e testes das rotas da API.

## ⚙️ Configuração do Ambiente

O projeto utiliza variáveis de ambiente para configurar diferentes aspectos da API, armazenadas no arquivo `.env`. Abaixo estão as variáveis essenciais:

### Variáveis Principais

```plaintext
NODE_ENV=               # Ambiente de execução (ex: development, production)
SERVER_URL=             # URL do servidor backend
CLIENT_URL=             # URL do frontend
PORT=                   # Porta em que o servidor será executado
DB_USER=                # Usuário do banco de dados MongoDB
DB_PASS=                # Senha do banco de dados MongoDB
DB_NAME=                # Nome do banco de dados MongoDB
STORAGE_TYPE=           # Tipo de armazenamento (local ou firebase)
ACCESS_TOKEN_SECRET=    # Segredo para geração do token de acesso JWT
REFRESH_TOKEN_SECRET=   # Segredo para geração do token de atualização JWT
```

### Configuração do Armazenamento

A API suporta dois tipos de armazenamento para arquivos: **local** e **firebase**. 

- **Armazenamento Local**: Os arquivos são armazenados na pasta `tmp/uploads` do servidor. Para esta opção, basta definir `STORAGE_TYPE=local`.
- **Armazenamento Firebase**: Requer a configuração de variáveis adicionais para integração com o Firebase. Defina `STORAGE_TYPE=firebase` e preencha as seguintes variáveis de ambiente:

```plaintext
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
FIREBASE_UNIVERSE_DOMAIN=
```

> **Nota**: As variáveis relacionadas ao Firebase são necessárias apenas se você optar por esse tipo de armazenamento. Caso utilize o armazenamento local, não é preciso preencher essas credenciais.

### Exemplo de Arquivo `.env`

```plaintext
NODE_ENV=development
SERVER_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
PORT=3000
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=nome_do_banco
STORAGE_TYPE=local
ACCESS_TOKEN_SECRET=sua_chave_de_acesso
REFRESH_TOKEN_SECRET=sua_chave_de_atualizacao
```

### Configuração com Vercel e GitHub
A API está configurada para deploy automático com o Vercel. No GitHub:
- Use o branch `main` para a produção e outro para desenvolvimento.
- Certifique-se de definir as variáveis de ambiente no Vercel para o ambiente de produção.

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/appmauc/audioguia_mauc_api.git
   cd audioguia_mauc_api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o `.env` com as variáveis de ambiente.

4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse em [http://localhost:3000](http://localhost:3000).

## 🗂️ Estrutura de Pastas

A estrutura de pastas do projeto segue uma organização modular para facilitar a manutenção e escalabilidade. Abaixo está uma descrição das pastas principais:

```
📦 Projeto
├── src/                      # Código-fonte principal da aplicação
│   ├── config/               # Configurações de libs
│   ├── controllers/          # Controladores para gerenciar a lógica de cada rota
│   ├── middlewares/          # Middlewares para autenticação, validação, etc.
│   ├── models/               # Modelos Mongoose (schemas do MongoDB)
│   ├── routes/               # Definições das rotas da API
│   ├── utils/                # Utilitários gerais (ex: funções auxiliares)
│   └── validations/          # Arquivos de validação para entradas e dados
├── tmp/                      # Diretório temporário para uploads de arquivos
│   ├── uploads/              # Armazena os arquivos de upload
│   │   ├── audios/           # Subpastas específicas para áudios
│   │   └── images/           # Subpastas específicas para imagens
│   │       ├── admin/        # Imagens relacionadas ao administrador
│   │       ├── artists/      # Imagens dos artistas
│   │       ├── artworks/     # Imagens das obras de arte
│   │       ├── events/       # Imagens relacionadas a eventos
│   │       └── expositions/  # Imagens de exposições
├── index.js                  # Arquivo de entrada da aplicação
├── .env                      # Variáveis de ambiente
├── .gitignore                # Arquivo para ignorar arquivos e pastas no Git
├── package.json              # Configurações de scripts e dependências
├── package-lock.json         # Lockfile para dependências instaladas
└── vercel.json               # Configuração de deploy no Vercel
```

### Descrição das Pastas

- **src/config**: Arquivos de configuração e inicialização de serviços.
- **src/controllers**: Contém a lógica de cada endpoint (ex: criação, atualização, exclusão).
- **src/middlewares**: Middlewares usados em rotas, como autenticação e validação de dados.
- **src/models**: Define os modelos Mongoose que representam as entidades no MongoDB.
- **src/routes**: Organiza as rotas da API, agrupando endpoints por entidade.
- **src/utils**: Funções utilitárias e helpers reutilizáveis em diferentes partes do código.
- **src/validations**: Validações de dados de entrada utilizando bibliotecas como `express-validator`.
- **tmp/uploads**: Diretório para arquivos enviados, organizado em subpastas para separar áudios e imagens conforme a entidade ou tipo.

## 🔗 Endpoints Principais

### 1. **Obras de Arte**
   - `GET /api/artworks`: Retorna uma lista de todas as obras, com suporte a paginação.
   - `POST /api/artworks`: Cria uma nova obra.
   - `PUT /api/artworks/:id`: Atualiza uma obra existente.
   - `DELETE /api/artworks/:id`: Exclui uma obra.

### 2. **Artistas**
   - `GET /api/artists`: Retorna uma lista de todos os autores.
   - `POST /api/artists`: Cria um novo autor.
   - `PUT /api/artists/:id`: Atualiza um autor existente.
   - `DELETE /api/artists/:id`: Exclui um autor.

### 3. **Exposições**
   - `GET /api/expositions`: Retorna uma lista de todas as exposições.
   - `POST /api/expositions`: Cria uma nova exposição.
   - `PUT /api/expositions/:id`: Atualiza uma exposição existente.
   - `DELETE /api/expositions/:id`: Exclui uma exposição.

> **Nota:** Consulte a documentação no Postman para obter um detalhamento mais específico e exemplos de requisições.
> [Documentação](https://documenter.getpostman.com/view/32475493/2sAY4uDP4t)

## 🖼️ Upload de Arquivos

A API suporta upload de arquivos de áudio e imagem com **Multer**:
- **Áudios:** Organizamos em subpastas específicas conforme o idioma (`br` ou `en`) e o tipo (`desc` ou `guia`).
- **Imagens:** Salvas com um nome único gerado automaticamente.
> Cada upload é feito conforme as necessidades de cada entidade.

### Regras de Validação
- Somente tipos de arquivo específicos são aceitos (configurados em `fileValidation`).

## 📑 Paginação e Filtros

Todos os endpoints que retornam listas de dados aceitam:
- **Paginação** (`page`, `limit`)

### Exemplo de Resposta de Paginação
```json
{
  "first": 1,
  "prev": 0,
  "next": 2,
  "last": 10,
  "pages": 10,
  "items": 100,
  "data": [/* dados */]
}
```

## 🔒 Autenticação e Segurança

A API utiliza **JWT (JSON Web Token)** para autenticação. Implementamos:
1. **Tokens de Acesso e Refresh:** A sessão é controlada com tokens de acesso de curta duração e tokens de atualização.
2. **Proteção de Rotas**: Rotas que manipulam dados sensíveis são protegidas com middlewares de autenticação e autorização.
3. **Express Validator**: Para garantir a validade dos dados recebidos.

## 🧪 Testes

1. **Testes no Postman:** Utilize a documentação no Postman para realizar testes com diferentes cenários de requisições.


## 🤝 Colaboradores

### Contribuidores Principais
- [**Victor Emanuel**](https://github.com/victor280504) - Desenvolvedor Principal
- [**Mateus de Aquino**](https://github.com/mateusaquinomr) - Desenvolvedor Colaborador
  
## 🫂 Contribuição

Sinta-se à vontade para contribuir:
1. Faça um fork do repositório.
2. Crie um branch para sua feature:
   ```bash
   git checkout -b feature/nome-da-feature
   ```
3. Faça um commit das suas alterações:
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
   ```
4. Envie para o branch principal:
   ```bash
   git push origin feature/nome-da-feature
   ```
5. Abra um Pull Request.

---
