async function salvarDados(){
    const nome= document.getElementById("registerName").value;
    const email=document.getElementById("registerEmail").value;
    const idade=document.getElementById("registerAge").value;
    const senha=document.getElementById("registerPassword").value;

    const usuario={
        registerName:nome,
        registerEmail:email,
        registerAge:idade,
        registerPassword:senha,
    };
   try {
        const resposta = await fetch("http://127.0.0.1:5000/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Conta criada com sucesso!");
        } else {
            alert("Erro: " + resultado.erro);
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor do Lucas!");
        console.error(erro);
    }
}
