// -------- Gerador de usuarios -------- //
// 1. Captura de elementos
document.addEventListener('DOMContentLoaded', () => {
  const btnUsuario = document.getElementById('btn-usuario')
  const usuariosContainer = document.getElementById('usuarios-container')
  const helperTextUsuario = document.getElementById('helper-text-usuario')
  
  // 2. Funções
  function gerarUsuario() {
    helperTextUsuario.innerText = 'Carregando...'

    fetch('https://random-data-api.com/api/v2/users')
      .then((res) => res.json())
      .then((data) => {
        const usuario = document.createElement('div')
        usuario.innerHTML = `
          <img src="${data.avatar}"/>
          <span><strong>Username: </strong> ${data.username}</span>
        ` 
        usuario.classList.add('usuario')
        usuariosContainer.appendChild(usuario)
        helperTextUsuario.innerText = ''
        console.log(data)
      })
      .catch((error) => {
        helperTextUsuario.innerText = 'Não foi possivel gerar um usuario'
        console.log(error)
      })
  }

  // 3. Eventos
  btnUsuario.addEventListener('click', gerarUsuario);

  // -------- Gerador de postagens -------- //
  // 1. Captura de elementos
  const postTitle = document.getElementById('post-title')
  const postBody = document.getElementById('post-body')
  const btnPost = document.getElementById('btn-post')
  const postsContainer = document.getElementById('posts-container')
  const helperTextPost = document.getElementById('helper-text-post')
  // 2. Funções
  function gerarPost(evento){
    helperTextPost.innerText = ''
    evento.preventDefault()

    const jsonbody = JSON.stringify({
      titulo: postTitle.value,
      mensagem: postBody.value
    })

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonbody
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      const post = document.createElement('div')
      post.classList.add('postagem')
      post.innerHTML = `
        <h3>${data.id} - ${data.titulo}</h3>
        <p>${data.mensagem}</p>
      `
      postsContainer.prepend(post)

      // Limpar o formulário
      postTitle.value = ''
      postBody.value = ''
      alert('Postagem Criada com sucesso !')
    })
    .catch(error => {
      console.log(error)
      helperTextPost.innerText = 'Não foi possivel gerar a psotagem '
    })
  }

  // 3. Eventos
  btnPost.addEventListener('click', (evento) => gerarPost(evento));
});
