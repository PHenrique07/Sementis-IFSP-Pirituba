// Funcionalidades da tela de Perfil

document.addEventListener('DOMContentLoaded', () => {
    // 0. Funcionalidade de Foto de Perfil
    const avatarContainer = document.getElementById('avatar-container');
    const avatarMenu = document.getElementById('avatar-menu');
    const btnAddPhoto = document.getElementById('btn-add-photo');
    const btnRemovePhoto = document.getElementById('btn-remove-photo');
    const fileInputAvatar = document.getElementById('file-input-avatar');
    const profilePicture = document.getElementById('profile-picture');
    const defaultAvatarSrc = 'assets/icons/icone_usuario.png';

    if (avatarContainer && avatarMenu) {
        // Toggle menu ao clicar no avatar
        avatarContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            avatarMenu.classList.toggle('active');
            const isExpanded = avatarMenu.classList.contains('active');
            avatarContainer.setAttribute('aria-expanded', isExpanded);
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!avatarMenu.contains(e.target) && !avatarContainer.contains(e.target)) {
                avatarMenu.classList.remove('active');
                avatarContainer.setAttribute('aria-expanded', 'false');
            }
        });

        // Adicionar foto (abre seletor de arquivos)
        btnAddPhoto.addEventListener('click', () => {
            fileInputAvatar.click();
            avatarMenu.classList.remove('active');
        });

        // Ler arquivo selecionado e atualizar imagem
        fileInputAvatar.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePicture.src = event.target.result;
                    avatarContainer.classList.add('has-custom-photo');
                };
                reader.readAsDataURL(file);
            }
        });

        // Remover foto (volta ao default)
        btnRemovePhoto.addEventListener('click', () => {
            profilePicture.src = defaultAvatarSrc;
            avatarContainer.classList.remove('has-custom-photo');
            fileInputAvatar.value = ''; // limpa o input
            avatarMenu.classList.remove('active');
        });
    }

    // 1. Funcionalidade de Compartilhar
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'Meu Progresso no Sementis',
                text: 'Estou no Level 12 no Sementis com uma sequência de 30 dias! Venha aprender sobre sustentabilidade comigo!',
                url: window.location.origin + window.location.pathname
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    // Fallback para cópia
                    await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                    alert('Link copiado para a área de transferência!');
                }
            } catch (err) {
                console.log('Erro ao compartilhar:', err);
            }
        });
    }

    // 2. Modal de Seja PRO
    const proBtn = document.querySelector('.pro-btn');
    const proModal = document.getElementById('pro-modal');
    const closeProModalBtn = document.querySelector('.close-modal-btn');
    const proTrialBtn = document.querySelector('.pro-trial-btn');

    if (proBtn && proModal) {
        proBtn.addEventListener('click', () => {
            proModal.classList.add('active');
        });
    }

    if (closeProModalBtn && proModal) {
        closeProModalBtn.addEventListener('click', () => {
            proModal.classList.remove('active');
        });
    }

    if (proModal) {
        proModal.addEventListener('click', (e) => {
            if (e.target === proModal) {
                proModal.classList.remove('active');
            }
        });
    }

    if (proTrialBtn) {
        proTrialBtn.addEventListener('click', () => {
            alert('Parabéns! Seu período de teste grátis do Sementis PRO foi ativado!');
            proModal.classList.remove('active');
            proBtn.textContent = 'SEJA PRO - Ativado';
            proBtn.style.backgroundColor = 'var(--color-success)';
        });
    }

    // 3. Adicionar Biografia
    const addBioBtn = document.querySelector('.add-bio-btn');
    if (addBioBtn) {
        addBioBtn.addEventListener('click', () => {
            const bio = prompt('Digite sua nova biografia:');
            if (bio && bio.trim() !== '') {
                addBioBtn.textContent = bio;
                addBioBtn.style.textDecoration = 'none';
                addBioBtn.style.color = 'var(--color-white)';
                addBioBtn.style.fontSize = '12px';
                addBioBtn.style.maxWidth = '250px';
                addBioBtn.style.textAlign = 'center';
            }
        });
    }

    // 4. Configurações
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            alert('Tela de configurações estará disponível na próxima atualização!');
        });
    }

    // =========================================================================
    // 5. AMIGOS: LISTA HORIZONTAL & WINDOW MODAL SEMENTIS
    // =========================================================================

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const perfilFriendsList = document.getElementById('perfil-friends-list');
    const btnOpenAddFriends = document.getElementById('btn-open-add-friends');
    const btnAddFriendCircle = document.getElementById('btn-add-friend-circle');

    const sementisFriendModal = document.getElementById('modal-adicionar-amigos');
    const btnCloseSementisModal = document.getElementById('btn-fechar-modal-sementis');
    const sfTabAdicionar = document.getElementById('sf-tab-adicionar');
    const sfTabPedidos = document.getElementById('sf-tab-pedidos');
    const sfViewAdicionar = document.getElementById('sf-view-adicionar');
    const sfViewPedidos = document.getElementById('sf-view-pedidos');
    const sfBadgePedidos = document.getElementById('sf-badge-pedidos');

    const sfMeuIdentificador = document.getElementById('sf-meu-identificador');
    const sfBtnCopiarId = document.getElementById('sf-btn-copiar-id');
    const sfCopyStatus = document.getElementById('sf-copy-status');

    const sfFormEnviar = document.getElementById('sf-form-enviar');
    const sfInputAmigo = document.getElementById('sf-input-amigo');
    const sfFeedback = document.getElementById('sf-feedback');
    const sfBtnEnviarPedido = document.getElementById('sf-btn-enviar-pedido');
    const sfListaPedidos = document.getElementById('sf-lista-pedidos');

    function getAuthHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        const t = localStorage.getItem('token');
        if (t) headers['Authorization'] = 'Bearer ' + t;
        return headers;
    }

    // 1. Carregar Amigos no Perfil (Estilo Horizontal Original)
    async function carregarAmigosPerfil() {
        if (!perfilFriendsList) return;

        // Placeholder padrão do "+"
        const placeholderHTML = `
            <div class="friend-placeholder" id="btn-add-friend-circle" title="Adicionar amigo">
                <div class="friend-avatar-placeholder"></div>
            </div>
        `;

        if (!token) {
            perfilFriendsList.innerHTML = placeholderHTML;
            ativarClicksAbertura();
            return;
        }

        try {
            const resp = await fetch('/api/amigos', {
                headers: getAuthHeaders()
            });

            if (!resp.ok) throw new Error('Erro ao buscar amigos');

            const amigos = await resp.json();

            if (!Array.isArray(amigos) || amigos.length === 0) {
                perfilFriendsList.innerHTML = placeholderHTML;
                ativarClicksAbertura();
                return;
            }

            // Monta avatares circulares de amigos + placeholder no final
            const amigosHTML = amigos.map(amigo => {
                const avatar = amigo.avatar_url || '/assets/icons/icone_usuario.png';
                const primeiroNome = (amigo.nome || 'Amigo').split(' ')[0];
                return `
                    <div class="friend-item-circle" title="${amigo.nome} (Nv. ${amigo.nivel || 1})">
                        <img src="${avatar}" alt="${amigo.nome}" class="friend-item-avatar" onerror="this.src='/assets/icons/icone_usuario.png'">
                        <span class="friend-item-name">${primeiroNome}</span>
                    </div>
                `;
            }).join('');

            perfilFriendsList.innerHTML = amigosHTML + placeholderHTML;
            ativarClicksAbertura();

        } catch (err) {
            console.error('Erro ao listar amigos no perfil:', err);
            perfilFriendsList.innerHTML = placeholderHTML;
            ativarClicksAbertura();
        }
    }

    function ativarClicksAbertura() {
        const circle = document.getElementById('btn-add-friend-circle');
        if (circle) {
            circle.onclick = abrirModalSementisAmigos;
        }
    }

    // 2. Abertura e Fechamento da Janela/Modal
    window.abrirModalSementisAmigos = function() {
        if (!sementisFriendModal) return;

        // Popula o identificador do próprio usuário
        if (sfMeuIdentificador) {
            const email = user.email || 'seu-email';
            const id = user.id ? `ID #${user.id}` : '';
            sfMeuIdentificador.textContent = id ? `${email} (${id})` : email;
        }

        // Limpa campos
        if (sfInputAmigo) sfInputAmigo.value = '';
        if (sfFeedback) {
            sfFeedback.style.display = 'none';
            sfFeedback.textContent = '';
            sfFeedback.className = 'sf-feedback-msg';
        }

        // Exibe aba Adicionar por padrão
        trocarAbaModalAmigos('adicionar');

        // Abre modal
        sementisFriendModal.classList.add('active');
        setTimeout(() => sfInputAmigo?.focus(), 120);

        // Atualiza pedidos em background
        carregarPedidosModal();
    };

    window.fecharModalSementisAmigos = function() {
        if (sementisFriendModal) sementisFriendModal.classList.remove('active');
    };

    if (btnOpenAddFriends) {
        btnOpenAddFriends.addEventListener('click', abrirModalSementisAmigos);
    }
    if (btnCloseSementisModal) {
        btnCloseSementisModal.addEventListener('click', fecharModalSementisAmigos);
    }
    if (sementisFriendModal) {
        sementisFriendModal.addEventListener('click', (e) => {
            if (e.target === sementisFriendModal) fecharModalSementisAmigos();
        });
    }

    // 3. Alternar Abas no Modal
    window.trocarAbaModalAmigos = function(aba) {
        if (aba === 'adicionar') {
            sfTabAdicionar?.classList.add('active');
            sfTabPedidos?.classList.remove('active');
            if (sfViewAdicionar) sfViewAdicionar.style.display = 'block';
            if (sfViewPedidos) sfViewPedidos.style.display = 'none';
        } else {
            sfTabPedidos?.classList.add('active');
            sfTabAdicionar?.classList.remove('active');
            if (sfViewPedidos) sfViewPedidos.style.display = 'block';
            if (sfViewAdicionar) sfViewAdicionar.style.display = 'none';
            carregarPedidosModal();
        }
    };

    if (sfTabAdicionar) {
        sfTabAdicionar.addEventListener('click', () => trocarAbaModalAmigos('adicionar'));
    }
    if (sfTabPedidos) {
        sfTabPedidos.addEventListener('click', () => trocarAbaModalAmigos('pedidos'));
    }

    // 4. Copiar Meu Código
    if (sfBtnCopiarId) {
        sfBtnCopiarId.addEventListener('click', async () => {
            const texto = user.email || user.id || '';
            if (!texto) return;

            try {
                await navigator.clipboard.writeText(String(texto));
                if (sfCopyStatus) sfCopyStatus.textContent = 'Copiado!';
                setTimeout(() => {
                    if (sfCopyStatus) sfCopyStatus.textContent = 'Copiar';
                }, 1800);
            } catch (e) {
                console.error('Falha ao copiar:', e);
            }
        });
    }

    // 5. Enviar Convite de Amigo
    if (sfFormEnviar) {
        sfFormEnviar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const alvo = sfInputAmigo?.value.trim();
            if (!alvo) return;

            if (sfBtnEnviarPedido) {
                sfBtnEnviarPedido.disabled = true;
                sfBtnEnviarPedido.innerHTML = `<span>ENVIANDO...</span>`;
            }

            if (sfFeedback) sfFeedback.style.display = 'none';

            try {
                const isNum = /^\d+$/.test(alvo);
                const payload = isNum ? { id: parseInt(alvo, 10) } : { email: alvo };

                const resp = await fetch('/api/amigos/adicionar', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload)
                });

                const dados = await resp.json();

                if (resp.ok && dados.status === 'sucesso') {
                    if (sfFeedback) {
                        sfFeedback.className = 'sf-feedback-msg sucesso';
                        sfFeedback.textContent = dados.mensagem || 'Convite enviado com sucesso!';
                        sfFeedback.style.display = 'block';
                    }
                    if (sfInputAmigo) sfInputAmigo.value = '';

                    setTimeout(() => {
                        fecharModalSementisAmigos();
                    }, 1600);
                } else {
                    if (sfFeedback) {
                        sfFeedback.className = 'sf-feedback-msg erro';
                        sfFeedback.textContent = dados.mensagem || 'Não foi possível enviar o convite.';
                        sfFeedback.style.display = 'block';
                    }
                }
            } catch (err) {
                console.error('Erro ao enviar pedido de amigo:', err);
                if (sfFeedback) {
                    sfFeedback.className = 'sf-feedback-msg erro';
                    sfFeedback.textContent = 'Erro de conexão com o servidor.';
                    sfFeedback.style.display = 'block';
                }
            } finally {
                if (sfBtnEnviarPedido) {
                    sfBtnEnviarPedido.disabled = false;
                    sfBtnEnviarPedido.innerHTML = `<span>ENVIAR CONVITE</span>`;
                }
            }
        });
    }

    // 6. Carregar Pedidos Recebidos
    async function carregarPedidosModal() {
        if (!sfListaPedidos || !token) return;

        try {
            const resp = await fetch('/api/amigos/pedidos', {
                headers: getAuthHeaders()
            });

            if (!resp.ok) throw new Error('Erro ao buscar pedidos');

            const pedidos = await resp.json();
            const total = Array.isArray(pedidos) ? pedidos.length : 0;

            if (sfBadgePedidos) {
                if (total > 0) {
                    sfBadgePedidos.textContent = total;
                    sfBadgePedidos.style.display = 'inline-block';
                } else {
                    sfBadgePedidos.style.display = 'none';
                }
            }

            if (!Array.isArray(pedidos) || pedidos.length === 0) {
                sfListaPedidos.innerHTML = `
                    <div class="sf-empty-reqs">
                        <p>Nenhum convite pendente no momento.</p>
                    </div>
                `;
                return;
            }

            sfListaPedidos.innerHTML = pedidos.map(ped => {
                const avatar = ped.avatar_url || '/assets/icons/icone_usuario.png';
                const nivel = ped.nivel ?? 1;

                return `
                    <div class="sf-request-item" id="sf-req-${ped.amizade_id}">
                        <div class="sf-req-user">
                            <img src="${avatar}" alt="${ped.nome}" class="sf-req-avatar" onerror="this.src='/assets/icons/icone_usuario.png'">
                            <div class="sf-req-info">
                                <strong>${ped.nome}</strong>
                                <span>Nível ${nivel}</span>
                            </div>
                        </div>
                        <div class="sf-req-btns">
                            <button type="button" class="sf-btn-accept" onclick="responderConviteSementis(${ped.amizade_id}, 'aceitar')">
                                Aceitar
                            </button>
                            <button type="button" class="sf-btn-reject" onclick="responderConviteSementis(${ped.amizade_id}, 'rejeitar')">
                                Recusar
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (err) {
            console.error('Erro ao buscar convites recebidos:', err);
        }
    }

    // 7. Responder Convite (Aceitar / Recusar)
    window.responderConviteSementis = async function(amizadeId, acao) {
        const item = document.getElementById(`sf-req-${amizadeId}`);
        if (item) item.style.opacity = '0.5';

        const endpoint = acao === 'aceitar' ? '/api/amigos/aceitar' : '/api/amigos/rejeitar';

        try {
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ amizade_id: amizadeId })
            });

            const res = await resp.json();

            if (resp.ok && res.status === 'sucesso') {
                if (item) item.remove();
                carregarAmigosPerfil();
                carregarPedidosModal();
            } else {
                alert(res.mensagem || 'Erro ao responder convite.');
                if (item) item.style.opacity = '1';
            }
        } catch (e) {
            console.error(e);
            alert('Erro de conexão ao responder.');
            if (item) item.style.opacity = '1';
        }
    };

    // Inicialização
    carregarAmigosPerfil();
    carregarPedidosModal();
});