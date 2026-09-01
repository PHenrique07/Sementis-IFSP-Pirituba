document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const nomeDigitado = document.getElementById("registerName").value;
            const emailDigitado = document.getElementById("registerEmail").value;
            const dataNascimentoDigitada = document.getElementById("registerAge").value;
            const senhaDigitada = document.getElementById("registerPassword").value;
            const confirmaSenha = document.getElementById("registerConfirmPassword").value;
            const tipoUsuarioSelecionado = document.querySelector('input[name="userType"]:checked').value;

            if (senhaDigitada !== confirmaSenha) {
                alert("As senhas não batem! Digite senhas iguais.");
                return;
            }

            const usuario = {
                nome: nomeDigitado,
                email: emailDigitado,
                data_nascimento: dataNascimentoDigitada,
                senha: senhaDigitada,
                tipo_usuario: tipoUsuarioSelecionado
            };

            try {
                const resposta = await fetch(`${API_BASE_URL}/cadastro`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(usuario)
                });

                const resultado = await resposta.json();

                if (resposta.ok) {
                    alert("Sucesso! " + resultado.mensagem + "\nAgora faça seu login.");
                    registerForm.reset();
                    window.location.href = "login.html";
                } else {
                    alert("Erro do Servidor: " + resultado.erro);
                }

            } catch (erro) {
                alert("Erro de conexão! Verifique se o servidor está disponível.");
                console.error(erro);
            }
        });
    }
});
