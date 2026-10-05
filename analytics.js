(() => {
  "use strict";

  const SESSION_KEY = "rilmia_session_id";
  const UTM_KEY = "rilmia_utm";

  function randomId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "ses_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  }

  function sessionId() {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }

  function captureUtm() {
    const url = new URL(window.location.href);
    const current = {
      utm_source: url.searchParams.get("utm_source") || "",
      utm_medium: url.searchParams.get("utm_medium") || "",
      utm_campaign: url.searchParams.get("utm_campaign") || ""
    };

    if (current.utm_source || current.utm_medium || current.utm_campaign) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(current));
      return current;
    }

    try {
      return JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function context(extra = {}) {
    const utm = captureUtm();

    return {
      sessionId: sessionId(),
      page: window.location.pathname + window.location.search,
      referrer: document.referrer || "",
      utm_source: utm.utm_source || "",
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
      ...extra
    };
  }

  async function track(eventType, extra = {}) {
    try {
      await window.RilmiaAPI.call("track", {
        eventType,
        ...context(extra)
      });
    } catch (error) {
      // L'analytics non deve mai bloccare la navigazione.
      console.warn("RILMIA analytics:", error.message);
    }
  }

  window.RilmiaAnalytics = Object.freeze({
    track,
    context,
    sessionId
  });
})();
