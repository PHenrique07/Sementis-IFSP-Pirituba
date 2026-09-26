const GACHA_FILA_STORAGE_KEY = 'sementis-gacha-pendencias-v1';
const GACHA_TIMEOUT_MS = 10000;
const GACHA_RETRY_INTERVAL_MS = 5000;
let gachaRetryEmAndamento = false;
let gachaUltimoRetryEm = 0;
const gachaChavesEmVoo = new Set();

function lerPendenciasGacha() {
    try {
        const fila = JSON.parse(localStorage.getItem(GACHA_FILA_STORAGE_KEY) || '[]');
        return Array.isArray(fila) ? fila : [];
    } catch (erro) {
        return [];
    }
}

function salvarPendenciasGacha(fila) {
    localStorage.setItem(GACHA_FILA_STORAGE_KEY, JSON.stringify(fila));
}

function adicionarPendenciaGacha(pendencia) {
    const fila = lerPendenciasGacha();
    fila.push(pendencia);
    salvarPendenciasGacha(fila);
}

function removerPendenciaGacha(idempotencyKey) {
    const fila = lerPendenciasGacha();
    salvarPendenciasGacha(fila.filter((pendencia) => pendencia.idempotency_key !== idempotencyKey));
}

function criarIdempotencyKey() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function criarErroGacha(mensagem, status) {
    const erro = new Error(mensagem || 'Erro ao enviar dados para a API');
    if (status !== undefined) {
        erro.status = status;
    }
    return erro;
}

async function enviarPendenciaGacha(pendencia) {
    if (gachaChavesEmVoo.has(pendencia.idempotency_key)) {
        throw criarErroGacha('Esta tentativa do gacha já está sendo enviada');
    }

    gachaChavesEmVoo.add(pendencia.idempotency_key);
    const controlador = new AbortController();
    const timeout = setTimeout(() => controlador.abort(), GACHA_TIMEOUT_MS);
    const dado = {
        custo: pendencia.custo,
        idempotency_key: pendencia.idempotency_key
    };
    if (pendencia.idItem !== undefined) {
        dado.idItem = pendencia.idItem;
    }

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Idempotency-Key': pendencia.idempotency_key
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        // O backend deve respeitar Idempotency-Key para impedir cobrança duplicada.
        const resposta = await fetch('/api/loja/gacha', {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(dado),
            signal: controlador.signal
        });

        let resultado = {};
        try {
            resultado = await resposta.json();
        } catch (erro) {
            if (resposta.ok) {
                throw criarErroGacha('Resposta inválida da API do gacha');
            }
        }

        if (!resposta.ok) {
            const erro = criarErroGacha(
                resultado?.mensagem || resultado?.message || resultado?.erro || resultado?.error,
                resposta.status
            );
            if ([400, 401, 409].includes(resposta.status)) {
                removerPendenciaGacha(pendencia.idempotency_key);
            }
            throw erro;
        }

        removerPendenciaGacha(pendencia.idempotency_key);
        return resultado;
    } catch (erro) {
        if (erro.name === 'AbortError') {
            throw criarErroGacha('Tempo esgotado ao enviar dados para a API do gacha');
        }
        throw erro;
    } finally {
        clearTimeout(timeout);
        gachaChavesEmVoo.delete(pendencia.idempotency_key);
    }
}

async function ganharItem(IdItem, custo = 100) {
    const pendencia = {
        idempotency_key: criarIdempotencyKey(),
        custo,
        criado_em: new Date().toISOString()
    };
    if (IdItem !== undefined && IdItem !== null) {
        pendencia.idItem = `${IdItem}`;
    }

    adicionarPendenciaGacha(pendencia);
    return enviarPendenciaGacha(pendencia);
}

async function reenviarPendenciasGacha() {
    const agora = Date.now();
    if (gachaRetryEmAndamento || agora - gachaUltimoRetryEm < GACHA_RETRY_INTERVAL_MS) {
        return;
    }

    gachaRetryEmAndamento = true;
    gachaUltimoRetryEm = agora;
    try {
        for (const pendencia of lerPendenciasGacha()) {
            try {
                await enviarPendenciaGacha(pendencia);
            } catch (erro) {
                // Erros permanecem na fila; a próxima carga ou evento online tenta novamente.
            }
        }
    } finally {
        gachaRetryEmAndamento = false;
    }
}

window.addEventListener('online', () => {
    void reenviarPendenciasGacha();
});

void reenviarPendenciasGacha();