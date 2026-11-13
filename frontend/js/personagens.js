// SVGs locais: o acervo mantém as poses da prancha original e o PNG como reserva.
const vetoresPersonagens = new Map();
// Atualize junto da versão do script em trilhas.html ao alterar o acervo.
const VERSAO_VETORES_PERSONAGENS = '20261112-4';
let instanciaPersonagem = 0;

function criarIlustracaoPersonagem(elemento) {
  const imagem = document.createElement('img');
  imagem.className = 'personagem-img';
  imagem.alt = elemento.nome;
  imagem.loading = 'lazy';
  imagem.decoding = 'async';
  imagem.dataset.vetor = elemento.img.replace('personagens/', 'personagens/vetores/').replace('.png', '.svg')
    + `?v=${VERSAO_VETORES_PERSONAGENS}`;
  imagem.addEventListener('error', () => { imagem.src = elemento.img; }, { once: true });
  imagem.src = imagem.dataset.vetor;
  return imagem;
}

async function animarIlustracaoPersonagem(botao) {
  const imagem = botao.querySelector('img[data-vetor]');
  if (!imagem || imagem.dataset.carregando) return;
  imagem.dataset.carregando = 'true';
  const caminho = imagem.dataset.vetor;
  try {
    if (!vetoresPersonagens.has(caminho)) {
      vetoresPersonagens.set(caminho, fetch(caminho, { cache: 'no-cache' }).then(resposta => {
        if (!resposta.ok) throw new Error('Ilustração indisponível');
        return resposta.text();
      }));
    }
    const texto = await vetoresPersonagens.get(caminho);
    if (!botao.isConnected) return;
    const documento = new DOMParser().parseFromString(texto, 'image/svg+xml');
    const vetor = documento.documentElement;
    if (vetor.localName !== 'svg' || documento.querySelector('parsererror')) {
      throw new Error('Ilustração inválida');
    }
    // Poses repetidas no mapa precisam de IDs próprios para máscaras e referências.
    const prefixo = `personagem-${++instanciaPersonagem}-`;
    const ids = [...vetor.querySelectorAll('[id]')].map(el => el.id);
    vetor.querySelectorAll('*').forEach(el => {
      if (el.id) el.id = prefixo + el.id;
      ['href', 'mask', 'clip-path'].forEach(atributo => {
        const valor = el.getAttribute(atributo);
        if (!valor) return;
        const id = ids.find(id => valor === `#${id}` || valor === `url(#${id})`);
        if (id) el.setAttribute(atributo, valor.replace(`#${id}`, `#${prefixo}${id}`));
      });
    });
    imagem.replaceWith(document.importNode(vetor, true));
  } catch {
    // A versão estática continua utilizável mesmo se o carregamento animado falhar.
    vetoresPersonagens.delete(caminho);
    delete imagem.dataset.carregando;
  }
}
