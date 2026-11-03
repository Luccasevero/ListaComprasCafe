import express from 'express'
import pool from './database.js'
import path from 'path'

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000
app.use(express.static(path.join(import.meta.dirname, '../frontend')))

//gurada todos que estão conectados no site
const clientes = []

app.get('/eventos', (req, res) => {
    //res.setHeader: Informam ao navegador que a resposta não vai terminar agora.
    res.setHeader('Content-Type', 'text/event-stream') //Diz que o fluxo de dados será um fluxo contínuo de eventos (SSE)
    res.setHeader('Cache-Control', 'no-cache') //sem ser armazenada em cache por intermediários
    res.setHeader('Connection', 'keep-alive') //Garante que a conexão permaneça aberta e ativa
    res.flushHeaders()

    // 1. Envia um sinal inicial para forçar o navegador a abrir a conexão de vez
    res.write('data: conectado\n\n')

    clientes.push(res)

    //escuta quando o cliente sai ou perde conexão e limpa da lista
    req.on('close', () => {
        clientes.splice(clientes.indexOf(res), 1)
    })
})

//É a função responsável por disparar mensagens para todo mundo que está conectado
function avisarTodos() {
    clientes.forEach(cliente => cliente.write('data: atualizar\n\n'))
}

//imprimir tudo
app.get('/produtos', async (req, res) => {
    console.log('Rota /produtos foi chamada')
    try {
        const limpeza = await pool.query(`
            DELETE FROM produtos WHERE criado_em < (
            date_trunc('day', (NOW() AT TIME ZONE 'America/Sao_Paulo') - INTERVAL '4 hours') + INTERVAL '4 hours'
            ) AT TIME ZONE 'America/Sao_Paulo'  
            `)

        if (limpeza.rowCount > 0) {
            avisarTodos()
        }

        const resultado = await pool.query('SELECT * FROM produtos ORDER BY id')
        res.json(resultado.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Erro interno no servidor' })
    }
})

//adicionar produtos
app.post('/produtos', async (req, res) => {
    try {
        const { nome, quantidade, observacao } = req.body

        if (!nome) {
            return res.status(400).json({ erro: 'Nome do produto é obrigatório!' })
        }

        const resultado = await pool.query(
            'INSERT INTO produtos (nome, quantidade, observacao) VALUES ($1, $2, $3) RETURNING *',
            [nome, quantidade, observacao]
        )

        avisarTodos()
        return res.json(resultado.rows[0])

    } catch (error) {
        res.status(500).json({ erro: 'Erro interno no servidor' })
    }
})

app.delete('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params

        const resultado = await pool.query(
            'DELETE FROM produtos WHERE id = $1 RETURNING *',
            [id]
        )

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado.' })
        }

        avisarTodos()
        return res.json(resultado.rows[0])

    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Erro interno no servidor' })
    }
})

//editar produto
app.put('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nome, quantidade, observacao } = req.body

        if (!nome) {
            return res.status(400).json({ erro: 'Nome do produto é obrigatório' })
        }

        const resultado = await pool.query(
            'UPDATE produtos SET nome = $1, quantidade = $2, observacao = $3 WHERE id = $4 RETURNING *',
            [nome, quantidade, observacao, id]
        )

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' })
        }

        avisarTodos()
        return res.json(resultado.rows[0])


    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Erro interno no servidor' })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})