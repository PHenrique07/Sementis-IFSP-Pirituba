async function exibirListaAmigos() {
    const lista = document.querySelector('#lista-amigos');
    if (!lista) return;

    let amigos = [];
    try {
        const resposta = await fetch('/api/amigos');
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar amigos: ${resposta.status}`);
        }
        const dados = await resposta.json();
        amigos = Array.isArray(dados) ? dados : [];
    } catch (erro) {
        console.error('Não foi possível carregar a lista de amigos.', erro);
    }

    lista.replaceChildren();

    for (const amigo of amigos) {
        const cartao = document.createElement('button');
        const imagem = document.createElement('img');
        const nome = document.createElement('h3');
        const nivel = document.createElement('p');
        const ofensiva = document.createElement('p');
        const idAmigo = amigo.id ?? amigo.amizade_id ?? amigo.usuario_id;

        cartao.type = 'button';
        cartao.className = 'cartao-amigo';
        imagem.src = amigo.avatar_url || '/assets/icons/icone_usuario.png';
        imagem.alt = `Foto de ${amigo.nome || 'amigo'}`;
        nome.textContent = amigo.nome || 'Amigo';
        nivel.textContent = `Nível: ${amigo.nivel ?? 0}`;
        ofensiva.textContent = `Ofensiva: ${amigo.ofensiva ?? 0} dias`;

        cartao.append(imagem, nome, nivel, ofensiva);

        if (idAmigo === undefined || idAmigo === null || String(idAmigo).trim() === '') {
            cartao.disabled = true;
        } else {
            cartao.addEventListener('click', async () => {
                let modal = document.querySelector('#modal-perfil-amigo');
                if (modal) modal.remove();

                modal = document.createElement('div');
                const conteudo = document.createElement('div');
                const fechar = document.createElement('button');
                const titulo = document.createElement('h2');
                const avatar = document.createElement('img');
                const tema = document.createElement('p');
                const estatisticasTitulo = document.createElement('h3');
                const estatisticas = document.createElement('div');

                modal.id = 'modal-perfil-amigo';
                modal.className = 'modal-overlay';
                conteudo.className = 'modal-content';
                fechar.type = 'button';
                fechar.textContent = 'Fechar';
                fechar.setAttribute('aria-label', 'Fechar perfil');
                titulo.textContent = amigo.nome || 'Perfil do amigo';
                avatar.alt = `Avatar de ${amigo.nome || 'amigo'}`;
                avatar.src = amigo.avatar_url || '/assets/icons/icone_usuario.png';
                tema.textContent = 'Tema: Carregando...';
                estatisticasTitulo.textContent = 'Estatísticas';

                const fecharModal = () => modal.remove();
                fechar.addEventListener('click', fecharModal);
                modal.addEventListener('click', evento => {
                    if (evento.target === modal) fecharModal();
                });

                conteudo.append(fechar, titulo, avatar, tema, estatisticasTitulo, estatisticas);
                modal.appendChild(conteudo);
                document.body.appendChild(modal);

                try {
                    const respostaPerfil = await fetch(`/api/amigos/${encodeURIComponent(idAmigo)}/perfil`);
                    if (!respostaPerfil.ok) {
                        throw new Error(`Erro ao carregar o perfil: ${respostaPerfil.status}`);
                    }

                    const dados = await respostaPerfil.json();
                    const perfil = dados?.perfil ?? dados ?? {};
                    const temaPerfil = perfil.tema ?? perfil.theme ?? 'Não informado';
                    const dadosEstatisticas = perfil.estatisticas ?? perfil['estatísticas'] ?? perfil.stats;

                    tema.textContent = `Tema: ${temaPerfil}`;
                    if (perfil.avatar_url || perfil.avatar) {
                        avatar.src = perfil.avatar_url || perfil.avatar;
                    }

                    estatisticas.replaceChildren();
                    if (dadosEstatisticas && typeof dadosEstatisticas === 'object' && !Array.isArray(dadosEstatisticas)) {
                        Object.entries(dadosEstatisticas).forEach(([chave, valor]) => {
                            const estatistica = document.createElement('p');
                            const chaveElemento = document.createElement('strong');
                            chaveElemento.textContent = `${chave}: `;
                            estatistica.append(chaveElemento, document.createTextNode(String(valor ?? '')));
                            estatisticas.appendChild(estatistica);
                        });
                    } else {
                        const semEstatisticas = document.createElement('p');
                        semEstatisticas.textContent = dadosEstatisticas == null
                            ? 'Nenhuma estatística disponível.'
                            : String(dadosEstatisticas);
                        estatisticas.appendChild(semEstatisticas);
                    }
                } catch (erro) {
                    console.error('Não foi possível carregar o perfil do amigo.', erro);
                    tema.textContent = 'Não foi possível carregar o perfil.';
                    estatisticas.replaceChildren();
                }
            });
        }

        lista.appendChild(cartao);
    }
}

async function verificarConvites() {
    const lista = document.querySelector('#lista-convites');
    if (!lista) return;

    try {
        const resposta = await fetch('/api/amigos/pedidos');
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar a lista de convites: ${resposta.status}`);
        }

        const dados = await resposta.json();
        const convites = Array.isArray(dados) ? dados : [];
        lista.replaceChildren();

        convites.forEach(convite => {
            const mensagem = document.createElement('article');
            const texto = document.createElement('p');
            const aceitar = document.createElement('button');
            const recusar = document.createElement('button');
            const idConvite = convite.id ?? convite.amizade_id ?? convite.usuario_id;

            texto.textContent = `Convite recebido de ${convite.nome || 'um usuário'}`;
            aceitar.type = 'button';
            aceitar.textContent = 'Aceitar';
            recusar.type = 'button';
            recusar.textContent = 'Recusar';

            [aceitar, recusar].forEach(botao => {
                botao.addEventListener('click', async () => {
                    const acao = botao === aceitar ? 'aceitar' : 'recusar';
                    botao.disabled = true;

                    try {
                        const respostaAcao = await fetch(`/api/amigos/pedidos/${idConvite}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ acao })
                        });

                        if (!respostaAcao.ok) {
                            throw new Error(`Erro ao ${acao} o convite: ${respostaAcao.status}`);
                        }

                        mensagem.remove();
                    } catch (erro) {
                        console.error(`Não foi possível ${acao} o convite.`, erro);
                        botao.disabled = false;
                    }
                });
            });

            if (idConvite === undefined || idConvite === null) {
                aceitar.disabled = true;
                recusar.disabled = true;
            }

            mensagem.append(texto, aceitar, recusar);
            lista.appendChild(mensagem);
        });
    } catch (erro) {
        console.error('Não foi possível carregar os convites.', erro);
        lista.replaceChildren();
    }
}

async function enviarConvite() {
    const emailConvite = document.getElementById('emailDigitado')?.value.trim();
    const emailUsuario = document.getElementById('emailUsuario')?.value.trim();

    if (!emailConvite || !emailUsuario) {
        console.error('Os e-mails são obrigatórios.');
        return false;
    }

    if (!(await verificarConvite())) return false;

    try {
        const resposta = await fetch('/api/amigos/adicionar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                convite_amizade: emailConvite,
                email_usuario: emailUsuario
            })
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao enviar convite: ${resposta.status}`);
        }

        return true;
    } catch (erro) {
        console.error('Não foi possível enviar o convite.', erro);
        return false;
    }
}

async function verificarConvite() {
    const emailConvite = document.getElementById('emailDigitado')?.value.trim().toLowerCase();

    if (!emailConvite) return false;

    try {
        const resposta = await fetch('/api/usuarios');

        if (!resposta.ok) {
            throw new Error(`Erro ao buscar usuários: ${resposta.status}`);
        }

        const dados = await resposta.json();
        const usuarios = Array.isArray(dados) ? dados : [];

        return usuarios.some(usuario => {
            const email = typeof usuario === 'string'
                ? usuario
                : usuario.email ?? usuario.email_usuario ?? usuario['e-mail'];

            return typeof email === 'string' &&
                email.trim().toLowerCase() === emailConvite;
        });
    } catch (erro) {
        console.error('Não foi possível verificar o usuário.', erro);
        return false;
    }
}