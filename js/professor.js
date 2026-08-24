// ===== Gerenciamento de turmas do professor =====

// Isola as funcoes e o estado deste script no escopo local da pagina.
(function () {
    'use strict';

    const seletores = {
        formulario: '#formCriarTurma, #criarTurmaForm, form[data-acao="criar-turma"]',
        nome: '#nomeTurma, #turmaNome, input[name="nome"]',
        formularioEntrar: '#formEntrarTurma, #entrarTurmaForm, form[data-acao="entrar-turma"]',
        codigoConvite: '#codigoConvite, #codigoTurma, input[name="codigo_convite"]',
        lista: '#listaTurmas, #turmasList, [data-lista="turmas"]',
        ranking: '#rankingTurma, #rankingList, [data-ranking="turma"]'
    };

    // Le o token salvo no navegador; nao recebe argumentos nem altera o estado.
    function obterToken() {
        return localStorage.getItem('token');
    }

    // Le o tipo do usuario salvo no navegador com seguranca.
    function obterTipoUsuario() {
        const usuarioSalvo = localStorage.getItem('user');
        if (!usuarioSalvo) return null;

        try {
            const usuario = JSON.parse(usuarioSalvo);
            return usuario && (usuario.tipo || usuario.tipo_usuario) || null;
        } catch (erro) {
            return null;
        }
    }

    // Remove os dados de autenticacao e envia o usuario para a tela de login.
    function redirecionarParaLogin() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    // Recebe a URL e as opcoes da requisicao, adiciona o token e retorna o JSON da API.
    // Em falhas de autenticacao, limpa a sessao e redireciona para o login.
    async function requisicaoApi(url, opcoes) {
        const token = obterToken();
        if (!token) {
            redirecionarParaLogin();
            return null;
        }

        const resposta = await fetch(url, {
            ...opcoes,
            headers: {
                ...(opcoes && opcoes.headers),
                Authorization: 'Bearer ' + token
            }
        });

        if (resposta.status === 401) {
            redirecionarParaLogin();
            return null;
        }

        if (!resposta.ok) {
            throw new Error('Erro na API: ' + resposta.status);
        }

        return resposta.json();
    }

    // Recebe uma resposta e uma chave, normalizando diferentes formatos para uma lista.
    function obterLista(resposta, chave) {
        if (Array.isArray(resposta)) return resposta;
        if (!resposta || typeof resposta !== 'object') return [];
        if (resposta && Array.isArray(resposta.data)) {
            return resposta.data;
        }
        return [];
    }

    // Busca a primeira chave valida no objeto e retorna o padrao quando nenhuma existe.
    function valor(objeto, chaves, padrao) {
        for (const chave of chaves) {
            if (objeto && objeto[chave] !== undefined && objeto[chave] !== null) {
                return objeto[chave];
            }
        }
        return padrao;
    }

    // Recebe um valor e cria um elemento span com seu texto, sem interpretar HTML.
    function criarTexto(texto) {
        const elemento = document.createElement('span');
        elemento.textContent = String(texto);
        return elemento;
    }

    // Recebe os dados das turmas e atualiza a lista visual com nome, codigo e detalhes.
    function renderizarTurmas(resposta) {
        const lista = document.querySelector(seletores.lista);
        if (!lista) return;

        lista.textContent = '';
        const turmas = obterLista(resposta, 'turmas');

        // Recebe cada turma da lista e cria seus elementos correspondentes no DOM.
        turmas.forEach((turma) => {
            const idTurma = valor(turma, ['id', 'id_turma', 'turma_id'], '');
            const item = document.createElement('div');
            item.dataset.turmaId = String(idTurma);

            const nome = criarTexto(valor(turma, ['nome', 'nome_turma'], 'Turma sem nome'));
            const codigo = criarTexto(valor(turma, ['codigo_convite', 'codigo'], ''));
            const detalhes = document.createElement('button');
            detalhes.type = 'button';
            detalhes.dataset.turmaId = String(idTurma);
            detalhes.textContent = 'Detalhes';

            item.append(nome);
            if (codigo.textContent) {
                item.append(document.createTextNode(' - Código: '), codigo);
            }
            item.append(document.createTextNode(' '), detalhes);
            lista.appendChild(item);
        });
    }

    // Recebe os dados do ranking e preenche a lista visual com posicao, nome e XP.
    function renderizarRanking(resposta) {
        const lista = document.querySelector(seletores.ranking);
        if (!lista) return;

        lista.textContent = '';
        const ranking = obterLista(resposta, 'ranking');

        // Recebe cada aluno e seu indice para montar uma linha ordenada do ranking.
        ranking.forEach((aluno, indice) => {
            const item = document.createElement('li');
            const nome = valor(aluno, ['nome', 'nome_aluno'], 'Aluno');
            const xp = valor(aluno, ['xp', 'xp_semanal', 'pontuacao'], 0);
            item.append(
                document.createTextNode((indice + 1) + '. '),
                criarTexto(nome),
                document.createTextNode(' - XP '),
                criarTexto(xp)
            );
            lista.appendChild(item);
        });
    }

    // Consulta as turmas conforme o tipo de usuario e solicita sua renderizacao.
    async function carregarTurmas(tipoUsuario) {
            const tipo = tipoUsuario || obterTipoUsuario();
            if (tipo !== 'aluno' && tipo !== 'professor') {
                console.error('Tipo de usuario ausente ou desconhecido.');
                return;
            }
        const rota = tipo === 'aluno' ? '/api/turmas/minhas' : '/api/turmas';

        try {
            const dados = await requisicaoApi(rota, { method: 'GET' });
            if (dados) renderizarTurmas(dados);
        } catch (erro) {
            console.error('Erro ao carregar turmas:', erro);
        }
    }

    // Recebe o evento do formulario, envia o nome informado e recarrega as turmas criadas.
    async function criarTurma(evento) {
        evento.preventDefault();
        const campoNome = document.querySelector(seletores.nome);
        const nome = campoNome ? campoNome.value.trim() : '';
        if (!nome) return;

        try {
            const dados = await requisicaoApi('/api/turmas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome })
            });
            if (dados) {
                evento.currentTarget.reset();
                await carregarTurmas('professor');
            }
        } catch (erro) {
            console.error('Erro ao criar turma:', erro);
        }
    }

    // Recebe o codigo de convite informado pelo aluno e solicita sua entrada na turma.
    async function entrarNaTurma(evento) {
        evento.preventDefault();
        const campoCodigo = document.querySelector(seletores.codigoConvite);
        const codigoDigitado = campoCodigo ? campoCodigo.value.trim() : '';

        // Evita enviar uma requisicao quando o campo nao foi preenchido.
        if (!codigoDigitado) {
            alert('Informe o codigo de convite da turma.');
            return;
        }

        try {
            const dados = await requisicaoApi('/api/turmas/entrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo_convite: codigoDigitado })
            });
            if (dados) {
                evento.currentTarget.reset();
                await carregarTurmas('aluno');
            }
        } catch (erro) {
            console.error('Erro ao entrar na turma:', erro);
        }
    }

    // Recebe o identificador da turma, consulta seu ranking e atualiza a exibicao.
    async function carregarRanking(idTurma) {
        if (!idTurma) return;
        try {
            const dados = await requisicaoApi('/api/turmas/' + encodeURIComponent(idTurma) + '/ranking', {
                method: 'GET'
            });
            if (dados) renderizarRanking(dados);
        } catch (erro) {
            console.error('Erro ao carregar ranking da turma:', erro);
        }
    }

    // Executa a inicializacao dos formularios, cliques e dados quando o DOM termina de carregar.
    document.addEventListener('DOMContentLoaded', () => {
        const formulario = document.querySelector(seletores.formulario);
        if (formulario) formulario.addEventListener('submit', criarTurma);
        const formularioEntrar = document.querySelector(seletores.formularioEntrar);
        if (formularioEntrar) formularioEntrar.addEventListener('submit', entrarNaTurma);

        // Recebe cada clique do documento e carrega o ranking da turma identificada no alvo.
        document.addEventListener('click', (evento) => {
            const elemento = evento.target.closest('[data-turma-id]');
            if (elemento) carregarRanking(elemento.dataset.turmaId);
        });

        carregarTurmas();
    });
})();
