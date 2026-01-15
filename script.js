document.addEventListener('DOMContentLoaded', () => {
  // Helpers
  const setStatus = (element, message, tone = 'muted') => {
    if (!element) return
    element.textContent = message
    element.dataset.tone = tone
  }

  const toggleBusy = (control, isBusy) => {
    if (!control) return
    control.disabled = isBusy
    control.setAttribute('aria-busy', String(isBusy))
  }

  const formatCurrency = (value) => {
    const numeric = Number(value) || 0
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numeric)
  }

  // Cadastro de produtos
  const productForm = document.getElementById('product-form')
  const productStatus = document.getElementById('product-status')
  const productList = document.getElementById('product-list')
  const productCount = document.getElementById('product-count')
  const productSubmit = document.getElementById('product-submit')
  const productName = document.getElementById('product-name')
  const productPrice = document.getElementById('product-price')
  const productCategory = document.getElementById('product-category')
  const productDescription = document.getElementById('product-description')
  const products = []

  const validateProduct = () => {
    const errors = []
    if (!productName.value.trim() || productName.value.trim().length < 3) {
      errors.push('Informe um nome com pelo menos 3 caracteres.')
    }
    const priceValue = Number(productPrice.value)
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      errors.push('Informe um valor maior que zero.')
    }
    if (!productDescription.value.trim()) {
      errors.push('Adicione uma descricao do produto.')
    }
    return { isValid: errors.length === 0, message: errors.join(' ') }
  }

  const renderProductCard = (payload) => {
    const card = document.createElement('article')
    card.className = 'tile'
    card.innerHTML = `
      <div class="tile__header">
        <div>
          <p class="eyebrow">${payload.categoria || 'Sem categoria'}</p>
          <h3>${payload.produto}</h3>
        </div>
        <span class="pill">${formatCurrency(payload.valor)}</span>
      </div>
      <p class="muted">${payload.descricao}</p>
    `
    productList.prepend(card)
  }

  const updateProductCount = () => {
    productCount.textContent = `${products.length} itens`
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()
    const { isValid, message } = validateProduct()
    if (!isValid) {
      setStatus(productStatus, message, 'error')
      return
    }

    const payload = {
      produto: productName.value.trim(),
      valor: Number(productPrice.value),
      descricao: productDescription.value.trim(),
      categoria: productCategory.value.trim() || 'Geral'
    }

    setStatus(productStatus, 'Enviando produto...', 'muted')
    toggleBusy(productSubmit, true)

    try {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Resposta inesperada do servidor.')
      }

      await response.json()
      products.push(payload)
      renderProductCard(payload)
      updateProductCount()
      productForm.reset()
      setStatus(productStatus, 'Produto cadastrado com sucesso.', 'success')
    } catch (error) {
      setStatus(productStatus, 'Nao foi possivel cadastrar agora. Confira os dados ou tente novamente.', 'error')
      console.error(error)
    } finally {
      toggleBusy(productSubmit, false)
    }
  }

  productForm?.addEventListener('submit', handleProductSubmit)

  // Gerador de postagens
  const postForm = document.getElementById('post-form')
  const postTitle = document.getElementById('post-title')
  const postBody = document.getElementById('post-body')
  const btnPost = document.getElementById('btn-post')
  const postsContainer = document.getElementById('posts-container')
  const helperTextPost = document.getElementById('helper-text-post')

  const renderPost = (data) => {
    const post = document.createElement('article')
    post.className = 'tile'
    post.innerHTML = `
      <div class="tile__header">
        <div>
          <p class="eyebrow">Post #${data.id || 'novo'}</p>
          <h3>${data.title || data.titulo}</h3>
        </div>
      </div>
      <p>${data.body || data.mensagem}</p>
    `
    postsContainer.prepend(post)
  }

  const handlePostSubmit = async (event) => {
    event.preventDefault()
    setStatus(helperTextPost, '', 'muted')

    if (!postTitle.value.trim() || !postBody.value.trim()) {
      setStatus(helperTextPost, 'Preencha titulo e texto para publicar.', 'error')
      return
    }

    const payload = {
      title: postTitle.value.trim(),
      body: postBody.value.trim()
    }

    setStatus(helperTextPost, 'Publicando...', 'muted')
    toggleBusy(btnPost, true)

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Falha ao publicar post.')
      }

      const data = await response.json()
      renderPost(data)
      postForm.reset()
      setStatus(helperTextPost, 'Post publicado com sucesso.', 'success')
    } catch (error) {
      setStatus(helperTextPost, 'Nao foi possivel publicar. Tente novamente.', 'error')
      console.error(error)
    } finally {
      toggleBusy(btnPost, false)
    }
  }

  postForm?.addEventListener('submit', handlePostSubmit)

  // Gerador de usuarios
  const btnUsuario = document.getElementById('btn-usuario')
  const usuariosContainer = document.getElementById('usuarios-container')
  const helperTextUsuario = document.getElementById('helper-text-usuario')

  const fetchUsuario = async () => {
    const providers = [
      async () => {
        const response = await fetch('https://random-data-api.com/api/v2/users')
        if (!response.ok) throw new Error('Falha ao obter usuario (random-data-api).')
        const data = await response.json()
        return {
          username: data.username,
          email: data.email,
          title: data.employment?.title || 'Usuario gerado',
          avatar: data.avatar
        }
      },
      async () => {
        const response = await fetch('https://randomuser.me/api/?inc=name,email,picture,login')
        if (!response.ok) throw new Error('Falha ao obter usuario (randomuser).')
        const payload = await response.json()
        const user = payload.results?.[0] || {}
        return {
          username: user.login?.username || 'usuario-random',
          email: user.email || 'sem-email',
          title: 'Usuario aleatorio',
          avatar: user.picture?.medium || user.picture?.thumbnail
        }
      }
    ]

    let lastError
    for (const provider of providers) {
      try {
        return await provider()
      } catch (error) {
        lastError = error
      }
    }
    throw lastError || new Error('Falha ao obter usuario.')
  }

  const renderUsuario = (data) => {
    const wrapper = document.createElement('article')
    wrapper.className = 'tile tile--user'
    wrapper.innerHTML = `
      <img class="avatar" src="${data.avatar}" alt="Avatar gerado" loading="lazy" />
      <div>
        <p class="eyebrow">${data.title || 'Usuario gerado'}</p>
        <h3>${data.username}</h3>
        <p class="muted">${data.email}</p>
      </div>
    `
    usuariosContainer.prepend(wrapper)
  }

  const gerarUsuario = async () => {
    setStatus(helperTextUsuario, 'Carregando usuario...', 'muted')
    toggleBusy(btnUsuario, true)

    try {
      const data = await fetchUsuario()
      renderUsuario(data)
      setStatus(helperTextUsuario, 'Usuario gerado.', 'success')
    } catch (error) {
      setStatus(helperTextUsuario, 'Nao foi possivel gerar usuario agora. Verifique a conexao ou tente novamente.', 'error')
      console.error(error)
    } finally {
      toggleBusy(btnUsuario, false)
    }
  }

  btnUsuario?.addEventListener('click', gerarUsuario)
})
