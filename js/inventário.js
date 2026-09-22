function normalizarTipoItem(tipo) {
    return String(tipo || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function obterPayloadConsumo(tipo) {
    const tipoNormalizado = normalizarTipoItem(tipo);
    return tipoNormalizado === 'coracao' ? { coracao: 1 } : { freeze: true };
}

function obterSeletorContador(tipo) {
    return normalizarTipoItem(tipo) === 'coracao'
        ? '[data-contador="coracao"], #vidas, [data-vidas], #coracoes, [data-coracoes]'
        : '[data-contador="freeze"], #freezes, [data-freezes]';
}

function atualizarContador(tipo, resposta) {
    const tipoNormalizado = normalizarTipoItem(tipo);
    const aliases = tipoNormalizado === 'coracao'
        ? ['coracao', 'coracoes', 'corações', 'vidas', 'heart', 'hearts']
        : ['freeze', 'freezes'];
    let total;
    if (typeof resposta === 'number') {
        total = resposta;
    }
    const totais = resposta && resposta.totais && typeof resposta.totais === 'object'
        ? resposta.totais
        : resposta || {};

    if (typeof total !== 'number') {
        for (const alias of [...aliases, 'total', 'quantidade', 'saldo', 'novo_total']) {
            if (typeof totais[alias] === 'number') {
                total = totais[alias];
                break;
            }
        }
    }

    document.querySelectorAll(obterSeletorContador(tipo)).forEach((contador) => {
        const atual = Number.parseInt(contador.textContent, 10);
        const proximo = typeof total === 'number' ? total : (Number.isNaN(atual) ? 0 : Math.max(0, atual - 1));
        contador.textContent = String(proximo);
    });
}

async function consumirItem(item, botao) {
    const tipo = normalizarTipoItem(typeof item === 'string' ? item : item && (item.tipo || item.type));
    if (tipo !== 'coracao' && tipo !== 'freeze') return;

    const controle = botao || (typeof event !== 'undefined' && event && event.currentTarget);
    if (controle && controle.disabled) return;
    if (controle) controle.disabled = true;

    try {
        const resposta = await fetch('/api/inventario/usar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obterPayloadConsumo(tipo))
        });
        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok) throw new Error(dados.erro || dados.error || 'Não foi possível consumir o item.');
        atualizarContador(tipo, dados);
    } catch (erro) {
        console.error(erro);
        if (typeof window.exibirMensagem === 'function') window.exibirMensagem(erro.message, 'erro');
    } finally {
        if (controle) controle.disabled = false;
    }
}
function renderizarCards(inventario, container) {
    if (!container) return;
    container.textContent = '';

    (Array.isArray(inventario) ? inventario : []).forEach(item => {
        const card = document.createElement('article');
        const nome = document.createElement('h3');
        const imagem = document.createElement('img');
        const descricao = document.createElement('p');
        const botao = document.createElement('button');

        nome.textContent = item.nome ?? item.name ?? 'Item sem nome';
        imagem.src = obterImagemItem(item);
        imagem.alt = nome.textContent;
        descricao.textContent = item.descricao ?? item.description ?? 'Sem descrição disponível';
        botao.type = 'button';
            botao.textContent = 'Usar';
            botao.addEventListener('click', () => {
                const tipoNormalizado = normalizarTipoItem(item.tipo || item.type);
                if (tipoNormalizado === 'coracao' || tipoNormalizado === 'freeze') {
                    consumirItem(item, botao);
                } else {
                    equiparItem(item);
                }
            });

        card.append(nome, imagem, descricao, botao);
        container.appendChild(card);
    });
}


function normalizarListaEquipaveis(resposta) {
    if (Array.isArray(resposta)) return resposta;
    if (!resposta || typeof resposta !== 'object') return [];
    if (Array.isArray(resposta.equipaveis)) return resposta.equipaveis;
    if (Array.isArray(resposta.itens)) return resposta.itens;
    return [];
}

function obterIdItem(item) {
    return item.item_id ?? item.idItem ?? item.itemId ?? item.id ?? item.inventario_id;
}

function obterImagemItem(item) {
    return item.imagem_url ?? item.image_url ?? item.imagem ?? item.image ?? item.urlImagem ?? item.imagemUrl ?? item.imageUrl ?? '';
}

async function renderizarEquipável(idUsuario, seletorContainer = null, opcoes = {}){
    if (seletorContainer && typeof seletorContainer === 'object' && !seletorContainer.nodeType) {
        opcoes = seletorContainer;
        seletorContainer = opcoes.container ?? null;
    }
    const equipaveis = normalizarListaEquipaveis(await buscarEquipaveis(idUsuario));
    const container = seletorContainer?.nodeType === 1
        ? seletorContainer
        : document.querySelector(seletorContainer || opcoes.seletorContainer || '[data-equipaveis], #equipaveis, #inventario, #inventory-container-wrapper');
    if (!container) return equipaveis;

    container.textContent = '';
    equipaveis.forEach(equipavel => {
        const card = document.createElement('article');
        const nome = document.createElement('h3');
        const imagem = document.createElement('img');
        const descricao = document.createElement('p');
        const botao = document.createElement('button');
        const idItem = obterIdItem(equipavel);
        const tipo = String(equipavel.tipo ?? equipavel.type ?? '').toLowerCase();
        nome.textContent = equipavel.nome ?? equipavel.name ?? 'Sem nome';
        imagem.src = obterImagemItem(equipavel);
        imagem.alt = nome.textContent;
        descricao.textContent = equipavel.descricao ?? equipavel.description ?? 'Descrição não encontrada';
        botao.type = 'button';
        botao.dataset.itemId = String(idItem ?? '');
        botao.textContent = equipavel.equipado ? 'Em uso' : 'Usar';
        botao.disabled = Boolean(equipavel.equipado);
        card.dataset.itemId = String(idItem ?? '');
        card.dataset.tipo = tipo;
        botao.addEventListener('click', () => equiparItem(equipavel, botao, container, opcoes));

        card.append(nome, imagem, descricao, botao);
        container.appendChild(card);
    });
    return equipaveis;
}

async function equiparItem(item, botao, container, opcoes = {}) {
    const idItem = obterIdItem(item);
    if (idItem === undefined || idItem === null || botao.disabled) return;

    botao.disabled = true;
    try {
        const resposta = await fetch('/api/inventario/equipar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idItem })
        });
        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok || dados.status === 'erro') {
            throw new Error(dados.mensagem ?? `Erro ao equipar item: ${resposta.status}`);
        }

        const tipo = String(item.tipo ?? item.type ?? '').toLowerCase();
        const botoes = container.querySelectorAll('button[data-item-id]');
        botoes.forEach(outroBotao => {
            const card = outroBotao.closest('[data-tipo]');
            const mesmoTipo = Boolean(tipo) && card?.dataset.tipo === tipo;
            if (mesmoTipo) {
                const selecionado = outroBotao.dataset.itemId === String(idItem);
                outroBotao.disabled = selecionado;
                outroBotao.textContent = selecionado ? 'Em uso' : 'Usar';
            }
        });

        if (tipo === 'avatar') {
            const imagem = obterImagemItem(item);
            const seletorAvatar = opcoes.seletorAvatar || '[data-avatar], [data-avatar-id], .avatar-atual, .avatar-selecionado';
            document.querySelectorAll(`${seletorAvatar}, #profile-picture`).forEach(elemento => {
                elemento.classList.remove('selecionado', 'selected');
            });
            document.querySelectorAll(`${seletorAvatar}, #profile-picture`).forEach(elemento => {
                if (imagem && elemento.matches('img')) elemento.src = imagem;
                elemento.dataset.avatarId = String(idItem);
                elemento.classList.add('selecionado', 'selected');
            });
        } else if (tipo === 'tema') {
            const alvo = document.querySelector(opcoes.seletorTema || '[data-tema], [data-theme], body');
            const fundo = obterImagemItem(item) || item.background || item.cor || item.color;
            if (alvo && fundo) {
                if (String(fundo).includes('/') || String(fundo).includes('.') || String(fundo).startsWith('url(')) {
                    alvo.style.backgroundImage = String(fundo).startsWith('url(') ? fundo : `url("${String(fundo).replace(/"/g, '')}")`;
                } else {
                    alvo.style.backgroundImage = 'none';
                    alvo.style.backgroundColor = fundo;
                }
                alvo.dataset.temaId = String(idItem);
            }
        }
    } catch (erro) {
        botao.disabled = false;
        botao.textContent = 'Usar';
        console.error(erro);
    }
}

async function buscarEquipaveis(idUsuario){
    const resposta = await fetch(`/api/inventario/${idUsuario}/equipar`);
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar equipaveis: ${resposta.status}`);
    }
    const listaEquipaveis = await resposta.json()
    return listaEquipaveis
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