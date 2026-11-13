let contexto;

function obterContexto() {
    if (!contexto) {
        contexto = new AudioContext();
    }

    if (contexto.state === 'suspended') {
        contexto.resume();
    }

    return contexto;
}

export function tocarSom(tipo) {
    const audio = obterContexto();
    const agora = audio.currentTime;
    const configuracoes = {
        flap: { frequencia: 260, final: 410, duracao: 0.1, volume: 0.045 },
        coletar: { frequencia: 520, final: 760, duracao: 0.14, volume: 0.05 },
        dano: { frequencia: 150, final: 80, duracao: 0.2, volume: 0.06 },
        batida: { frequencia: 115, final: 55, duracao: 0.16, volume: 0.085 },
        fim: { frequencia: 220, final: 90, duracao: 0.35, volume: 0.06 },
        botao: { frequencia: 360, final: 480, duracao: 0.08, volume: 0.035 }
    };
    const configuracao = configuracoes[tipo];
    if (!configuracao) return;

    const oscilador = audio.createOscillator();
    const ganho = audio.createGain();
    oscilador.type = tipo === 'batida' ? 'square' : tipo === 'dano' || tipo === 'fim' ? 'sine' : 'triangle';
    oscilador.frequency.setValueAtTime(configuracao.frequencia, agora);
    oscilador.frequency.exponentialRampToValueAtTime(configuracao.final, agora + configuracao.duracao);
    ganho.gain.setValueAtTime(configuracao.volume, agora);
    ganho.gain.exponentialRampToValueAtTime(0.001, agora + configuracao.duracao);
    oscilador.connect(ganho);
    ganho.connect(audio.destination);
    oscilador.start(agora);
    oscilador.stop(agora + configuracao.duracao);
}
