(() => {
  "use strict";

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatPrice(value) {
    if (value === "" || value === null || value === undefined) return "";
    const number = Number(value);
    if (!Number.isFinite(number)) return String(value);
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: Number.isInteger(number) ? 0 : 2
    }).format(number);
  }

  function statusLabel(status) {
    const map = {
      in_arrivo: "In arrivo",
      disponibile: "Disponibile"
    };
    return map[status] || status || "";
  }

  function imageOrPlaceholder(url, alt, className = "") {
    if (!url) {
      return `
        <div class="image-placeholder ${escapeHtml(className)}" role="img"
             aria-label="${escapeHtml(alt || "Immagine prodotto")}">
          <span>RILMIA</span>
        </div>`;
    }

    return `
      <img
        class="${escapeHtml(className)}"
        src="${escapeHtml(url)}"
        alt="${escapeHtml(alt || "")}"
        loading="lazy"
        decoding="async"
      >`;
  }

  function setYear() {
    document.querySelectorAll("[data-current-year]").forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function initMenu() {
    const button = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      nav.hidden = open;
      document.body.classList.toggle("menu-open", !open);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        button.setAttribute("aria-expanded", "false");
        nav.hidden = true;
        document.body.classList.remove("menu-open");
      });
    });
  }

  function showToast(message, type = "info") {
    let host = document.querySelector(".toast-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "toast-host";
      host.setAttribute("aria-live", "polite");
      document.body.appendChild(host);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    host.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("is-visible"));

    window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => toast.remove(), 220);
    }, 3600);
  }

  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    initMenu();
  });

  window.RilmiaUI = Object.freeze({
    escapeHtml,
    formatPrice,
    statusLabel,
    imageOrPlaceholder,
    showToast
  });
})();
