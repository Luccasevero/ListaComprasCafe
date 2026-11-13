const graos = ['Café moído chocolate', 'Café grão chocolate', 'Café moído frutado', 'Café grão frutado']
const amendoccions = ['Amendoccino caixa', 'Amendoccino tubo']
const copos = ['Copo bambum', 'Caneca']

const ulGraos = document.getElementById('listaGraos')
const ulAmendoccinos = document.getElementById('listaAmendoccinos')
const ulCopos = document.getElementById('listaCopos')

function carregarItens(listaItens, ul) {
    listaItens.forEach((item => {
        const li = document.createElement('li')
        const input = document.createElement('input')
        
        input.inputMode = 'decimal'
        input.type = 'text'
        input.dataset.nome = item
        input.value = 0

        input.addEventListener('focus', () => input.select())

        li.textContent = item
        li.appendChild(input)
        ul.appendChild(li)
    }))
}

function carregarInventario() {
    carregarItens(graos, ulGraos)
    carregarItens(amendoccions, ulAmendoccinos)
    carregarItens(copos, ulCopos)
}

function pegarContagem(categoria, ul) {
    const camposCategoria = ul.querySelectorAll('input[data-nome]')
    let texto = `${categoria}\n`

    camposCategoria.forEach((item) => {
        const numero = Number(item.value.replace(',', '.')) || 0
        const quantidade = String(numero).replace('.', ',')

        texto += `${item.dataset.nome}: ${quantidade}\n`
    })

    return texto + '\n'
}

function montarLinkWhatsApp() {
    let mensagem = ''

    mensagem = pegarContagem('Cafés', ulGraos) + pegarContagem('Amendoccinos', ulAmendoccinos) + pegarContagem('', ulCopos)

    const url = 'https://wa.me/?text=' + encodeURIComponent(mensagem)
    
    return url
}

const botaoEnviar = document.getElementById('botaoEnviar')
botaoEnviar.addEventListener('click', () => {
    window.location.href = montarLinkWhatsApp()
})

carregarInventario()