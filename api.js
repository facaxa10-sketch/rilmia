(() => {
  "use strict";

  const cfg = window.RILMIA_CONFIG;
  if (!cfg) throw new Error("RILMIA_CONFIG non caricato.");

  const PUBLIC_READ_ACTIONS = new Set([
    "getHome",
    "getProducts",
    "getProduct"
  ]);

  let bridgeFrame = null;
  let bridgeReady = null;
  const pending = new Map();

  function createRequestId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "req_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  }

  function jsonp(action, payload = {}) {
    return new Promise((resolve, reject) => {
      const callbackName =
        "__rilmia_jsonp_" +
        Date.now() +
        "_" +
        Math.random().toString(36).slice(2);

      const params = new URLSearchParams();
      params.set("action", action);
      params.set("callback", callbackName);

      Object.entries(payload || {}).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (typeof value === "object") {
          params.set(key, JSON.stringify(value));
        } else {
          params.set(key, String(value));
        }
      });

      const script = document.createElement("script");
      const separator = cfg.API_URL.includes("?") ? "&" : "?";
      script.src = cfg.API_URL + separator + params.toString();
      script.async = true;

      const cleanup = () => {
        window.clearTimeout(timer);
        try { delete window[callbackName]; } catch (_) {}
        script.remove();
      };

      const timer = window.setTimeout(() => {
        cleanup();
        reject(
          new Error(
            "Il backend RILMIA non ha risposto. Controlla che la Web App Apps Script sia pubblicata per 'Chiunque'."
          )
        );
      }, cfg.API_TIMEOUT_MS);

      window[callbackName] = result => {
        cleanup();

        if (!result) {
          reject(new Error("Risposta vuota dal backend."));
          return;
        }

        resolve(result);
      };

      script.onerror = () => {
        cleanup();
        reject(
          new Error(
            "Non riesco a raggiungere il backend RILMIA. Controlla il deployment Apps Script."
          )
        );
      };

      document.head.appendChild(script);
    });
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
        reject(
          new Error(
            "Il collegamento sicuro al backend non è disponibile. Se stai aprendo i file direttamente dal PC, pubblica prima il sito su GitHub Pages."
          )
        );
      }, cfg.API_TIMEOUT_MS);

      bridgeFrame.addEventListener(
        "load",
        () => {
          window.clearTimeout(timer);
          resolve(bridgeFrame);
        },
        { once: true }
      );

      bridgeFrame.addEventListener(
        "error",
        () => {
          window.clearTimeout(timer);
          reject(new Error("Impossibile caricare il collegamento sicuro al backend."));
        },
        { once: true }
      );

      document.body.appendChild(bridgeFrame);
    });

    return bridgeReady;
  }

  window.addEventListener("message", event => {
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

  async function bridgeCall(action, payload = {}) {
    const frame = await ensureBridge();
    const requestId = createRequestId();

    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        pending.delete(requestId);
        reject(
          new Error(
            "Richiesta scaduta. Controlla ALLOWED_ORIGINS nelle Script Properties di Apps Script."
          )
        );
      }, cfg.API_TIMEOUT_MS);

      pending.set(requestId, { resolve, reject, timer });

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

  async function call(action, payload = {}) {
    // Le letture pubbliche passano via JSONP:
    // funzionano sia su GitHub Pages sia aprendo l'HTML in locale.
    if (PUBLIC_READ_ACTIONS.has(action)) {
      return jsonp(action, payload);
    }

    // Scritture/iscrizioni/admin passano sempre dal bridge sicuro.
    return bridgeCall(action, payload);
  }

  window.RilmiaAPI = Object.freeze({
    call,
    jsonp,
    bridgeCall
  });
})();
