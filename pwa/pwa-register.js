(function registerPWA() {
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
})();
