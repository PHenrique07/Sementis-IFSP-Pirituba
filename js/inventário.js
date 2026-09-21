function renderizarCards(inventario, container) {
    container.textContent = '';

    inventario.forEach(item => {
        const card = document.createElement('article');
        const nome = document.createElement('h3');
        const imagem = document.createElement('img');
        const descricao = document.createElement('p');
        const botao = document.createElement('button');

        nome.textContent = item.nome ?? item.name ?? 'Item sem nome';
        imagem.src = item.imagem ?? item.image ?? item.urlImagem ?? item.imageUrl ?? '';
        imagem.alt = nome.textContent;
        descricao.textContent = item.descricao ?? item.description ?? 'Sem descrição disponível';
        botao.type = 'button';
        botao.textContent = 'Usar';

        card.append(nome, imagem, descricao, botao);
        container.appendChild(card);
    });
}

async function buscarItens(idUsuario, seletorContainer = '#inventario') {
    const resposta = await fetch(`/api/inventario/${idUsuario}`);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar inventário: ${resposta.status}`);
    }

    const inventario = await resposta.json();
    const container = document.querySelector(seletorContainer);

    if (container) {
        renderizarCards(inventario, container);
    }

    return inventario;
}