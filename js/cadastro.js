// Espera o HTML do Tom carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // Captura o formulário de Cadastro
    const registerForm = document.getElementById('registerForm');

    // Só roda se o formulário existir na tela
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            // 1. TRAVA O F5: Impede a página de recarregar e cancelar o envio
            event.preventDefault();

            // 2. Coleta os dados das "prateleiras" (IDs) do HTML do Tom
            const nomeDigitado = document.getElementById("registerName").value;
            const emailDigitado = document.getElementById("registerEmail").value;
            const idadeDigitada = document.getElementById("registerAge").value;
            const senhaDigitada = document.getElementById("registerPassword").value;
            const confirmaSenha = document.getElementById("registerConfirmPassword").value;
            
            // 3. Pega qual botão de rádio está marcado (Aluno ou Professor)
            const tipoUsuarioSelecionado = document.querySelector('input[name="userType"]:checked').value;

            // --- VALIDAÇÃO RÁPIDA NO FRONT-END ---
            if (senhaDigitada !== confirmaSenha) {
                alert("As senhas não batem! Digite senhas iguais.");
                return; // Para a função aqui e não manda pro servidor
            }

            // 4. A MÁGICA DA TRADUÇÃO: 
            // Coloca as etiquetas exatas que o Python do Lucas e o Banco do Pedro exigem!
            const usuario = {
                nome: nomeDigitado,
                email: emailDigitado,
                idade: idadeDigitada, // O banco exige número inteiro
                senha: senhaDigitada,
                tipo_usuario: tipoUsuarioSelecionado
            };

            console.log("Enviando pacote JSON:", JSON.stringify(usuario));

            try {
                // ATENÇÃO VINI: O link do Ngrok do Pedro
                // Lembre-se de atualizar esse link toda vez que o Ngrok gerar um novo!
                const urlDoServidor = "http://127.0.0.1:5000/cadastro"; 

                // 5. O Chute pro Gol (Fetch)
                const resposta = await fetch(urlDoServidor, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(usuario)
                });

                // 6. Lê a resposta do Python
                const resultado = await resposta.json();

                if (resposta.ok) {
                    // Recebeu o código 201 (Criado com sucesso)
                    alert("Sucesso! 🎉 " + resultado.mensagem + "\nAgora faça seu login.");
                    registerForm.reset(); // Limpa os campos do formulário

                    // Redireciona o usuário para a página de LOGIN
                    window.location.href = "login.html"; 
                } else {
                    // Recebeu um código 400 ou 500 (Erro)
                    alert("Erro do Servidor: " + resultado.erro);
                }

            } catch (erro) {
                alert("Erro de Conexão! O servidor do Pedro está ligado e com o link do Ngrok correto?");
                console.error("Detalhes do erro:", erro);
            }
        });
    }

    /* Abaixo o Vini pode colocar as lógicas do login.html 
       (como alternar entre as abas de entrar/cadastrar e a visibilidade da senha)
    */
});
