const nomeProduto = document.getElementById('nome-produto');
const valorProduto = document.getElementById('valor-produto');
const descricaoProduto = document.getElementById('descricao-produto');
const btnEnviar = document.getElementById('btn-enviar');
const feedbackUsuario = document.getElementById('feedback-usuario');
const produtosCadastrados = document.getElementById('produtos-cadastrados');

btnEnviar.addEventListener('click', async (event) => {
  event.preventDefault();
  
  const produto = {
    produto: nomeProduto.value,
    valor: valorProduto.value,
    descricao: descricaoProduto.value,
  };

  try {
    const response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(produto)
    });

    const data = await response.json();

    if (response.ok) {
      feedbackUsuario.textContent = 'Produto cadastrado com sucesso!';
      feedbackUsuario.style.color = 'green';
      adicionarProdutoNaLista(produto);

      // Limpar os inputs
      nomeProduto.value = '';
      valorProduto.value = '';
      descricaoProduto.value = '';
    } else {
      feedbackUsuario.textContent = 'Falha ao cadastrar o produto. Tente novamente.';
      feedbackUsuario.style.color = 'red';
    }
  } catch (error) {
    feedbackUsuario.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
    feedbackUsuario.style.color = 'red';
  }
});

function adicionarProdutoNaLista(produto) {
  const produtoElemento = document.createElement('div');
  produtoElemento.innerHTML = `
    <h3>${produto.produto}</h3>
    <p>Valor: ${produto.valor}</p>
    <p>${produto.descricao}</p>
  `;
  produtosCadastrados.appendChild(produtoElemento);
}
