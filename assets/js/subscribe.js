\
(() => {
  "use strict";

  let currentProduct = null;
  let modal = null;
  let form = null;
  let previouslyFocused = null;

  function init(product) {
    currentProduct = product;
    modal = document.querySelector("[data-interest-modal]");
    form = document.querySelector("[data-interest-form]");

    if (!modal || !form) return;

    document.querySelectorAll("[data-open-interest]").forEach(button => {
      button.addEventListener("click", () => {
        window.RilmiaAnalytics.track("cta_click", {
          productId: currentProduct.id,
          productSlug: currentProduct.slug
        });
        open();
      });
    });

    modal.querySelectorAll("[data-close-modal]").forEach(element => {
      element.addEventListener("click", close);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.hidden) close();
    });

    form.addEventListener("submit", onSubmit);
  }

  function open() {
    previouslyFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");

    const title = modal.querySelector("[data-modal-product]");
    if (title) title.textContent = currentProduct.nome;

    requestAnimationFrame(() => {
      const email = form.querySelector('input[name="email"]');
      if (email) email.focus();
    });
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  }

  async function onSubmit(event) {
    event.preventDefault();

    const submit = form.querySelector('button[type="submit"]');
    const status = form.querySelector("[data-form-status]");
    const data = new FormData(form);

    submit.disabled = true;
    submit.textContent = "Invio…";
    status.textContent = "";

    try {
      const analyticsContext = window.RilmiaAnalytics.context();

      const response = await window.RilmiaAPI.call("subscribe", {
        productId: currentProduct.id,
        productSlug: currentProduct.slug,
        email: String(data.get("email") || "").trim(),
        priceInterest: String(data.get("priceInterest") || "").trim(),
        privacyConsent: data.get("privacyConsent") === "on",
        source: "product_page",
        ...analyticsContext
      });

      if (!response || !response.success) {
        throw new Error(
          (response && response.message) ||
          "Non è stato possibile completare l'iscrizione."
        );
      }

      form.reset();
      form.querySelector(".interest-form__fields").hidden = true;
      submit.hidden = true;

      const success = form.querySelector("[data-form-success]");
      success.hidden = false;

      const successTitle = success.querySelector("strong");
      const successText = success.querySelector("span");

      if (response.duplicate) {
        successTitle.textContent = "Sei già nella lista.";
        successText.textContent =
          "Non serve fare altro: ti avviseremo quando ci saranno novità.";
      } else {
        successTitle.textContent = "Interesse registrato.";
        successText.textContent =
          "Quando questo pezzo sarà pronto, sarai tra i primi a saperlo.";
      }
    } catch (error) {
      status.textContent = error.message || "Qualcosa è andato storto.";
      status.focus();
    } finally {
      submit.disabled = false;
      submit.textContent = "Avvisami quando esce";
    }
  }

  window.RilmiaSubscribe = Object.freeze({ init });
})();
