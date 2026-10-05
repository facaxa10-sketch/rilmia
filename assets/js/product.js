\
(() => {
  "use strict";

  const root = document.querySelector("[data-product-root]");
  const loading = document.querySelector("[data-product-loading]");
  const notFound = document.querySelector("[data-product-not-found]");

  async function loadProduct() {
    const slug = new URL(window.location.href).searchParams.get("slug");

    if (!slug) {
      showNotFound();
      return;
    }

    try {
      const response = await window.RilmiaAPI.call("getProduct", { slug });

      if (!response || !response.success || !response.product) {
        showNotFound();
        return;
      }

      render(response.product);
      window.RilmiaAnalytics.track("product_view", {
        productId: response.product.id,
        productSlug: response.product.slug
      });
    } catch (error) {
      console.error(error);
      showNotFound("Non riusciamo a caricare questo prodotto.");
    }
  }

  function showNotFound(message) {
    loading.hidden = true;
    root.hidden = true;
    notFound.hidden = false;

    if (message) {
      const text = notFound.querySelector("[data-not-found-text]");
      if (text) text.textContent = message;
    }
  }

  function render(product) {
    loading.hidden = true;
    root.hidden = false;

    document.title = `${product.nome} — RILMIA`;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta && product.sottotitolo) {
      descriptionMeta.setAttribute("content", product.sottotitolo);
    }

    setText("[data-product-name]", product.nome);
    setText("[data-product-subtitle]", product.sottotitolo || "");
    setText("[data-product-description]", product.descrizione || "");
    setText("[data-product-materials]", product.materiali || "Da definire");
    setText("[data-product-dimensions]", product.dimensioni || "Da definire");
    setText(
      "[data-product-price]",
      product.prezzo !== "" && product.prezzo !== null
        ? window.RilmiaUI.formatPrice(product.prezzo)
        : "In definizione"
    );
    setText(
      "[data-product-status]",
      window.RilmiaUI.statusLabel(product.stato) || "In arrivo"
    );

    renderGallery(product);

    document.querySelectorAll("[data-open-interest]").forEach(button => {
      button.setAttribute(
        "aria-label",
        `Lo comprerei: avvisami quando ${product.nome} esce`
      );
    });

    window.RilmiaSubscribe.init(product);
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = value;
    });
  }

  function renderGallery(product) {
    const hero = document.querySelector("[data-product-hero-image]");
    const thumbs = document.querySelector("[data-product-thumbs]");

    const images = [product.foto_cover, ...(product.foto_gallery || [])]
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index);

    if (!images.length) {
      hero.innerHTML = window.RilmiaUI.imageOrPlaceholder(
        "",
        product.nome,
        "product-gallery__main-placeholder"
      );
      thumbs.hidden = true;
      return;
    }

    hero.innerHTML = `
      <img
        src="${window.RilmiaUI.escapeHtml(images[0])}"
        alt="${window.RilmiaUI.escapeHtml(product.nome)}"
        class="product-gallery__main-image"
      >`;

    if (images.length < 2) {
      thumbs.hidden = true;
      return;
    }

    thumbs.hidden = false;
    thumbs.innerHTML = images.map((url, index) => `
      <button
        type="button"
        class="gallery-thumb ${index === 0 ? "is-active" : ""}"
        data-gallery-index="${index}"
        aria-label="Mostra immagine ${index + 1} di ${images.length}"
      >
        <img
          src="${window.RilmiaUI.escapeHtml(url)}"
          alt=""
          loading="lazy"
        >
      </button>
    `).join("");

    thumbs.addEventListener("click", event => {
      const button = event.target.closest("[data-gallery-index]");
      if (!button) return;

      const index = Number(button.dataset.galleryIndex);
      const mainImage = hero.querySelector("img");
      if (!mainImage || !images[index]) return;

      mainImage.src = images[index];

      thumbs.querySelectorAll(".gallery-thumb").forEach(el => {
        el.classList.toggle("is-active", el === button);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", loadProduct);
})();
