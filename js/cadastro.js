document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
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
<<<<<<< HEAD
                data_nascimento: dataNascimentoDigitada,
=======
                idade: idadeDigitada, // O banco exige número inteiro
>>>>>>> 45466e2a0180f6fcd0d819061db212a1d3aa270c
                senha: senhaDigitada,
                tipo_usuario: tipoUsuarioSelecionado
            };

            try {
                const resposta = await fetch("/cadastro", {
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
<<<<<<< HEAD
=======

    /* Abaixo o Vini pode colocar as lógicas do login.html 
       (como alternar entre as abas de entrar/cadastrar e a visibilidade da senha)
    */
>>>>>>> 45466e2a0180f6fcd0d819061db212a1d3aa270c
});
