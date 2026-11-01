# Lista Café

Lista de reposição compartilhada para o café. Substitui a lista no papel: a equipe adiciona os produtos que precisam ser comprados e todo mundo vê a mesma lista, atualizada na hora.

## Funcionalidades

- Adicionar, editar e remover produtos (nome, quantidade e observação)
- Atualização em tempo real para todos que estiverem com o site aberto
- Envio da lista pelo WhatsApp

## Tecnologias

- Node.js e Express
- PostgreSQL (Neon)
- HTML, CSS e JavaScript puro
- Server-Sent Events (SSE) para as atualizações em tempo real

## Como rodar

1. Entre na pasta `backend` e instale as dependências: `npm install`
2. Crie um arquivo `.env` com a connection string do banco: `DATABASE_URL=...`
3. Inicie o servidor: `npm start`
4. Abra `http://localhost:3000`

Requer Node 20.11 ou mais novo.