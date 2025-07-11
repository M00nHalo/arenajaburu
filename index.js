 let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    function salvarCarrinho() {
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }

    function adicionarAoCarrinho(nome, preco) {
  let nomeFinal = nome;

  // Suco : busca checkbox selecionado
  if (nome === 'suco') {
    const sabores = document.querySelectorAll('input[name="sabor-suco"]:checked');
    if (sabores.length === 0) {
      alert('Escolha um sabor de suco!');
      return;
    }
    const sabor = sabores[0].value;
    nomeFinal = `Suco de ${capitalize(sabor)}`;
  }

  // Pizza :  busca checkbox selecionado
  else if (nome.includes('pizza')) {
    let grupoSabor = '';
    if (nome === 'pizza broto') grupoSabor = 'sabor-pizza-broto';
    else if (nome === 'pizza pequena') grupoSabor = 'sabor-pizza-pequena';
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

  // Adiciona ao carrinho
  const existente = carrinho.find(item => item.nome === nomeFinal);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ nome: nomeFinal, preco, quantidade: 1 });
  }

  salvarCarrinho();
  atualizarCarrinho();
}

// Função auxiliar para capitalizar nomes
function capitalize(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

    function removerDoCarrinho(index) {
      carrinho.splice(index, 1);
      salvarCarrinho();
      atualizarCarrinho();
    }

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

  // Só mostra a taxa se houver itens no carrinho
  if (carrinho.length > 0) {
    const taxaLi = document.createElement("li");
    taxaLi.innerHTML = `<strong>📦 Taxa de Entrega - R$${TAXA_ENTREGA.toFixed(2)}</strong>`;
    taxaLi.style.marginTop = "10px";
    lista.appendChild(taxaLi);
  }

  // Soma total com a taxa
  const totalComTaxa = carrinho.length > 0 ? totalPreco + TAXA_ENTREGA : 0;

  contador.textContent = totalQuantidade;
  totalSpan.textContent = `R$${totalComTaxa.toFixed(2)}`;

  const areaPagamento = document.getElementById("area-pagamento");
areaPagamento.style.display = carrinho.length > 0 ? "block" : "none";
}

    function alternarCarrinho() {
      const dropdown = document.getElementById("carrinho-dropdown");
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }

    // Atualiza ao abrir
    atualizarCarrinho();

   document.getElementById("botao-pagamento").addEventListener("click", () => {
  document.getElementById("formulario-finalizacao").style.display = "block";
  // Scroll para o formulário
  document.getElementById("formulario-finalizacao").scrollIntoView({ behavior: 'smooth' });
});

// Listener para mudar o campo troco dependendo da forma de pagamento
document.getElementById("forma-pagamento").addEventListener("change", () => {
  const forma = document.getElementById("forma-pagamento").value;
  const campoTroco = document.getElementById("campo-troco");
  campoTroco.style.display = forma === "Dinheiro" ? "block" : "none";
});
  document.getElementById("formulario-finalizacao").style.display = "block";

document.getElementById("confirmar-pedido").addEventListener("click", enviarPedido);

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

  if (formaPagamento === "Dinheiro") {
  if (troco === "") {
    alert("Informe o valor do troco.");
    return;
  }
  const valorTroco = parseFloat(troco);
  if (isNaN(valorTroco)) {
    alert("Valor de troco inválido.");
    return;
  }
}

  const TAXA_ENTREGA = 3.00;
  let mensagem = "🛒 *Meu Pedido:*\n";

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} x${item.quantidade}\n`;
  });

  const carrinhoIcon = document.getElementById('carrinho-icon');
carrinhoIcon.addEventListener('click', alternarCarrinho);
carrinhoIcon.addEventListener('touchstart', (e) => {
  e.preventDefault();
  alternarCarrinho();
});

  mensagem += `\n📦 *Taxa de Entrega:* R$${TAXA_ENTREGA.toFixed(2)}`;
  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0) + TAXA_ENTREGA;
  mensagem += `\n💰 *Total:* R$${total.toFixed(2)}`;

  mensagem += `\n\n🏠 *Endereço:* ${endereco}`;
  mensagem += `\n💳 *Pagamento:* ${formaPagamento}`;

  if (formaPagamento === "Dinheiro") {
    mensagem += `\n💵 *Troco para:* R$${parseFloat(troco).toFixed(2)}`;
  }

  const telefone = "559192820195";
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

