\
(() => {
  "use strict";

  const cfg = window.RILMIA_CONFIG;
  if (!cfg) throw new Error("RILMIA_CONFIG non caricato.");

  let bridgeFrame = null;
  let bridgeReady = null;
  const pending = new Map();

  function createRequestId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "req_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  }

  function ensureBridge() {
    if (bridgeReady) return bridgeReady;

    bridgeReady = new Promise((resolve, reject) => {
      bridgeFrame = document.createElement("iframe");
      bridgeFrame.src = cfg.BRIDGE_URL;
      bridgeFrame.title = "RILMIA API";
      bridgeFrame.setAttribute("aria-hidden", "true");
      bridgeFrame.tabIndex = -1;
      bridgeFrame.style.cssText =
        "position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;border:0;opacity:0;pointer-events:none;";

      const timer = window.setTimeout(() => {
        reject(new Error("Il collegamento al backend sta impiegando troppo tempo."));
      }, cfg.API_TIMEOUT_MS);

      bridgeFrame.addEventListener("load", () => {
        window.clearTimeout(timer);
        resolve(bridgeFrame);
      }, { once: true });

      bridgeFrame.addEventListener("error", () => {
        window.clearTimeout(timer);
        reject(new Error("Impossibile caricare il collegamento al backend."));
      }, { once: true });

      document.body.appendChild(bridgeFrame);
    });

    return bridgeReady;
  }

  window.addEventListener("message", (event) => {
    if (!bridgeFrame || event.source !== bridgeFrame.contentWindow) return;

    const data = event.data || {};
    if (data.type !== "rilmia:response" || !data.requestId) return;

    const request = pending.get(data.requestId);
    if (!request) return;

    pending.delete(data.requestId);
    window.clearTimeout(request.timer);

    if (data.ok) {
      request.resolve(data.result);
    } else {
      request.reject(
        new Error((data.error && data.error.message) || "Errore del backend.")
      );
    }
  });

  async function call(action, payload = {}) {
    const frame = await ensureBridge();
    const requestId = createRequestId();

    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        pending.delete(requestId);
        reject(new Error("Richiesta scaduta. Riprova tra qualche secondo."));
      }, cfg.API_TIMEOUT_MS);

      pending.set(requestId, { resolve, reject, timer });

      // Apps Script può passare da script.google.com a un dominio googleusercontent.
      // L'iframe verifica comunque l'origine del sito chiamante lato bridge.
      frame.contentWindow.postMessage(
        {
          type: "rilmia:request",
          requestId,
          action,
          payload
        },
        "*"
      );
    });
  }

  window.RilmiaAPI = Object.freeze({ call });
})();
