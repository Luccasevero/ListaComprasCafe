const tung = ['Banoffe', 'Brownie', 'Cinnamon', 'Bolo de cenoura', 'Cookie baunilha', 'Cookie chocolate', 'Cookie red', 'Recheio frango', 'Pão mandioquinha', 'Quiche alho', 'Torta frango', 'Torta maçã', 'Empanada carne', 'Pão de queijo grande', 'Bolo recheado chocolate', 'Bolo aveia', 'Coxinha', 'Pão de queijo pequeno', 'Geleia morango', 'Esfirra carne', 'Esfirra frango', 'Bolo red']
const pao = ['Croissant', 'Brioche']
const outros = ['Base baunilha', 'Gás chantilly cx', 'Choco quente', 'Shake cappuccino', 'Frape iogurte', 'Chocolate 30%', 'Polpa abacaxi com 10', 'Morango saco', 'Açaí pote', 'Leite nude', 'Leite zero lactose', 'Leite amêndoa', 'Sorvete creme', 'Água com gás', 'Água sem gás', 'Suco laranja 1,7 litros', 'Chocolate europeu branco', 'Chai latte', 'Matcha', 'Syrup/Xarope', 'Caramelo', 'Maçã verde', 'Macadâmia', 'Morango', 'Vanilla', 'Recheio morango Doremos', 'Recheio chocolate branco', 'Ovomaltine', 'Chantilly Amélia', 'Costela', 'Requeijão', 'Queijo parmesão', 'Bacon', 'Nutella', 'Pistache', 'Doce de leite', 'Manteiga']

const divTung = document.getElementById('Tung')
const divPao = document.getElementById('Pao')
const divOutros = document.getElementById('Outros')

const ulTung = document.getElementById('listaTung')
const ulPao = document.getElementById('listaPao')
const ulOutros = document.getElementById('listaOutros')

function carregarLista(listaItens, ulDoItem) {
    listaItens.forEach((item) => {
        const li = document.createElement('li')
        const input = document.createElement('input')
        input.type = 'number'
        input.dataset.nome = item
        input.inputMode = 'numeric'
        input.type = 'text'
        input.inputMode = 'decimal'
        input.value = 0
        input.addEventListener('focus', () => input.select())
        li.textContent = item
        li.appendChild(input)
        ulDoItem.appendChild(li)
    })
}

function carregarItens() {
    carregarLista(tung, ulTung)
    carregarLista(pao, ulPao)
    carregarLista(outros, ulOutros)

    if (new Date().getDay() !== 1) {
        divOutros.hidden = true
    }
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
    const diaDaSemana = new Date().getDay()
    let mensagem = ''

    mensagem = pegarContagem('Tung', ulTung) + pegarContagem('Pão', ulPao)

    if (diaDaSemana === 1) {
        mensagem = pegarContagem('Tung', ulTung) + pegarContagem('Pão', ulPao) + pegarContagem('Outros', ulOutros)
    }

    const url = 'https://wa.me/?text=' + encodeURIComponent(mensagem)
    return url
}

const botaoEnviar = document.getElementById('botaoEnviar')
botaoEnviar.addEventListener('click', () => {
    window.location.href = montarLinkWhatsApp()
})

carregarItens()