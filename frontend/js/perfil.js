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

    // 5. Adicionar Amigos
    const addFriendsBtn = document.querySelector('.add-friends-btn');
    if (addFriendsBtn) {
        addFriendsBtn.addEventListener('click', () => {
            const friendName = prompt('Digite o nome ou email do seu amigo:');
            if (friendName && friendName.trim() !== '') {
                alert(`Convite enviado para ${friendName}!`);
            }
        });
    }
});