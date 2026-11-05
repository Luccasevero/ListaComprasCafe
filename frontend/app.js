const API_URL = ''

let produtoIdEdicao = null
const botaoAdicionarProduto = document.getElementById('botao')
const botaoCancelarEdicao = document.getElementById('botaoCancelar')
const botaEnviarWhatsApp = document.getElementById('botaoEnviar')
const ul = document.getElementById('lista')

async function listarProdutos() {
    try {
        const produtos = await fetch(`${API_URL}/produtos`)

        if (!produtos.ok) {
            alert('Não foi possível carregar a lista.')
            return []
        } else {
            return await produtos.json()
        }

    } catch (error) {
        console.log(error)
        alert('Banco de dados fora do ar.')
        return []
    }
}

async function addNoBanco(nomeProduto, quantidade, observacao) {
    try {
        const resposta = await fetch(`${API_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeProduto,
                quantidade: quantidade,
                observacao: observacao
            })
        })

        if (!resposta.ok) {
            return null
        } else {
            return await resposta.json()
        }

    } catch (error) {
        console.log(error)
        return null
    }
}

async function excluirDoBanco(id) {
    try {
        const resposta = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'DELETE'
        })

        if (resposta.status === 404) {
            return true
        }

        if (!resposta.ok) {
            return null
        } else {
            return await resposta.json()
        }

    } catch (error) {
        console.log(error)
        return null
    }
}

async function editarNoBanco(id, nome, quantidade, observacao) {
    try {
        const resposta = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                quantidade: quantidade,
                observacao: observacao
            })
        })

        if (!resposta.ok) {
            return null
        }

        return await resposta.json()

    } catch (error) {
        console.log(error)
        return null
    }
}

function validarFormulario() {
    const nomeProduto = document.getElementById('nomeProduto').value
    const quantidade = document.getElementById('quantidade').value
    const observacao = document.querySelector('#observacao').value

    if (nomeProduto.trim() === '') {
        alert('Digite o nome do produto')
        return false
    }

    return { nomeProduto, quantidade, observacao }
}

function criarItemNaLista(produto) {
    const li = document.createElement('li')

    if (produto.quantidade != null && produto.quantidade.trim() !== '') {
        li.textContent = `${produto.nome} (${produto.quantidade})`
    }
    else {
        li.textContent = produto.nome
    }

    if (produto.observacao != null && produto.observacao.trim() !== '') {
        if (produto.observacao.trim().toLowerCase() === 'ver') {
            li.textContent += ` (${produto.observacao})`
        }
        else {
            li.textContent += ` ${produto.observacao}`
        }
    }

    const botaoExcluir = document.createElement('button')
    botaoExcluir.textContent = 'Remover'
    botaoExcluir.addEventListener('click', async () => {
        const produtoExcluido = await excluirDoBanco(produto.id)

        if (produtoExcluido) {
            if (produtoIdEdicao === produto.id) {
                sairModoEdicao()
            }
            li.remove()
        } else {
            alert('Erro: Produto não removido.')
        }

    })

    const botaoEditar = document.createElement('button')
    botaoEditar.textContent = 'Editar'
    botaoEditar.addEventListener('click', () => {
        entrarModoEdicao(produto)
    })

    ul.appendChild(li)
    li.appendChild(botaoEditar)
    li.appendChild(botaoExcluir)
}

async function adicionarProduto(dados) {
    const produtoSalvo = await addNoBanco(dados.nomeProduto, dados.quantidade, dados.observacao)

    if (produtoSalvo) {
        criarItemNaLista(produtoSalvo)
        limparFormulario()
    } else {
        alert('Erro! Produto não foi salvo.')
    }
}

async function salvarEdicao(id, dados) {
    const produtoEditado = await editarNoBanco(id, dados.nomeProduto, dados.quantidade, dados.observacao)

    if (produtoEditado) {
        sairModoEdicao()
    } else {
        alert('Erro! Produto não foi salvo.')
    }
}

botaoAdicionarProduto.addEventListener('mousedown', async (e) => {
    e.preventDefault()
})

botaoAdicionarProduto.addEventListener('click', async () => {
    botaoAdicionarProduto.disabled = true
    document.getElementById('nomeProduto').focus()

    const resultado = validarFormulario()

    try {
        if (!resultado) {
            return
        }

        if (produtoIdEdicao === null) {
            await adicionarProduto(resultado)
        } else {
            await salvarEdicao(produtoIdEdicao, resultado)
        }
    } finally {
        botaoAdicionarProduto.disabled = false
    }
})

botaoCancelarEdicao.addEventListener('click', sairModoEdicao)

function limparFormulario() {
    document.getElementById('nomeProduto').value = ''
    document.querySelector('#quantidade').value = ''
    document.getElementById('observacao').value = ''
}

function entrarModoEdicao(produto) {
    botaoAdicionarProduto.value = 'Salvar'

    document.getElementById('nomeProduto').value = produto.nome
    document.getElementById('quantidade').value = produto.quantidade
    document.getElementById('observacao').value = produto.observacao

    document.getElementById('nomeProduto').focus()

    botaoCancelarEdicao.classList.add('visivel')
    produtoIdEdicao = produto.id
}

function sairModoEdicao() {
    limparFormulario()
    produtoIdEdicao = null
    botaoAdicionarProduto.value = 'Adicionar'
    botaoCancelarEdicao.classList.remove('visivel')
}

const divProdutos = document.querySelector('#produtos')

async function carregarPagina() {
    const produtos = await listarProdutos()
    ul.innerHTML = '' //para quando outro usuário add/remover algo a lista não seja duplicados

    divProdutos.classList.toggle('visivel', produtos.length > 0)
    produtos.forEach(criarItemNaLista)
}

botaEnviarWhatsApp.addEventListener('click', async () => {
    const url = await montarLinkWhatsApp()

    if (url) {
        window.open(url, '_blank')
    }
})

async function montarLinkWhatsApp() {
    const produtos = await listarProdutos()

    if (produtos.length === 0) {
        alert('Não há nada para enviar.')
        return
    }

    let mensagem = 'Lista\n'

    produtos.forEach((p) => {
        mensagem += `• ${p.nome}\n`
    })

    const url = 'https://wa.me/?text=' + encodeURIComponent(mensagem)
    //console.log(url)
    return url
}

const eventos = new EventSource(`${API_URL}/eventos`)
eventos.onmessage = (event) => {
    console.log('Mensagem do SSE recebida: ', event.data)
    carregarPagina()
}

carregarPagina()