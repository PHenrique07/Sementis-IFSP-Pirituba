(function registerPWA() {
  // =========================================================================
  // 1. MATA O PWA EXISTENTE (Para não dar dor de cabeça com cache no desenvolvimento)
  // =========================================================================
  console.warn("Modo de desenvolvimento: PWA e cache desativados.");

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
        console.log("Service Worker antigo removido com sucesso.");
      }
    });
  }

  // O 'return' encerra a função aqui, impedindo que o código de baixo rode
  return; 

  // =========================================================================
  // 2. CÓDIGO ORIGINAL DO FOLTEST (COMENTADO E GUARDADO PARA O DEPLOY FINAL)
  // Quando for lançar o MVP, basta apagar o "return" acima e remover os /* e */
  // =========================================================================

  /*
  if (window.location.protocol === "file:") {
    console.warn(
      "PWA desativado em file://. Rode com servidor local (ex: Live Server, npx serve, python -m http.server)."
    );
    return;
  }

  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker nao suportado neste navegador/contexto.");
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        scope: "./"
      });

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) {
          return;
        }

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            console.info("Nova versao do app disponivel. Recarregue para atualizar.");
          }
        });
      });
    } catch (error) {
      console.error("Falha ao registrar o service worker:", error);
    }
  });
  */
})();