(function () {
  var LANGUAGE_STORAGE_KEY = "smartagro_language";
  var DEVANAGARI_FONT_LINK_ID = "smartagro-devanagari-font-link";
  var DEVANAGARI_FONT_STYLE_ID = "smartagro-devanagari-font-style";
  var DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  var DEVANAGARI_TO_LATIN = {
    "०": "0",
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9"
  };

  function getLanguage() {
    var lang = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
    return lang === "hi" || lang === "mr" ? lang : "en";
  }

  function ensureDevanagariFontLink() {
    if (document.getElementById(DEVANAGARI_FONT_LINK_ID)) return;

    var link = document.createElement("link");
    link.id = DEVANAGARI_FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }

  function ensureDevanagariFontStyle() {
    if (document.getElementById(DEVANAGARI_FONT_STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = DEVANAGARI_FONT_STYLE_ID;
    style.textContent = "html[data-smartagro-lang='hi'] body, html[data-smartagro-lang='mr'] body, html[data-smartagro-lang='hi'] input, html[data-smartagro-lang='mr'] input, html[data-smartagro-lang='hi'] select, html[data-smartagro-lang='mr'] select, html[data-smartagro-lang='hi'] button, html[data-smartagro-lang='mr'] button, html[data-smartagro-lang='hi'] option, html[data-smartagro-lang='mr'] option, html[data-smartagro-lang='hi'] textarea, html[data-smartagro-lang='mr'] textarea { font-family: 'Noto Sans Devanagari', 'Poppins', sans-serif !important; }";
    document.head.appendChild(style);
  }

  function applyLanguageFont(lang) {
    document.documentElement.setAttribute("data-smartagro-lang", lang);
    if (lang === "hi" || lang === "mr") {
      ensureDevanagariFontLink();
      ensureDevanagariFontStyle();
    }
  }

  function normalizeToLatinDigits(text) {
    return String(text).replace(/[०-९]/g, function (digit) {
      return DEVANAGARI_TO_LATIN[digit] || digit;
    });
  }

  function convertDigitsForLanguage(text, lang) {
    var normalized = normalizeToLatinDigits(text);
    if (lang === "hi" || lang === "mr") {
      return normalized.replace(/[0-9]/g, function (digit) {
        return DEVANAGARI_DIGITS[Number(digit)];
      });
    }
    return normalized;
  }

  function shouldSkipTextNode(textNode) {
    var parent = textNode && textNode.parentElement;
    if (!parent) return true;
    var tag = parent.tagName;
    return tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "TEXTAREA" || tag === "PRE" || tag === "CODE";
  }

  function localizeTextNodes(root, lang) {
    var scope = root || document.body || document.documentElement;
    if (!scope) return;

    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      if (shouldSkipTextNode(node)) continue;

      var next = convertDigitsForLanguage(node.nodeValue, lang);
      if (next !== node.nodeValue) {
        node.nodeValue = next;
      }
    }
  }

  function localizeAttribute(el, attrName, lang) {
    if (!el.hasAttribute(attrName)) return;
    var current = el.getAttribute(attrName);
    var next = convertDigitsForLanguage(current, lang);
    if (next !== current) el.setAttribute(attrName, next);
  }

  function localizeAttributes(root, lang) {
    var scope = root || document;
    var selectors = [
      "[placeholder]",
      "[title]",
      "[aria-label]",
      "option",
      "input[type='button']",
      "input[type='submit']",
      "input[type='reset']"
    ];

    scope.querySelectorAll(selectors.join(",")).forEach(function (el) {
      localizeAttribute(el, "placeholder", lang);
      localizeAttribute(el, "title", lang);
      localizeAttribute(el, "aria-label", lang);

      if (el.tagName === "OPTION") {
        var text = el.textContent;
        var updated = convertDigitsForLanguage(text, lang);
        if (updated !== text) el.textContent = updated;
      }

      if (el.tagName === "INPUT") {
        localizeAttribute(el, "value", lang);
      }
    });
  }

  function applyNumberLocalization() {
    var lang = getLanguage();
    applyLanguageFont(lang);
    localizeTextNodes(document.body || document.documentElement, lang);
    localizeAttributes(document, lang);
  }

  var scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      applyNumberLocalization();
    });
  }

  function initObserver() {
    var target = document.body || document.documentElement;
    if (!target) return;

    var observer = new MutationObserver(function () {
      scheduleApply();
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  document.addEventListener("language-changed", function () {
    scheduleApply();
  });

  window.addEventListener("storage", function (event) {
    if (!event || event.key === LANGUAGE_STORAGE_KEY) {
      scheduleApply();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyNumberLocalization();
      initObserver();
    });
  } else {
    applyNumberLocalization();
    initObserver();
  }
})();
