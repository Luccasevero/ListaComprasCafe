import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000,
    query_timeout: 5000
})

async function criarTabela() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                quantidade VARCHAR(100), 
                observacao VARCHAR(100)
            )
        `)
        console.log('Tabela "produtos" pronta!')
    } catch (error) {
        console.log('Erro ao criar tabela:', error.message)
    }
}

criarTabela()
export default pool