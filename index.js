

  // Recupera carrinho do localStorage ou cria vazio
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Salva carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Capitaliza a primeira letra do texto
function capitalize(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Adiciona item ao carrinho (considera sabores de suco e pizza)
function adicionarAoCarrinho(nome, preco) {
  let nomeFinal = nome;

  // Suco: busca checkbox selecionado
  if (nome === 'suco') {
    const sabores = document.querySelectorAll('input[name="sabor-suco"]:checked');
    if (sabores.length === 0) {
      alert('Escolha um sabor de suco!');
      return;
    }
    const sabor = sabores[0].value;
    nomeFinal = `Suco de ${capitalize(sabor)}`;
  }

  // Pizza: busca checkbox selecionado
  else if (nome.includes('pizza')) {
    let grupoSabor = '';
    if (nome === 'pizza broto') grupoSabor = 'sabor-pizza-broto';
    else if (nome === 'pizza pequena') grupoSabor = 'sabor-pizza-pequena';
    else if (nome === 'pizza grande') grupoSabor = 'sabor-pizza-grande';
    else if (nome === 'pizza gigante') grupoSabor = 'sabor-pizza-gigante';

    const saborSelecionado = document.querySelector(`input[name="${grupoSabor}"]:checked`);
    if (!saborSelecionado) {
      alert(`Escolha o sabor da ${nome}`);
      return;
    }
    const sabor = saborSelecionado.value;
    nomeFinal = `${capitalize(nome)} de ${capitalize(sabor)}`;
  }

  // Verifica se já existe no carrinho
  const existente = carrinho.find(item => item.nome === nomeFinal);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ nome: nomeFinal, preco, quantidade: 1 });
  }

  salvarCarrinho();
  atualizarCarrinho();
}

// Remove item do carrinho pelo índice
function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
}

// Atualiza visual do carrinho, contador e total
function atualizarCarrinho() {
  const TAXA_ENTREGA = 3.00;
  const contador = document.getElementById("contador");
  const lista = document.getElementById("lista-carrinho");
  const totalSpan = document.getElementById("total-carrinho");

  let totalQuantidade = 0;
  let totalPreco = 0;

  lista.innerHTML = "";

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    totalQuantidade += item.quantidade;
    totalPreco += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.nome} x${item.quantidade} - R$${subtotal.toFixed(2)}</span>
      <button class="remove-btn" onclick="removerDoCarrinho(${index})">❌</button>
    `;
    lista.appendChild(li);
  });

  // Mostra taxa de entrega se carrinho não estiver vazio
  if (carrinho.length > 0) {
    const taxaLi = document.createElement("li");
    taxaLi.innerHTML = `<strong>📦 Taxa de Entrega - R$${TAXA_ENTREGA.toFixed(2)}</strong>`;
    taxaLi.style.marginTop = "10px";
    lista.appendChild(taxaLi);
  }

  const totalComTaxa = carrinho.length > 0 ? totalPreco + TAXA_ENTREGA : 0;

  contador.textContent = totalQuantidade;
  totalSpan.textContent = `R$${totalComTaxa.toFixed(2)}`;

  // Mostra ou esconde a área de pagamento conforme carrinho
  const areaPagamento = document.getElementById("area-pagamento");
  areaPagamento.style.display = carrinho.length > 0 ? "block" : "none";
}

// Alterna visual do dropdown do carrinho
function alternarCarrinho() {
  const dropdown = document.getElementById("carrinho-dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Evento para mostrar/esconder dropdown do carrinho ao clicar no ícone
document.getElementById("carrinho-icon").addEventListener("click", alternarCarrinho);

// Ao clicar no botão finalizar pedido, mostra o formulário de finalização e dá scroll suave
document.getElementById("botao-pagamento").addEventListener("click", () => {
  const formulario = document.getElementById("formulario-finalizacao");
  formulario.style.display = "block";
  formulario.scrollIntoView({ behavior: "smooth" });
});

// Mostra ou esconde o campo troco conforme forma de pagamento selecionada
document.getElementById("forma-pagamento").addEventListener("change", () => {
  const forma = document.getElementById("forma-pagamento").value;
  const campoTroco = document.getElementById("campo-troco");
  campoTroco.style.display = forma === "Dinheiro" ? "block" : "none";
});

// Função para enviar pedido para WhatsApp via link
function enviarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const formaPagamento = document.getElementById("forma-pagamento").value;
  const endereco = document.getElementById("endereco").value.trim();
  const troco = document.getElementById("troco").value;

  if (!formaPagamento) {
    alert("Selecione a forma de pagamento.");
    return;
  }

  if (!endereco) {
    alert("Informe o endereço de entrega.");
    return;
  }

  if (formaPagamento === "Dinheiro" && (!troco || parseFloat(troco) <= 0)) {
    alert("Informe o valor do troco.");
    return;
  }

  const TAXA_ENTREGA = 3.00;
  let mensagem = "🛒 *Meu Pedido:*\n";

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} x${item.quantidade}\n`;
  });

  mensagem += `\n📦 *Taxa de Entrega:* R$${TAXA_ENTREGA.toFixed(2)}`;
  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0) + TAXA_ENTREGA;
  mensagem += `\n💰 *Total:* R$${total.toFixed(2)}`;

  mensagem += `\n\n🏠 *Endereço:* ${endereco}`;
  mensagem += `\n💳 *Pagamento:* ${formaPagamento}`;

  if (formaPagamento === "Dinheiro") {
    mensagem += `\n💵 *Troco para:* R$${parseFloat(troco).toFixed(2)}`;
  }

  // Número de telefone do WhatsApp (seu número)
  const telefone = "559192820195";

  // Abre o WhatsApp com mensagem pronta
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");

  // Limpa carrinho e formulário após enviar
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();

  document.getElementById("formulario-finalizacao").style.display = "none";
  document.getElementById("forma-pagamento").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("troco").value = "";
  document.getElementById("campo-troco").style.display = "none";

  alert("Pedido enviado! Obrigado pela compra 😊");
}

// Evento do botão confirmar pedido
document.getElementById("confirmar-pedido").addEventListener("click", enviarPedido);

// Atualiza o carrinho quando a página carrega
atualizarCarrinho();
