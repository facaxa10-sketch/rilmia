\
(() => {
  "use strict";

  const status = document.querySelector("[data-unsubscribe-status]");

  async function run() {
    const token = new URL(window.location.href).searchParams.get("token");

    if (!token) {
      render(
        "Link non valido",
        "Manca il codice necessario per cancellare l'iscrizione.",
        false
      );
      return;
    }

    try {
      const response = await window.RilmiaAPI.call("unsubscribe", { token });

      if (!response || !response.success) {
        throw new Error(
          (response && response.message) ||
          "Non è stato possibile cancellare l'iscrizione."
        );
      }

      render(
        "Iscrizione cancellata",
        response.alreadyInactive
          ? "Questa iscrizione risultava già cancellata."
          : "Non riceverai più notifiche per questo prodotto.",
        true
      );
    } catch (error) {
      render(
        "Non siamo riusciti a completare l'operazione",
        error.message || "Riprova più tardi.",
        false
      );
    }
  }

  function render(title, message, ok) {
    status.classList.toggle("is-success", ok);
    status.classList.toggle("is-error", !ok);
    status.innerHTML = `
      <span class="result-mark" aria-hidden="true">${ok ? "✓" : "!"}</span>
      <h1>${window.RilmiaUI.escapeHtml(title)}</h1>
      <p>${window.RilmiaUI.escapeHtml(message)}</p>
      <a class="button button--dark" href="index.html">Torna a RILMIA</a>
    `;
  }

  document.addEventListener("DOMContentLoaded", run);
})();
