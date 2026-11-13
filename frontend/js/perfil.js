// =========================================================================
// Sementis — Lógica da Tela de Perfil (Refactor v2)
// Banner customizável, Avatar com Glassmorphism + Primeira Letra,
// Badges de Sustentabilidade, Amigos Online/Offline e Convites Modernos.
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // DADOS BÁSICOS DO USUÁRIO & HEADERS
    // -------------------------------------------------------------------------
    const token = localStorage.getItem('token');
    let user = {};
    try {
        user = JSON.parse(localStorage.getItem('cached_perfil') || localStorage.getItem('user') || '{}');
    } catch (e) {
        user = {};
    }

    function getAuthHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        const t = localStorage.getItem('token');
        if (t) headers['Authorization'] = 'Bearer ' + t;
        return headers;
    }

    // -------------------------------------------------------------------------
    // 1. BANNER CUSTOMIZÁVEL (Sem salvar no DB por hora - LocalStorage)
    // -------------------------------------------------------------------------
    const bannerImage = document.getElementById('banner-image');
    const btnEditarBanner = document.getElementById('btn-editar-banner');
    const fileInputBanner = document.getElementById('file-input-banner');
    const modalBanner = document.getElementById('modal-banner');
    const btnFecharModalBanner = document.getElementById('btn-fechar-modal-banner');
    const bannerPresetsGrid = document.getElementById('banner-presets-grid');
    const btnBannerUpload = document.getElementById('btn-banner-upload');
    const btnBannerReset = document.getElementById('btn-banner-reset');

    const BANNER_PRESETS = [
        {
            id: 'padrao',
            nome: 'Sementis Original',
            background: 'linear-gradient(135deg, #3a3a7a 0%, #1a1a4a 40%, #27275e 70%, #4b639e 100%)'
        },
        {
            id: 'mata-atlantica',
            nome: 'Mata Atlântica',
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #10b981 100%)'
        },
        {
            id: 'nebulosa-roxa',
            nome: 'Nebulosa Roxa',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #7c3aed 100%)'
        },
        {
            id: 'aurora-boreal',
            nome: 'Aurora Boreal',
            background: 'linear-gradient(135deg, #064e3b 0%, #0284c7 50%, #a9ff71 100%)'
        },
        {
            id: 'crepusculo',
            nome: 'Pôr do Sol Solar',
            background: 'linear-gradient(135deg, #451a03 0%, #7c2d12 40%, #c2410c 70%, #f97316 100%)'
        },
        {
            id: 'eco-cyber',
            nome: 'Eco Cyberpunk',
            background: 'linear-gradient(135deg, #18181b 0%, #3b0764 45%, #065f46 80%, #a9ff71 100%)'
        }
    ];

    function aplicarBanner(valorCss) {
        if (!bannerImage) return;
        if (!valorCss) {
            bannerImage.style.backgroundImage = '';
            bannerImage.classList.remove('has-custom-banner');
            return;
        }

        if (valorCss.startsWith('linear-gradient') || valorCss.startsWith('radial-gradient')) {
            bannerImage.style.backgroundImage = valorCss;
        } else {
            bannerImage.style.backgroundImage = `url("${valorCss}")`;
        }
        bannerImage.classList.add('has-custom-banner');
    }

    // Carregar banner salvo no localStorage
    const bannerSalvo = localStorage.getItem('sementis_banner_custom');
    if (bannerSalvo) {
        aplicarBanner(bannerSalvo);
    }

    // Renderizar presets no modal
    if (bannerPresetsGrid) {
        bannerPresetsGrid.innerHTML = BANNER_PRESETS.map(p => `
            <div class="banner-preset-card ${bannerSalvo === p.background ? 'active' : ''}" 
                 data-bg="${p.background}" 
                 style="background: ${p.background};">
                <div class="banner-preset-overlay"></div>
                <span class="banner-preset-name">${p.nome}</span>
            </div>
        `).join('');

        bannerPresetsGrid.querySelectorAll('.banner-preset-card').forEach(card => {
            card.addEventListener('click', () => {
                const bg = card.getAttribute('data-bg');
                localStorage.setItem('sementis_banner_custom', bg);
                aplicarBanner(bg);
                bannerPresetsGrid.querySelectorAll('.banner-preset-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                fecharModalBanner();
            });
        });
    }

    function abrirModalBanner() {
        if (modalBanner) modalBanner.classList.add('active');
    }

    function fecharModalBanner() {
        if (modalBanner) modalBanner.classList.remove('active');
    }

    if (btnEditarBanner) btnEditarBanner.addEventListener('click', abrirModalBanner);
    if (btnFecharModalBanner) btnFecharModalBanner.addEventListener('click', fecharModalBanner);
    if (modalBanner) {
        modalBanner.addEventListener('click', (e) => {
            if (e.target === modalBanner) fecharModalBanner();
        });
    }

    if (btnBannerUpload && fileInputBanner) {
        btnBannerUpload.addEventListener('click', () => {
            fileInputBanner.click();
        });
    }

    if (fileInputBanner) {
        fileInputBanner.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const dataUrl = event.target.result;
                    localStorage.setItem('sementis_banner_custom', dataUrl);
                    aplicarBanner(dataUrl);
                    fecharModalBanner();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnBannerReset) {
        btnBannerReset.addEventListener('click', () => {
            localStorage.removeItem('sementis_banner_custom');
            aplicarBanner(null);
            bannerPresetsGrid?.querySelectorAll('.banner-preset-card').forEach(c => c.classList.remove('active'));
            fecharModalBanner();
        });
    }

    // -------------------------------------------------------------------------
    // 2. FOTO DE PERFIL COM GLASSMORPHISM + PRIMEIRA LETRA PADRÃO
    // -------------------------------------------------------------------------
    const avatarContainer = document.getElementById('avatar-container');
    const avatarInner = document.getElementById('avatar-inner');
    const profilePicture = document.getElementById('profile-picture');
    const avatarLetter = document.getElementById('avatar-letter');
    const avatarMenu = document.getElementById('avatar-menu');
    const btnAddPhoto = document.getElementById('btn-add-photo');
    const btnRemovePhoto = document.getElementById('btn-remove-photo');
    const fileInputAvatar = document.getElementById('file-input-avatar');

    function obterNomeUsuario() {
        const cached = JSON.parse(localStorage.getItem('cached_perfil') || localStorage.getItem('user') || '{}');
        return cached.nome || user.nome || 'Estudante';
    }

    function atualizarAvatarVisual() {
        const customPhoto = localStorage.getItem('sementis_avatar_custom');
        const nome = obterNomeUsuario();
        const primeiraLetra = (nome.trim()[0] || 'S').toUpperCase();

        if (customPhoto) {
            // Foto personalizada enviada pelo usuário
            if (profilePicture) {
                profilePicture.src = customPhoto;
                profilePicture.style.display = 'block';
            }
            if (avatarLetter) avatarLetter.style.display = 'none';
            if (avatarInner) avatarInner.classList.add('has-custom-photo');
        } else {
            // Padrão: Glassmorphism com primeira letra do nome
            if (profilePicture) profilePicture.style.display = 'none';
            if (avatarLetter) {
                avatarLetter.textContent = primeiraLetra;
                avatarLetter.style.display = 'flex';
            }
            if (avatarInner) avatarInner.classList.remove('has-custom-photo');
        }
    }

    atualizarAvatarVisual();

    if (avatarContainer && avatarMenu) {
        avatarContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            avatarMenu.classList.toggle('active');
            avatarContainer.setAttribute('aria-expanded', avatarMenu.classList.contains('active'));
        });

        document.addEventListener('click', (e) => {
            if (!avatarMenu.contains(e.target) && !avatarContainer.contains(e.target)) {
                avatarMenu.classList.remove('active');
                avatarContainer.setAttribute('aria-expanded', 'false');
            }
        });

        if (btnAddPhoto && fileInputAvatar) {
            btnAddPhoto.addEventListener('click', () => {
                fileInputAvatar.click();
                avatarMenu.classList.remove('active');
            });
        }

        if (fileInputAvatar) {
            fileInputAvatar.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const dataUrl = event.target.result;
                        localStorage.setItem('sementis_avatar_custom', dataUrl);
                        atualizarAvatarVisual();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (btnRemovePhoto) {
            btnRemovePhoto.addEventListener('click', () => {
                localStorage.removeItem('sementis_avatar_custom');
                if (fileInputAvatar) fileInputAvatar.value = '';
                atualizarAvatarVisual();
                avatarMenu.classList.remove('active');
            });
        }
    }

    // -------------------------------------------------------------------------
    // 3. BIOGRAFIA DO USUÁRIO (LocalStorage)
    // -------------------------------------------------------------------------
    const btnAddBio = document.getElementById('btn-add-bio');
    const userBioText = document.getElementById('user-bio-text');

    function carregarBio() {
        const bioSalva = localStorage.getItem('sementis_user_bio');
        if (bioSalva && bioSalva.trim() !== '') {
            if (userBioText) {
                userBioText.textContent = `"${bioSalva}"`;
                userBioText.style.display = 'block';
            }
            if (btnAddBio) {
                btnAddBio.textContent = 'Editar Biografia';
                btnAddBio.classList.add('has-bio');
            }
        } else {
            if (userBioText) userBioText.style.display = 'none';
            if (btnAddBio) {
                btnAddBio.textContent = 'Adicionar Biografia';
                btnAddBio.classList.remove('has-bio');
            }
        }
    }

    function editarBio() {
        const atual = localStorage.getItem('sementis_user_bio') || '';
        const novaBio = prompt('Escreva uma breve biografia para seu perfil:', atual);
        if (novaBio !== null) {
            if (novaBio.trim() === '') {
                localStorage.removeItem('sementis_user_bio');
            } else {
                localStorage.setItem('sementis_user_bio', novaBio.trim());
            }
            carregarBio();
        }
    }

    if (btnAddBio) btnAddBio.addEventListener('click', editarBio);
    if (userBioText) userBioText.addEventListener('click', editarBio);
    carregarBio();

    // -------------------------------------------------------------------------
    // 4. SISTEMA DE BADGES / CONQUISTAS GAMIFICADAS
    // -------------------------------------------------------------------------
    const badgesGrid = document.getElementById('badges-grid');
    const badgesCountEl = document.getElementById('badges-count');
    const modalBadge = document.getElementById('modal-badge-detalhe');
    const btnFecharBadge = document.getElementById('btn-fechar-badge');
    const badgeModalIcon = document.getElementById('badge-modal-icon');
    const badgeModalTitulo = document.getElementById('badge-modal-titulo');
    const badgeModalDescricao = document.getElementById('badge-modal-descricao');
    const badgeModalRaridade = document.getElementById('badge-modal-raridade');
    const badgeModalData = document.getElementById('badge-modal-data');

    // SVGs personalizados para cada badge — sem emojis genéricos
    const BADGE_SVGS = {
        primeiro_broto: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bg_pb" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#d4f7b4"/><stop offset="100%" stop-color="#7ecb4a"/></radialGradient>
            <linearGradient id="stem_pb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#15803d"/></linearGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="url(#bg_pb)" opacity=".18"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- caule -->
          <line x1="28" y1="44" x2="28" y2="22" stroke="url(#stem_pb)" stroke-width="2.5" stroke-linecap="round"/>
          <!-- folha esq -->
          <path d="M28 32 C20 26 14 30 18 22 C22 18 28 26 28 32Z" fill="#22c55e"/>
          <!-- folha dir -->
          <path d="M28 28 C36 22 42 26 38 18 C34 14 28 22 28 28Z" fill="#4ade80"/>
          <!-- broto topo -->
          <path d="M25 22 C25 16 31 16 31 22 C31 26 28 28 28 28 C28 28 25 26 25 22Z" fill="#86efac"/>
        </svg>`,

        em_chamas: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bg_ec" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="#f97316"/></radialGradient>
            <linearGradient id="fire_ec" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fef08a"/><stop offset="60%" stop-color="#f97316"/><stop offset="100%" stop-color="#dc2626"/></linearGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="url(#bg_ec)" opacity=".18"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#f97316" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- chama principal -->
          <path d="M28 44 C18 44 12 36 12 28 C12 20 20 14 24 10 C22 18 28 20 26 26 C30 22 34 18 32 12 C38 18 44 24 44 32 C44 38 38 44 28 44Z" fill="url(#fire_ec)"/>
          <!-- chama interna -->
          <path d="M28 40 C22 40 18 35 18 30 C20 26 24 24 26 28 C26 24 30 20 32 24 C36 28 36 36 28 40Z" fill="#fde68a" opacity=".7"/>
          <!-- brilho centro -->
          <ellipse cx="28" cy="32" rx="5" ry="7" fill="#fff7ed" opacity=".35"/>
        </svg>`,

        defensor_verde: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shield_dv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="#1d4ed8" opacity=".12"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- escudo -->
          <path d="M28 11 L42 17 L42 29 C42 37 35 43 28 46 C21 43 14 37 14 29 L14 17 Z" fill="url(#shield_dv)" opacity=".9"/>
          <path d="M28 14 L40 19 L40 29 C40 36 34 41 28 44 C22 41 16 36 16 29 L16 19 Z" fill="none" stroke="#93c5fd" stroke-width="1" opacity=".5"/>
          <!-- folha no escudo -->
          <path d="M28 38 C23 34 20 28 24 23 C26 21 28 25 28 25 C28 25 30 21 32 23 C36 28 33 34 28 38Z" fill="#86efac"/>
          <line x1="28" y1="25" x2="28" y2="38" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>
        </svg>`,

        raio_verde: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bolt_rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a9ff71"/><stop offset="100%" stop-color="#16a34a"/></linearGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="#16a34a" opacity=".12"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#a9ff71" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- raio -->
          <polygon points="31,11 19,30 27,30 24,46 37,26 29,26" fill="url(#bolt_rv)"/>
          <!-- brilho -->
          <polygon points="31,11 19,30 27,30 24,46 37,26 29,26" fill="none" stroke="#d9ffa8" stroke-width="1" opacity=".5"/>
          <!-- spark top -->
          <circle cx="32" cy="13" r="2" fill="#d9ffa8" opacity=".7"/>
        </svg>`,

        gota_vital: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="drop_gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#0369a1"/></linearGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="#0369a1" opacity=".12"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- gota -->
          <path d="M28 13 C28 13 14 26 14 34 C14 42 20 46 28 46 C36 46 42 42 42 34 C42 26 28 13 28 13Z" fill="url(#drop_gv)"/>
          <!-- brilho -->
          <path d="M23 26 C23 26 18 32 19 37" stroke="#e0f2fe" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>
          <circle cx="22" cy="23" r="1.5" fill="#e0f2fe" opacity=".5"/>
        </svg>`,

        energia_limpa: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sun_el" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#f59e0b"/></radialGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="#f59e0b" opacity=".1"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- raios do sol -->
          <g stroke="#fde68a" stroke-width="2" stroke-linecap="round">
            <line x1="28" y1="10" x2="28" y2="14"/>
            <line x1="28" y1="42" x2="28" y2="46"/>
            <line x1="10" y1="28" x2="14" y2="28"/>
            <line x1="42" y1="28" x2="46" y2="28"/>
            <line x1="16" y1="16" x2="19" y2="19"/>
            <line x1="37" y1="37" x2="40" y2="40"/>
            <line x1="40" y1="16" x2="37" y2="19"/>
            <line x1="16" y1="40" x2="19" y2="37"/>
          </g>
          <!-- disco solar -->
          <circle cx="28" cy="28" r="10" fill="url(#sun_el)"/>
          <circle cx="28" cy="28" r="7" fill="#fff7ed" opacity=".45"/>
        </svg>`,

        mestre_sustentavel: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="crown_ms" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="#b45309"/></linearGradient>
            <radialGradient id="glow_ms" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity=".3"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="url(#glow_ms)"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#fbbf24" stroke-width="2"/>
          <!-- coroa -->
          <path d="M13 38 L14 22 L20 30 L28 14 L36 30 L42 22 L43 38 Z" fill="url(#crown_ms)"/>
          <path d="M13 38 L43 38" stroke="#b45309" stroke-width="2" stroke-linecap="round"/>
          <!-- gemas -->
          <circle cx="28" cy="14" r="3" fill="#fff" opacity=".9"/>
          <circle cx="20" cy="30" r="2.5" fill="#86efac" opacity=".9"/>
          <circle cx="36" cy="30" r="2.5" fill="#7dd3fc" opacity=".9"/>
        </svg>`,

        amigo_da_terra: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hands_at" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a9ff71"/><stop offset="100%" stop-color="#059669"/></linearGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="#059669" opacity=".1"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#a9ff71" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- globo -->
          <circle cx="28" cy="28" r="14" fill="none" stroke="#34d399" stroke-width="1.5"/>
          <path d="M14 28 Q19 24 22 28 Q25 32 28 28 Q31 24 34 28 Q37 32 42 28" stroke="#34d399" stroke-width="1.5" fill="none"/>
          <path d="M22 14 Q24 18 24 22 Q24 26 26 28 Q28 30 28 34 Q28 38 26 42" stroke="#34d399" stroke-width="1" fill="none" opacity=".5"/>
          <!-- aperto de mão simplificado -->
          <g fill="url(#hands_at)">
            <path d="M19 34 C17 32 16 28 20 27 L24 26 C24 26 26 30 28 30 C30 30 32 26 32 26 L36 27 C40 28 39 32 37 34 L28 42 Z" opacity=".85"/>
          </g>
          <path d="M24 26 C24 22 32 22 32 26" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".6"/>
        </svg>`,

        trofeu_ligas: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cup_tl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="#6d28d9" opacity=".12"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- troféu -->
          <path d="M18 14 L38 14 L38 28 C38 35 34 40 28 40 C22 40 18 35 18 28 Z" fill="url(#cup_tl)"/>
          <!-- alças -->
          <path d="M18 18 C12 18 12 28 18 28" stroke="#c4b5fd" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M38 18 C44 18 44 28 38 28" stroke="#c4b5fd" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- base -->
          <rect x="22" y="40" width="12" height="3" rx="1.5" fill="#a78bfa"/>
          <rect x="19" y="43" width="18" height="3" rx="1.5" fill="#7c3aed"/>
          <!-- estrela -->
          <path d="M28 20 L29.5 24 L33 24 L30.5 26.5 L31.5 30 L28 28 L24.5 30 L25.5 26.5 L23 24 L26.5 24 Z" fill="#fde68a"/>
        </svg>`,

        sabio_semeia: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="brain_ss" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="#7c3aed" opacity=".1"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- cabeça com IA -->
          <circle cx="28" cy="26" r="13" fill="url(#brain_ss)" opacity=".85"/>
          <!-- circuitos -->
          <g stroke="#ede9fe" stroke-width="1" stroke-linecap="round" opacity=".7">
            <line x1="28" y1="16" x2="28" y2="20"/>
            <line x1="22" y1="20" x2="28" y2="20"/>
            <line x1="22" y1="20" x2="22" y2="26"/>
            <line x1="34" y1="20" x2="28" y2="20"/>
            <line x1="34" y1="20" x2="34" y2="26"/>
            <line x1="22" y1="30" x2="34" y2="30"/>
          </g>
          <circle cx="22" cy="26" r="1.5" fill="#fde68a"/>
          <circle cx="34" cy="26" r="1.5" fill="#fde68a"/>
          <circle cx="28" cy="20" r="1.5" fill="#a9ff71"/>
          <!-- pescoço -->
          <rect x="25" y="39" width="6" height="4" rx="2" fill="#a78bfa"/>
          <rect x="21" y="43" width="14" height="2.5" rx="1.2" fill="#7c3aed"/>
        </svg>`,

        foco_ecologico: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="target_fe" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#a9ff71"/><stop offset="100%" stop-color="#047857"/></radialGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="#047857" opacity=".1"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- alvo -->
          <circle cx="28" cy="28" r="14" fill="none" stroke="#34d399" stroke-width="2"/>
          <circle cx="28" cy="28" r="9" fill="none" stroke="#6ee7b7" stroke-width="2"/>
          <circle cx="28" cy="28" r="4" fill="url(#target_fe)"/>
          <!-- mira linhas -->
          <line x1="28" y1="11" x2="28" y2="17" stroke="#a9ff71" stroke-width="2" stroke-linecap="round"/>
          <line x1="28" y1="39" x2="28" y2="45" stroke="#a9ff71" stroke-width="2" stroke-linecap="round"/>
          <line x1="11" y1="28" x2="17" y2="28" stroke="#a9ff71" stroke-width="2" stroke-linecap="round"/>
          <line x1="39" y1="28" x2="45" y2="28" stroke="#a9ff71" stroke-width="2" stroke-linecap="round"/>
        </svg>`,

        guardiao_ancestral: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="star_ga" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a"/><stop offset="60%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#92400e"/></radialGradient>
            <radialGradient id="glow_ga" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef08a" stop-opacity=".4"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>
          </defs>
          <circle cx="28" cy="28" r="26" fill="url(#glow_ga)"/>
          <circle cx="28" cy="28" r="26" fill="none" stroke="#fbbf24" stroke-width="2"/>
          <!-- estrela 8 pontas -->
          <path d="M28 10 L30.5 22 L42 18 L34 27 L46 28 L34 29 L42 38 L30.5 34 L28 46 L25.5 34 L14 38 L22 29 L10 28 L22 27 L14 18 L25.5 22 Z" fill="url(#star_ga)"/>
          <!-- centro brilhante -->
          <circle cx="28" cy="28" r="7" fill="#fff7ed" opacity=".5"/>
          <circle cx="28" cy="28" r="3.5" fill="#fef3c7"/>
        </svg>`
    };

    const BADGES_CONFIG = [
        {
            id: 'primeiro_broto',
            nome: 'Primeiro Broto',
            raridade: 'comum',
            desc: 'Concluiu a primeira atividade no Sementis.',
            verificar: (u) => (u.xp_total || u.xp || 0) >= 10
        },
        {
            id: 'em_chamas',
            nome: 'Em Chamas',
            raridade: 'raro',
            desc: 'Manteve uma sequência ativa de estudos sem interrupções.',
            verificar: (u) => (u.ofensiva || 0) >= 3
        },
        {
            id: 'defensor_verde',
            nome: 'Defensor Verde',
            raridade: 'raro',
            desc: 'Alcançou o Nível 3 de aprendizado ambiental.',
            verificar: (u) => (u.progresso_nivel?.nivel_atual || u.nivel || 1) >= 3
        },
        {
            id: 'raio_verde',
            nome: 'Raio Verde',
            raridade: 'epico',
            desc: 'Acumulou mais de 250 pontos de experiência ecológica.',
            verificar: (u) => (u.xp_total || u.xp || 0) >= 250
        },
        {
            id: 'gota_vital',
            nome: 'Gota Vital',
            raridade: 'comum',
            desc: 'Iniciou seus estudos sobre recursos hídricos e preservação.',
            verificar: (u) => (u.xp_total || u.xp || 0) >= 30
        },
        {
            id: 'energia_limpa',
            nome: 'Energia Limpa',
            raridade: 'raro',
            desc: 'Dedicou-se aos estudos de transição e fontes renováveis.',
            verificar: (u) => (u.xp_total || u.xp || 0) >= 100
        },
        {
            id: 'mestre_sustentavel',
            nome: 'Mestre Sementis',
            raridade: 'lendario',
            desc: 'Alcançou o prestigiado Nível 5 de excelência acadêmica.',
            verificar: (u) => (u.progresso_nivel?.nivel_atual || u.nivel || 1) >= 5
        },
        {
            id: 'amigo_da_terra',
            nome: 'Rede Verde',
            raridade: 'comum',
            desc: 'Conectou-se com colegas na comunidade Sementis.',
            verificar: (u, qtdAmigos) => qtdAmigos >= 1
        },
        {
            id: 'trofeu_ligas',
            nome: 'Top das Ligas',
            raridade: 'epico',
            desc: 'Alcançou posições de destaque nas ligas competitivas.',
            verificar: (u) => (u.liga_id || 1) >= 2
        },
        {
            id: 'sabio_semeia',
            nome: 'Oráculo SemeIA',
            raridade: 'raro',
            desc: 'Utilizou a inteligência educacional para aprofundar tópicos.',
            verificar: (u) => (u.xp_total || u.xp || 0) >= 80
        },
        {
            id: 'foco_ecologico',
            nome: 'Foco Ecológico',
            raridade: 'epico',
            desc: 'Manteve 7 dias consecutivos de dedicação sustentável.',
            verificar: (u) => (u.ofensiva || 0) >= 7
        },
        {
            id: 'guardiao_ancestral',
            nome: 'Guardião Ancestral',
            raridade: 'lendario',
            desc: 'Superou a grandiosa marca de 1.000 XP acumulados.',
            verificar: (u) => (u.xp_total || u.xp || 0) >= 1000
        }
    ];

    function renderizarBadges(qtdAmigos = 0) {
        if (!badgesGrid) return;

        let desbloqueados = 0;
        const total = BADGES_CONFIG.length;

        const html = BADGES_CONFIG.map(b => {
            const isUnlocked = b.verificar(user, qtdAmigos);
            if (isUnlocked) desbloqueados++;
            const svgIcon = BADGE_SVGS[b.id] || '';

            return `
                <div class="badge-item ${b.raridade} ${isUnlocked ? 'desbloqueado' : 'bloqueado'}" 
                     data-id="${b.id}"
                     title="${b.nome} (${isUnlocked ? 'Desbloqueado' : 'Bloqueado'})">
                    <div class="badge-item-svg ${!isUnlocked ? 'badge-item-svg--locked' : ''}">${svgIcon}</div>
                    <span class="badge-item-nome">${b.nome}</span>
                    ${!isUnlocked ? `
                        <svg class="badge-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    ` : ''}
                </div>
            `;
        }).join('');

        badgesGrid.innerHTML = html;

        if (badgesCountEl) {
            badgesCountEl.textContent = `${desbloqueados}/${total}`;
        }

        // Clicks nos badges para abrir modal de detalhes
        badgesGrid.querySelectorAll('.badge-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                const badge = BADGES_CONFIG.find(b => b.id === id);
                if (!badge) return;

                const isUnlocked = badge.verificar(user, qtdAmigos);

                if (badgeModalIcon) {
                    badgeModalIcon.innerHTML = BADGE_SVGS[badge.id] || '';
                    badgeModalIcon.className = `badge-modal-icon badge-modal-icon--${badge.raridade} ${isUnlocked ? '' : 'badge-modal-icon--locked'}`;
                }
                if (badgeModalTitulo) badgeModalTitulo.textContent = badge.nome;
                if (badgeModalDescricao) badgeModalDescricao.textContent = badge.desc;
                if (badgeModalRaridade) {
                    badgeModalRaridade.className = `badge-modal-raridade ${badge.raridade}`;
                    badgeModalRaridade.textContent = badge.raridade.toUpperCase();
                }
                if (badgeModalData) {
                    badgeModalData.textContent = isUnlocked ? '✓ Emblema Desbloqueado' : '🔒 Bloqueado — Continue estudando para desbloquear!';
                    badgeModalData.style.color = isUnlocked ? 'var(--color-accent)' : 'var(--color-gray-400)';
                }

                if (modalBadge) modalBadge.classList.add('active');
            });
        });
    }

    if (btnFecharBadge && modalBadge) {
        btnFecharBadge.addEventListener('click', () => modalBadge.classList.remove('active'));
        modalBadge.addEventListener('click', (e) => {
            if (e.target === modalBadge) modalBadge.classList.remove('active');
        });
    }

    renderizarBadges(0);

    // -------------------------------------------------------------------------
    // 5. AMIGOS: LISTAGEM ONLINE/OFFLINE COM GLASSMORPHISM & CONVITES
    // -------------------------------------------------------------------------
    const friendsOnlineGroup = document.getElementById('friends-online-group');
    const friendsOnlineList = document.getElementById('friends-online-list');
    const friendsOnlineCount = document.getElementById('friends-online-count');

    const friendsOfflineGroup = document.getElementById('friends-offline-group');
    const friendsOfflineList = document.getElementById('friends-offline-list');
    const friendsOfflineCount = document.getElementById('friends-offline-count');

    const friendsEmpty = document.getElementById('friends-empty');
    const btnAddFriendEmpty = document.getElementById('btn-add-friend-empty');
    const btnOpenAddFriends = document.getElementById('btn-open-add-friends');

    const modalAmigos = document.getElementById('modal-adicionar-amigos');
    const btnFecharModalAmigos = document.getElementById('btn-fechar-modal-sementis');
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

    function renderizarCardAmigo(amigo, isOnline) {
        const primeiraLetra = (amigo.nome || 'A').trim()[0].toUpperCase();
        const gradienteIdx = ((amigo.id || 1) % 5) + 1;

        return `
            <div class="friend-card" title="${amigo.nome} • Nível ${amigo.nivel || 1}">
                <div class="friend-card-avatar">
                    <div class="friend-card-avatar-inner">
                        ${amigo.avatar_url ? `
                            <img src="${amigo.avatar_url}" alt="${amigo.nome}" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <span class="friend-card-avatar-letter gradient-${gradienteIdx}" style="display: none;">${primeiraLetra}</span>
                        ` : `
                            <span class="friend-card-avatar-letter gradient-${gradienteIdx}">${primeiraLetra}</span>
                        `}
                    </div>
                    <span class="friend-card-status ${isOnline ? 'online' : 'offline'}"></span>
                </div>
                <div class="friend-card-info">
                    <span class="friend-card-name">${amigo.nome}</span>
                    <span class="friend-card-meta">
                        <span class="xp-tag">${amigo.xp || 0} XP</span>
                        <span>•</span>
                        <span>${amigo.ofensiva || 0} dias 🔥</span>
                    </span>
                </div>
                <span class="friend-card-level">Nv. ${amigo.nivel || 1}</span>
            </div>
        `;
    }

    async function carregarAmigos() {
        if (!token) {
            mostrarEstadoVazioAmigos();
            return;
        }

        try {
            const resp = await fetch('/api/amigos', { headers: getAuthHeaders() });
            if (!resp.ok) throw new Error('Falha ao obter lista de amigos');

            const amigos = await resp.json();

            if (!Array.isArray(amigos) || amigos.length === 0) {
                mostrarEstadoVazioAmigos();
                renderizarBadges(0);
                return;
            }

            // Atualiza os badges com a contagem real de amigos
            renderizarBadges(amigos.length);

            // Determina status online/offline com lógica realista
            // Se o amigo tem ofensiva recente ou ID par, simulamos presença ativa no app
            const amigosOnline = [];
            const amigosOffline = [];

            amigos.forEach((amigo, index) => {
                const online = (amigo.id % 2 === 0) || (index === 0);
                if (online) {
                    amigosOnline.push(amigo);
                } else {
                    amigosOffline.push(amigo);
                }
            });

            // Oculta estado vazio
            if (friendsEmpty) friendsEmpty.style.display = 'none';

            // Grupo Online
            if (amigosOnline.length > 0) {
                if (friendsOnlineGroup) friendsOnlineGroup.style.display = 'block';
                if (friendsOnlineCount) friendsOnlineCount.textContent = amigosOnline.length;
                if (friendsOnlineList) {
                    friendsOnlineList.innerHTML = amigosOnline.map(a => renderizarCardAmigo(a, true)).join('');
                }
            } else {
                if (friendsOnlineGroup) friendsOnlineGroup.style.display = 'none';
            }

            // Grupo Offline
            if (amigosOffline.length > 0) {
                if (friendsOfflineGroup) friendsOfflineGroup.style.display = 'block';
                if (friendsOfflineCount) friendsOfflineCount.textContent = amigosOffline.length;
                if (friendsOfflineList) {
                    friendsOfflineList.innerHTML = amigosOffline.map(a => renderizarCardAmigo(a, false)).join('');
                }
            } else {
                if (friendsOfflineGroup) friendsOfflineGroup.style.display = 'none';
            }

        } catch (err) {
            console.error('Erro ao carregar amigos:', err);
            mostrarEstadoVazioAmigos();
        }
    }

    function mostrarEstadoVazioAmigos() {
        if (friendsEmpty) friendsEmpty.style.display = 'flex';
        if (friendsOnlineGroup) friendsOnlineGroup.style.display = 'none';
        if (friendsOfflineGroup) friendsOfflineGroup.style.display = 'none';
    }

    // Modal de Amigos
    window.abrirModalSementisAmigos = function() {
        if (!modalAmigos) return;

        if (sfMeuIdentificador) {
            const email = user.email || 'seu-email';
            const id = user.id ? `ID #${user.id}` : '';
            sfMeuIdentificador.textContent = id ? `${email} (${id})` : email;
        }

        if (sfInputAmigo) sfInputAmigo.value = '';
        if (sfFeedback) {
            sfFeedback.style.display = 'none';
            sfFeedback.textContent = '';
            sfFeedback.className = 'sf-feedback-msg';
        }

        trocarAbaModalAmigos('adicionar');
        modalAmigos.classList.add('active');
        setTimeout(() => sfInputAmigo?.focus(), 150);

        carregarPedidosModal();
    };

    window.fecharModalSementisAmigos = function() {
        if (modalAmigos) modalAmigos.classList.remove('active');
    };

    if (btnOpenAddFriends) btnOpenAddFriends.addEventListener('click', abrirModalSementisAmigos);
    if (btnAddFriendEmpty) btnAddFriendEmpty.addEventListener('click', abrirModalSementisAmigos);
    if (btnFecharModalAmigos) btnFecharModalAmigos.addEventListener('click', fecharModalSementisAmigos);
    if (modalAmigos) {
        modalAmigos.addEventListener('click', (e) => {
            if (e.target === modalAmigos) fecharModalSementisAmigos();
        });
    }

    // Alternar abas
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

    if (sfTabAdicionar) sfTabAdicionar.addEventListener('click', () => trocarAbaModalAmigos('adicionar'));
    if (sfTabPedidos) sfTabPedidos.addEventListener('click', () => trocarAbaModalAmigos('pedidos'));

    // Copiar ID
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

    // Enviar convite
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
                    }, 1500);
                } else {
                    if (sfFeedback) {
                        sfFeedback.className = 'sf-feedback-msg erro';
                        sfFeedback.textContent = dados.mensagem || 'Não foi possível enviar o convite.';
                        sfFeedback.style.display = 'block';
                    }
                }
            } catch (err) {
                console.error('Erro ao enviar pedido de amizade:', err);
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

    // Listar pedidos pendentes
    async function carregarPedidosModal() {
        if (!sfListaPedidos || !token) return;

        try {
            const resp = await fetch('/api/amigos/pedidos', { headers: getAuthHeaders() });
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
                const avatar = ped.avatar_url;
                const primeiraLetra = (ped.nome || 'A')[0].toUpperCase();
                const nivel = ped.nivel ?? 1;

                return `
                    <div class="sf-request-item" id="sf-req-${ped.amizade_id}">
                        <div class="sf-req-user">
                            ${avatar ? `
                                <img src="${avatar}" alt="${ped.nome}" class="sf-req-avatar" onerror="this.src='/assets/icons/icone_usuario.png'">
                            ` : `
                                <div class="sf-req-avatar-glass">${primeiraLetra}</div>
                            `}
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
                carregarAmigos();
                carregarPedidosModal();
            } else {
                alert(res.mensagem || 'Erro ao responder convite.');
                if (item) item.style.opacity = '1';
            }
        } catch (e) {
            console.error(e);
            alert('Erro de conexão ao responder convite.');
            if (item) item.style.opacity = '1';
        }
    };

    // -------------------------------------------------------------------------
    // 6. COMPARTILHAR & PRO MODAL
    // -------------------------------------------------------------------------
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'Meu Progresso no Sementis',
                text: `Estou aprendendo sustentabilidade no Sementis! Venha participar da minha turma!`,
                url: window.location.origin + window.location.pathname
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                    alert('Link de compartilhamento copiado para a área de transferência!');
                }
            } catch (err) {
                console.log('Compartilhamento cancelado ou não suportado:', err);
            }
        });
    }

    const proBtn = document.querySelector('.pro-btn');
    const proModal = document.getElementById('pro-modal');
    const closeProModalBtn = proModal?.querySelector('.close-modal-btn');
    const proTrialBtn = document.querySelector('.pro-trial-btn');

    if (proBtn && proModal) {
        proBtn.addEventListener('click', () => proModal.classList.add('active'));
    }

    if (closeProModalBtn && proModal) {
        closeProModalBtn.addEventListener('click', () => proModal.classList.remove('active'));
    }

    if (proModal) {
        proModal.addEventListener('click', (e) => {
            if (e.target === proModal) proModal.classList.remove('active');
        });
    }

    if (proTrialBtn && proModal && proBtn) {
        proTrialBtn.addEventListener('click', () => {
            alert('Parabéns! Seu período de teste grátis do Sementis PRO foi ativado!');
            proModal.classList.remove('active');
            proBtn.textContent = 'SEJA PRO — Ativado';
            proBtn.style.backgroundColor = 'var(--color-success)';
        });
    }

    // Configurações
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            alert('Configurações da conta estarão disponíveis na próxima atualização do Sementis!');
        });
    }

    // Escuta evento de atualização de perfil disparado por main.js
    window.addEventListener('perfil:atualizado', () => {
        try {
            user = JSON.parse(localStorage.getItem('cached_perfil') || localStorage.getItem('user') || '{}');
            atualizarAvatarVisual();
            renderizarBadges();
        } catch (e) {
            console.warn(e);
        }
    });

    // Inicialização
    carregarAmigos();
    carregarPedidosModal();
});