# Meu Blog

Blog pessoal desenvolvido com Next.js 16, TypeScript e Tailwind CSS. Conta com área administrativa protegida para gerenciamento de posts.

## Tecnologias

- **Next.js 16** — App Router, Server Components, Server Actions
- **TypeScript** — tipagem estática
- **Tailwind CSS v4** — estilização
- **Drizzle ORM** — acesso ao banco de dados
- **SQLite** — banco de dados local
- **NextAuth v5** — autenticação
- **Vitest** — testes unitários

## Funcionalidades

- Listagem de posts com post em destaque
- Página individual de cada post
- Dark mode automático (segue o sistema operacional)
- Open Graph para compartilhamento em redes sociais
- Sitemap para indexação no Google
- Botões de compartilhamento (WhatsApp, Twitter, copiar link)
- Área administrativa com autenticação
- CRUD completo de posts (criar, editar, deletar, publicar/despublicar)
- Testes unitários

## Como rodar localmente

**1. Clone o repositório**
```bash
git clone https://github.com/GustavoPimentelSouza/Blog.git
cd Blog
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:
```env
AUTH_SECRET=sua_chave_secreta_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3001
ADMIN_EMAIL=seu_email@exemplo.com
ADMIN_PASSWORD=sua_senha
```

Para gerar o `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

**4. Crie o banco de dados**
```bash
npx drizzle-kit migrate
```

**5. Popule o banco com os posts iniciais**
```bash
npm run db:seed
```

**6. Crie o usuário administrador**
```bash
npm run db:seed-admin
```

**7. Inicie o servidor**
```bash
npm run dev
```

Acesse [http://localhost:3001](http://localhost:3001)

A área administrativa fica em [http://localhost:3001/admin/login](http://localhost:3001/admin/login)

## Testes

```bash
npm test
```

## Estrutura do projeto

```
src/
  actions/        # Server Actions
  components/     # Componentes React
  db/             # Configuração do banco, migrations e seeds
  lib/            # Auth e queries
  models/         # Tipos e modelos
  repositories/   # Camada de acesso a dados
  tests/          # Testes unitários
  utils/          # Funções utilitárias
app/
  admin/          # Área administrativa
  post/           # Páginas de posts
  sobre/          # Página sobre
```
