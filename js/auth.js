document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const emailDigitado = document.getElementById('loginEmail').value;
            const senhaDigitada = document.getElementById('loginPassword').value;

            try {
                // API_BASE_URL é definida em js/api-config.js e detecta
                // automaticamente se estamos em local ou em produção.
                const urlDoServidor = `${API_BASE_URL}/login`;

                const resposta = await fetch(urlDoServidor, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        email: emailDigitado, 
                        senha: senhaDigitada 
                    })
                });

                const resultado = await resposta.json();

                if (resposta.ok) {
                    // 1. Salva a Chave de Segurança (O Token que o Lucas gerou)
                    localStorage.setItem("token", resultado.token);

                    // 2. Salva na gaveta os dados do usuário (com moedas, xp, vidas, etc)
                    localStorage.setItem("user", JSON.stringify(resultado.usuario));

                    // 3. Redireciona com base no tipo de usuário
                    if (resultado.usuario.tipo === "professor") {
                        window.location.href = "painel-professor.html";
                    } else {
                        window.location.href = "home.html";
                    }

                } else {
                    alert("Erro: " + resultado.erro);
                }
            } catch (erro) {
                alert("Erro de conexão! O servidor está ligado?");
                console.error(erro);
            }
        });
    }
});