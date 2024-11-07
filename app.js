let transactions = [];
let detalheTransacaoID = null; // ID da transação que será editada

// Carrega as transações do localStorage ao iniciar o aplicativo
function carregarTransacoes() {
    const transacoesSalvas = localStorage.getItem("transactions");
    if (transacoesSalvas) {
        transactions = JSON.parse(transacoesSalvas);
        atualizarTransacoes();
    }
}

// Salva as transações no localStorage
function salvarTransacoes() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function abrirPopup() {
    document.getElementById("popup").style.display = "flex";
}

function fecharPopup() {
    document.getElementById("popup").style.display = "none";
    detalheTransacaoID = null; // Limpa o ID ao fechar o pop-up
    limparCampos();
}

// Função para limpar os campos do formulário
function limparCampos() {
    document.getElementById("descricao").value = '';
    document.getElementById("valor").value = '';
    document.getElementById("tipo").value = 'ganho';
    document.getElementById("data").value = '';
    document.getElementById("status").value = 'pago';
}

// Função para adicionar ou editar uma transação
function adicionarOuEditarTransacao() {
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;
    const data = document.getElementById("data").value;
    const status = document.getElementById("status").value;

    if (descricao && valor && data) {
        if (detalheTransacaoID !== null) {
            // Edita transação existente
            const transacao = transactions.find(t => t.id === detalheTransacaoID);
            transacao.descricao = descricao;
            transacao.valor = valor;
            transacao.tipo = tipo;
            transacao.data = data;
            transacao.status = status;
        } else {
            // Adiciona nova transação
            const transacao = {
                id: Date.now(),
                descricao,
                valor,
                tipo,
                data,
                status
            };
            transactions.push(transacao);
        }

        salvarTransacoes();
        atualizarTransacoes();
        fecharPopup();
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

function removerTransacao(id) {
    transactions = transactions.filter(transacao => transacao.id !== id);
    salvarTransacoes();
    atualizarTransacoes();
}

function atualizarTransacoes() {
    const transactionList = document.getElementById("transaction-list");
    transactionList.innerHTML = "";

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transacao) => {
        const transacaoDiv = document.createElement("div");
        transacaoDiv.classList.add("transacao");

        transacaoDiv.innerHTML = `
            <div class="info">
                <h4>${transacao.descricao}</h4>
                <p>${transacao.tipo === "ganho" ? "Income" : "Expense"}</p>
                <p>Data: ${transacao.data}</p>
                <p>Status: ${transacao.status === "pago" ? "Pago" : "Não Pago"}</p>
            </div>
            <div class="valor ${transacao.tipo === "ganho" ? "positivo" : "negativo"}">
                ${transacao.tipo === "ganho" ? "+" : "-"} ${formatarMoeda(transacao.valor)}
            </div>
            <button class="botao-detalhes" onclick="verDetalhesTransacao(${transacao.id})">Ver Detalhes</button>
            <button class="remover" onclick="removerTransacao(${transacao.id})">Remover</button>
        `;

        transactionList.appendChild(transacaoDiv);

        if (transacao.tipo === "ganho") {
            totalIncome += transacao.valor;
        } else {
            totalExpenses += transacao.valor;
        }
    });

    document.getElementById("total-income").innerText = formatarMoeda(totalIncome);
    document.getElementById("total-expenses").innerText = formatarMoeda(totalExpenses);
    document.getElementById("total-balance").innerText = formatarMoeda(totalIncome - totalExpenses);
}

function verDetalhesTransacao(id) {
    const transacao = transactions.find(t => t.id === id);

    if (transacao) {
        document.getElementById("descricao").value = transacao.descricao;
        document.getElementById("valor").value = transacao.valor;
        document.getElementById("tipo").value = transacao.tipo;
        document.getElementById("data").value = transacao.data;
        document.getElementById("status").value = transacao.status;

        detalheTransacaoID = id;
        abrirPopup();
    }
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Carrega as transações ao iniciar o aplicativo
carregarTransacoes();
