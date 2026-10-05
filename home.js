\
(() => {
  "use strict";

  const productsGrid = document.querySelector("[data-products-grid]");
  const loading = document.querySelector("[data-products-loading]");
  const empty = document.querySelector("[data-products-empty]");

  async function loadHome() {
    try {
      const [homeResponse, productsResponse] = await Promise.all([
        window.RilmiaAPI.call("getHome"),
        window.RilmiaAPI.call("getProducts")
      ]);

      if (homeResponse && homeResponse.success) {
        applyHome(homeResponse.home || {});
      }

      if (!productsResponse || !productsResponse.success) {
        throw new Error(
          (productsResponse && productsResponse.message) ||
          "Impossibile caricare i prodotti."
        );
      }

      renderProducts(productsResponse.products || []);
    } catch (error) {
      loading.hidden = true;
      empty.hidden = false;
      empty.querySelector("strong").textContent =
        "Non riusciamo a caricare i prodotti.";
      empty.querySelector("span").textContent =
        error.message || "Riprova tra qualche secondo.";
      console.error(error);
    }
  }

  function applyHome(home) {
    const bindings = {
      hero_eyebrow: "[data-home-hero-eyebrow]",
      hero_title: "[data-home-hero-title]",
      hero_text: "[data-home-hero-text]",
      products_title: "[data-home-products-title]",
      products_text: "[data-home-products-text]",
      about_title: "[data-home-about-title]",
      about_text: "[data-home-about-text]",
      footer_text: "[data-home-footer-text]"
    };

    Object.entries(bindings).forEach(([key, selector]) => {
      const element = document.querySelector(selector);
      if (element && home[key]) element.textContent = home[key];
    });
  }

  function renderProducts(products) {
    loading.hidden = true;

    if (!products.length) {
      empty.hidden = false;
      return;
    }

    empty.hidden = true;

    productsGrid.innerHTML = products.map((product, index) => {
      const href = `${window.RILMIA_CONFIG.PRODUCT_PAGE}?slug=${encodeURIComponent(product.slug)}`;
      const status = window.RilmiaUI.statusLabel(product.stato);
      const price = window.RilmiaUI.formatPrice(product.prezzo);
      const image = window.RilmiaUI.imageOrPlaceholder(
        product.foto_cover,
        product.nome,
        "product-card__image"
      );

      return `
        <article class="product-card reveal" style="--delay:${Math.min(index * 70, 350)}ms">
          <a class="product-card__media" href="${href}" aria-label="Scopri ${window.RilmiaUI.escapeHtml(product.nome)}">
            ${image}
            ${status ? `<span class="product-status">${window.RilmiaUI.escapeHtml(status)}</span>` : ""}
          </a>

          <div class="product-card__content">
            <div>
              <p class="product-card__eyebrow">${window.RilmiaUI.escapeHtml(product.materiali || "Oggetto 3D")}</p>
              <h3><a href="${href}">${window.RilmiaUI.escapeHtml(product.nome)}</a></h3>
            </div>

            <div class="product-card__meta">
              ${price ? `<span>Indicativamente ${price}</span>` : `<span>Prezzo in definizione</span>`}
              <a class="arrow-link" href="${href}" aria-label="Apri ${window.RilmiaUI.escapeHtml(product.nome)}">↗</a>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadHome();
    window.RilmiaAnalytics.track("page_view");
  });
})();
