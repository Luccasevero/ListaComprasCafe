# Lista Café

> Shared restocking list, product count and inventory for a café, built with Node.js, Express, PostgreSQL and vanilla JavaScript.

Sistema web usado no café onde trabalho para organizar a reposição de produtos, a contagem de estoque e o inventário da lojinha. Substitui a lista no papel: a equipe adiciona os produtos que precisam ser comprados e todo mundo vê a mesma lista, atualizada na hora.

O projeto tem três páginas: **Reposição**, **Contagem** e **Inventário**.

## Funcionalidades

### Reposição (`index.html`)

* Adicionar, editar e remover produtos (nome, quantidade e observação)
* Atualização em tempo real para todos que estiverem com o site aberto
* Limpeza automática diária: no primeiro acesso depois das 4h (horário de São Paulo), os itens criados antes desse corte são apagados
* Envio da lista pelo WhatsApp (apenas os nomes dos produtos)
* Botões bloqueados durante o envio, para não duplicar itens

### Contagem (`contagem.html`)

* Produtos organizados em grupos (Tung, Pão e Outros), com campos que começam em 0 e aceitam vírgula
* Na segunda-feira a contagem é completa; nos outros dias, apenas Tung e Pão
* Não usa o banco de dados: a mensagem é montada no navegador e enviada direto pelo WhatsApp

### Inventário (`inventario.html`)

* Contagem dos itens da lojinha do café, em três grupos: Grãos, Amendoccinos e Copos
* Mesmo esquema da contagem (campos que começam em 0 e aceitam vírgula), mas com todos os grupos sempre visíveis, sem regra por dia da semana
* Também não usa o banco de dados: a mensagem é montada no navegador e enviada direto pelo WhatsApp

## Tecnologias

* Node.js e Express
* PostgreSQL (Neon)
* HTML, CSS e JavaScript puro, sem frameworks
* Server-Sent Events (SSE) para as atualizações em tempo real

## Estrutura

```
backend/
  index.js       rotas da API, SSE e limpeza diária
  database.js    conexão com o banco e criação da tabela
frontend/
  index.html       página de reposição (app.js)
  contagem.html    página de contagem (contagem.js)
  inventario.html  página de inventário (inventario.js)
  style.css        estilo compartilhado
  contagem.css     estilo das páginas de contagem e inventário
```

## Rotas da API

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/produtos` | Lista os produtos |
| POST | `/produtos` | Adiciona um produto |
| PUT | `/produtos/:id` | Edita um produto |
| DELETE | `/produtos/:id` | Remove um produto |
| GET | `/eventos` | Canal SSE: avisa os navegadores quando a lista muda |

## Como rodar

1. Entre na pasta `backend` e instale as dependências: `npm install`
2. Crie um arquivo `.env` com a connection string do banco: `DATABASE_URL=...`
3. Inicie o servidor: `npm start`. A tabela `produtos` é criada automaticamente na primeira execução
4. Abra `http://localhost:3000` (reposição), `http://localhost:3000/contagem.html` (contagem) ou `http://localhost:3000/inventario.html` (inventário)

Requer Node 20.11 ou mais novo.

## Limitações conhecidas

* Não há login: quem tiver o link do site consegue editar a lista
* A contagem e o inventário não guardam histórico: se a página for recarregada, os números digitados são perdidos

<!--
Quando tiver as imagens, coloque-as numa pasta "imagens" e apague esta linha e a última para mostrar a seção:

## Capturas de tela

![Lista de reposição](imagens/reposicao.png)
![Contagem](imagens/contagem.png)
-->
