/**
 * Toggles active state for an accordion-like clickable block.
 * @param {HTMLElement} clickableBlock
 * @param {string} activeClass
 */
function slide(clickableBlock, activeClass) {
  clickableBlock.onclick = (e) => {
    e.preventDefault();
    clickableBlock.classList.toggle(activeClass);
    clickableBlock.nextElementSibling.classList.toggle(activeClass);
  };
}

const regexpScrollLink = /^#/;

const regexpRedirectLink = /^https?:/;

const baseOffset = 20;
const toTopShowOffset = 500;
const cookieConsentStorageKey = "cookie_consent_accepted";

/**
 * Returns top offset for smooth scrolling with sticky header compensation.
 * @returns {number}
 */
function getHeaderOffset() {
  const header = document.querySelector(".header");
  const headerHeight = header ? header.clientHeight : 0;
  return headerHeight + baseOffset;
}

/**
 * Binds smooth scroll behavior to a link for a target block id.
 * @param {HTMLElement} link
 * @param {string} blockId
 */
function scrollToBlock(link, blockId) {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const block =
      document.getElementById(blockId) || document.querySelector(`#${blockId}`);
    if (!block) return;

    const rect = block.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetTop = rect.top + scrollTop - getHeaderOffset();

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  });
}

/**
 * Initializes collapsible "miracle" sections.
 * @returns {void}
 */
function initMiracleSlides() {
  const slidesMiracle = document.querySelectorAll(".section-miracle__header");
  slidesMiracle.forEach((clickableBlock) => slide(clickableBlock, "active"));
}

/**
 * Initializes "show more" buttons and related label switching.
 * @returns {void}
 */
function initShowMore() {
  const btnsShowMore = document.querySelectorAll(".btn-show-more");
  btnsShowMore.forEach((btn) => {
    const hiddenElements = btn.previousElementSibling?.querySelectorAll(".hidden") ?? [];
    btn.onclick = (e) => {
      e.preventDefault();
      btn.classList.toggle("active");
      hiddenElements.forEach((el) => el.classList.toggle("hidden"));

      const label = btn.querySelector("span");
      if (!label) return;

      if (btn.classList.contains("active")) {
        label.textContent = "Скрыть";
        if (btn.dataset.parentId) {
          scrollToBlock(btn, btn.dataset.parentId);
        }
      } else {
        label.textContent = "Развернуть все";
      }
    };
  });
}

/**
 * Binds smooth scrolling to in-page anchor links.
 * @returns {void}
 */
function initAnchorScroll() {
  const allLinksInPage = document.querySelectorAll("a");
  allLinksInPage.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isScrollLink = regexpScrollLink.test(href);
    const isRedirectLink = regexpRedirectLink.test(href);

    if (isRedirectLink) return;
    if (isScrollLink) scrollToBlock(link, href.substring(1));
  });
}

/**
 * Initializes "scroll to top" button visibility and click behavior.
 * @returns {void}
 */
function initScrollToTop() {
  const toTopBtn = document.querySelector(".js-to-top-btn");
  if (!toTopBtn) return;

  let topOffset = 0;
  toTopBtn.style.display = "none";

  toTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", () => {
    topOffset = window.pageYOffset || document.documentElement.scrollTop;
    if (topOffset > toTopShowOffset) {
      toTopBtn.style.display = "";
    } else {
      toTopBtn.style.display = "none";
    }
  });
}

/**
 * Initializes the prayer form pricing, dynamic fields and submit flow.
 * @returns {void}
 */
function initPrayerForm() {
  //const prayerForm = document.forms.prayer;
  const prayerForm = document.querySelector('[data-form="treby"]');

  if (prayerForm) {
    const chosePrayerButtonsHandler = prayerForm.querySelector(".section-prayer__chose");
    const itemCounters = Array.from(prayerForm.querySelectorAll(".count"));
    const totalNode = prayerForm.querySelector(".section-prayer__total");
    const totalNodeInput = prayerForm.querySelector(".cloud-donation-sum");
    const donationInput = prayerForm.querySelector("input[donate-to-good-causes]");
    const videoReportSection = prayerForm.querySelector(".section-prayer-video-respond");
    const videoCheckbox = videoReportSection?.querySelector("input[type='checkbox']") ?? null;
    const videoEmailInput =
      videoReportSection?.querySelector('input[name="email"], input[name="e-mail"]') ?? null;

    const updateVideoEmailRequired = () => {
      if (!videoEmailInput) return;
      if (videoCheckbox && videoCheckbox.checked) {
        videoEmailInput.disabled = false;
        videoEmailInput.setAttribute("required", "");
      } else {
        videoEmailInput.disabled = true;
        videoEmailInput.removeAttribute("required");
        videoEmailInput.value = "";
      }
    };

    const resetVideoReportSection = () => {
      if (!videoReportSection) return;

      videoReportSection.querySelectorAll("input").forEach((el) => {
        if (el instanceof HTMLInputElement) {
          if (el.type === "checkbox") {
            el.checked = false;
          } else {
            el.value = "";
          }
        }
      });

      updateVideoEmailRequired();
      calculateTotal();
    };

    const syncVideoReportVisibility = (prayerButton) => {
      if (!videoReportSection) return;
      const videoReportFlag = prayerButton.closest(".section-prayer__item").dataset.videoReport;
      //console.log('videoReportFlag', videoReportFlag);
      resetVideoReportSection();

      if (videoReportFlag === "Y") {
        //console.log('videoReportSection.hidden = "false"', videoReportSection.hidden);
        videoReportSection.hidden = false;
      } else {
        //console.log('videoReportSection.hidden = "true"', videoReportSection.hidden);
        videoReportSection.hidden = true;
      }
    };

    updateVideoEmailRequired();
    videoCheckbox?.addEventListener("change", updateVideoEmailRequired);

    let nameValues = [];

    const calculateTotal = () => {
      let total = 0;

      const activePrayerButton = prayerForm.querySelector(
        ".section-prayer__chose .section-prayer__item.active button[data-value]"
      );

      if (activePrayerButton) {
        const basePrice = parseInt(activePrayerButton.dataset.value, 10);
        if (!isNaN(basePrice)) {

          const nameInputs = prayerForm.querySelectorAll(".section-prayer__names input[name='name[]']");
          if (nameInputs.length > 1) {
            const nameCount = Array.from(nameInputs).filter(
              (input) => (input.value && input.value.trim()) !== ""
            ).length;
            total += basePrice * nameCount;
          } else {
            total += basePrice;
          }
        }
      }

      const priceInputs = prayerForm.querySelectorAll(
        ".section-prayer-additional__item input[type='text'][data-price]"
      );

      priceInputs.forEach((input) => {
        const count = parseInt(input.value, 10);
        const price = parseInt(input.dataset.price, 10);
        if (!isNaN(count) && count > 0 && !isNaN(price)) {
          total += count * price;
        }
      });

      if (videoCheckbox && videoCheckbox.checked) {
        const videoPrice = parseInt(videoCheckbox.dataset.price, 10);
        if (!isNaN(videoPrice)) {
          total += videoPrice;
        }
      }

      if (donationInput) {
        const raw = donationInput.value.trim();
        if (raw) {
          const numeric = parseInt(raw.replace(/[^\d]/g, ""), 10);
          if (!isNaN(numeric)) {
            total += numeric;
          }
        }
      }

      if (totalNode) {
        totalNode.textContent = `${total} руб.`;
      }
      
      if (totalNodeInput) {
        totalNodeInput.value = total;
      }
    };

    itemCounters?.forEach((countElement) => {
      const minusButton = countElement.querySelector("button:first-child");
      const plusButton = countElement.querySelector("button:nth-child(3)");
      const MAX_COUNT = countElement.dataset.max;
      const inputElement = countElement.querySelector('input[type="text"]');

      minusButton.addEventListener("click", (e) => {
        e.preventDefault();
        let currentValue = parseInt(inputElement.value, 10);
        if (isNaN(currentValue) || currentValue < 1) return (currentValue = 1);

        inputElement.value = --currentValue;
        logicAfterCalculateValue({
          value: inputElement.value,
        });

      });

      plusButton.addEventListener("click", (e) => {
        e.preventDefault();
        let currentValue = parseInt(inputElement.value, 10);
        if (isNaN(currentValue)) return (currentValue = 1);
        if (!isNaN(MAX_COUNT) && currentValue >= MAX_COUNT) return (currentValue = MAX_COUNT);

        inputElement.value = ++currentValue;
        logicAfterCalculateValue({
          value: inputElement.value,
        });

      });

      const logicAfterCalculateValue = ({ value }) => {
        inputElement.setAttribute("value", value);
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));
      };
    });

    const additionalNames = prayerForm.querySelector(".section-prayer__names");

    if (additionalNames) {
      nameValues.length = 0;
      additionalNames.querySelectorAll("input[name='name[]']").forEach((input) => {
        nameValues.push((input.value && input.value.trim()) || "");
      });

      const buttonAddName = additionalNames.querySelector(".section-prayer__add-name");

      const nameAllowedPattern = /[^a-zA-Zа-яА-ЯёЁ\s\-']/g;

      additionalNames.addEventListener("input", (e) => {
        const input = e.target;
        if (!input || !input.matches("input[name='name[]']")) return;
        const start = input.selectionStart;
        const oldValue = input.value;
        const newValue = oldValue.replace(nameAllowedPattern, "");
        if (oldValue !== newValue) {
          input.value = newValue;
          input.setSelectionRange(start, start);
        }
        const inputs = additionalNames.querySelectorAll("input[name='name[]']");
        const index = Array.from(inputs).indexOf(input);
        if (index !== -1) {
          nameValues[index] = (input.value && input.value.trim()) || "";
          calculateTotal();
        }
      });

      buttonAddName.onclick = (e) => {
        e.preventDefault();
        const inputs = additionalNames.querySelectorAll("input[name='name[]']");
        const firstEmpty = Array.from(inputs).find(
          (input) => !(input.value && input.value.trim())
        );
        if (firstEmpty) {
          firstEmpty.focus();
          firstEmpty.reportValidity();
          return;
        }
        createNodeHandler(inputs.length);
      };

      const MAX_NAMES_COUNT = 10;

      const updateRemoveButtonsVisibility = () => {
        const rows = additionalNames.querySelectorAll(".section-prayer__name-row");
        const visible = rows.length > 1;
        rows.forEach((row) => {
          const btn = row.querySelector(".section-prayer__remove-name");
          if (btn) btn.style.display = visible ? "" : "none";
        });
      };

      updateRemoveButtonsVisibility();

      const createNodeHandler = (id) => {
        if (id >= MAX_NAMES_COUNT) return (buttonAddName.style.display = "none");
        const row = document.createElement("div");
        nameValues.push("");
        row.classList.add("section-prayer__name-row", "float-field");
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form_input";
        input.placeholder = " ";
        input.name = "name[]";
        input.id = `prayer-name-${id}-${Date.now()}`;
        input.required = true;
        input.maxLength = 20;
        const floatLabel = document.createElement("label");
        floatLabel.setAttribute("for", input.id);
        floatLabel.textContent = "Введите имя";
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "section-prayer__remove-name";
        removeBtn.title = "Удалить";
        removeBtn.setAttribute("aria-label", "Удалить имя");
        removeBtn.textContent = "−";
        row.appendChild(input);
        row.appendChild(floatLabel);
        row.appendChild(removeBtn);
        additionalNames.insertBefore(row, buttonAddName);
        updateRemoveButtonsVisibility();
      };

      additionalNames.addEventListener("click", (e) => {
        const removeBtn = e.target.closest(".section-prayer__remove-name");
        if (!removeBtn) return;
        e.preventDefault();
        const row = removeBtn.closest(".section-prayer__name-row");
        const rows = additionalNames.querySelectorAll(".section-prayer__name-row");
        if (rows.length <= 1) return;
        const index = Array.from(rows).indexOf(row);
        if (index !== -1) nameValues.splice(index, 1);
        if (row) row.remove();
        updateRemoveButtonsVisibility();
        calculateTotal();
      });
    }

    prayerForm.addEventListener("change", (e) => {
      const target = e.target;
      if (!target) return;

      if (
        target.matches(".section-prayer-additional__item input[type='text'][data-price]") ||
        target === donationInput ||
        target === videoCheckbox
      ) {
        calculateTotal();
      }
    });

    function buildPrayerFormData() {
      const formData = new FormData(prayerForm);

      let cID = "";
      window.ym?.(window.MODx_counterId, "getClientID", function (clientID) {
        cID = clientID;
      });

      function ClientID() {
        const match = document.cookie.match('(?:^|;)\\s*_ym_uid=([^;]*)');
        return match ? decodeURIComponent(match[1]) : false;
      }
      if (cID !== "") {
        cID = ClientID();
      }

      formData.set("clientID", cID ?? "");

      const activeBtn = prayerForm.querySelector(
        ".section-prayer__chose .section-prayer__item.active button[data-value][data-prayer]"
      );
      if (activeBtn) {
        formData.set("resource_name", activeBtn.dataset.prayer ?? "");
        formData.set("resource_price", activeBtn.dataset.value ?? "");
      }

      const priceInputs = prayerForm.querySelectorAll(
        ".section-prayer-additional__item input[type='text'][data-price]"
      );
      for (let i = 0; i < priceInputs.length; i++)
        formData.set("prices[" + priceInputs[i].name + "]", priceInputs[i].dataset.price ?? 0);

      if (totalNode) {
        const totalText = totalNode.textContent?.replace(/\D/g, "") || "0";
        formData.set("total", totalText);
      }

      return formData;
    }

    function logFormDataForDebug(fd) {
      const obj = {};
      for (const [key, value] of fd.entries()) {
        if (!key) continue;
        if (key in obj) {
          if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      }
      console.log("Данные формы записки (отправка на бэк):", obj);
    }

    prayerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = buildPrayerFormData();
      logFormDataForDebug(formData);

      try {
        const response = await sendPrayer(formData);

        if (!response) return;
        if (response.redirected && response.url) {
          window.location.href = response.url;
          return;
        }

        let payload = null;
        try {
          payload = await response.json();
        } catch (err) {
          payload = null;
        }
        if (payload) {
          if (payload.script !== undefined && payload.script !== "") {
            pays(prayerForm.id, payload.script);
          } else if (payload.url !== undefined && payload.url) {
            window.location.assign(payload.url);
          }
        }

      } catch (error) {
        console.error("Ошибка при отправке формы", error);
      }
    });
    if (chosePrayerButtonsHandler) {
      chosePrayerButtonsHandler.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button || !chosePrayerButtonsHandler.contains(button)) return;

        chosePrayerButtonsHandler
          .querySelectorAll("button")
          .forEach((btn) => {
            btn.textContent = "Выбрать";
            btn.closest(".section-prayer__item").classList.remove("active");
          });

        button.textContent = "Выбрано";

        const parentItem = button.closest(".section-prayer__item");

        parentItem.classList.add("active");

        setSelectedPrayer(parentItem);
        syncVideoReportVisibility(button);

        calculateTotal();
      });

      const firstPrayerButton = chosePrayerButtonsHandler.querySelector(
        ".section-prayer__item button[data-prayer]"
      );
      
      if (firstPrayerButton) {
        firstPrayerButton.click();
      }
    }

    function setSelectedPrayer(parentItem) {
      const prayerTitleNode = parentItem.querySelector(".section-prayer-item__info").querySelector(".h3");
      const prayerLabelNode = parentItem.querySelector(".section-prayer-item__info").querySelector("p");
      if (prayerTitleNode) {
        const selectedPrayerTitleNode = prayerForm.querySelector(".section-prayer__selected-prayer-title");
        const selectedPrayerLabelNode = prayerForm.querySelector(".section-prayer__selected-prayer-label");
        selectedPrayerTitleNode.textContent = prayerTitleNode.textContent || "Не выбран";
        selectedPrayerLabelNode.textContent = prayerLabelNode?.textContent || "";
      }
    }

    const sendPrayer = async (data) => {
      const response = await fetch(document.location.href, {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        body: data,
        ...baseRedirectOptions,
      });
      return response;
    };

  }
}
/**
 * Floating video banner: toggle mute/expand, close hides widget, click-outside to collapse.
 * Requires jQuery (loaded before this file in footer).
 * @returns {void}
 */
function initVideoWidget() {
  if (typeof window.jQuery === "undefined") return;

  const $ = window.jQuery;
  const $widget = $(".video-widget");
  const videoEl = document.getElementById("video-widget__video");

  if (!$widget.length || !videoEl) return;

  $(".video-widget__close").on("click", function (t) {
    t.preventDefault();
    t.stopPropagation();
    // if ($widget.attr("data-state") === "default") {
    //   $widget.hide();
    // } else {
    //   $widget.attr("data-state", "default");
    //   videoEl.muted = true;
    // }
    $widget.attr("data-state", "default");
    videoEl.muted = true;
    $widget.hide();
    return false;
  });

  $widget.find(".video-widget__button").on("click", function (t) {
    t.stopPropagation();
  });

  $widget.find(".video-widget__container").on("click", function () {
    if ($widget.attr("data-state") === "default") {
      $widget.attr("data-state", "opened");
      videoEl.currentTime = 0;
      videoEl.muted = false;
    } else {
      $widget.attr("data-state", "default");
      videoEl.muted = true;
    }
  });

  if ($(document).width() > 1024) {
    $widget.find(".video-widget__container").on("touchstart", function () {
      if ($widget.attr("data-state") === "default") {
        $widget.attr("data-state", "opened");
        videoEl.currentTime = 0;
        videoEl.muted = false;
      } else {
        $widget.attr("data-state", "default");
        videoEl.muted = true;
      }
    });
  }

  $(document).on("mouseup", function (t) {
    if (
      $widget.is(t.target) ||
      $widget.has(t.target).length !== 0 ||
      $widget.attr("data-state") === "default"
    ) {
      return;
    }
    $widget.attr("data-state", "default");
    videoEl.muted = true;
  });
}

/**
 * jQuery accordion.
 * Markup:
 * - root:        [data-accordion]
 * - item:        [data-accordion-item]
 * - header btn:  [data-accordion-trigger]
 * - panel:       [data-accordion-panel]
 * Options:
 * - data-accordion="single" | "multi" (default: single)
 * - data-accordion-speed="200" (ms, default: 200)
 * @returns {void}
 */
function initAccordionJq() {
  if (typeof window.jQuery === "undefined") return;
  const $ = window.jQuery;

  const $accordions = $("[data-accordion]");
  if (!$accordions.length) return;

  $accordions.each(function () {
    const $root = $(this);
    const mode = ($root.attr("data-accordion") || "single").toLowerCase();
    const speedRaw = parseInt($root.attr("data-accordion-speed"), 10);
    const speed = Number.isFinite(speedRaw) ? speedRaw : 200;

    const $items = $root.find("[data-accordion-item]");

    const setPanelHeight = (panelEl, valuePx) => {
      panelEl.style.maxHeight = valuePx;
    };

    const openItem = ($item) => {
      const triggerEl = $item.find("[data-accordion-trigger]").first().get(0);
      const panelEl = $item.find("[data-accordion-panel]").first().get(0);
      if (!triggerEl || !panelEl) return;

      $item.addClass("is-open");
      triggerEl.setAttribute("aria-expanded", "true");
      panelEl.setAttribute("aria-hidden", "false");
      panelEl.style.transitionDuration = `${speed}ms`;
      setPanelHeight(panelEl, `${panelEl.scrollHeight}px`);
    };

    const closeItem = ($item) => {
      const triggerEl = $item.find("[data-accordion-trigger]").first().get(0);
      const panelEl = $item.find("[data-accordion-panel]").first().get(0);
      if (!triggerEl || !panelEl) return;

      // set current height first so transition always plays
      panelEl.style.transitionDuration = `${speed}ms`;
      setPanelHeight(panelEl, `${panelEl.scrollHeight}px`);

      window.requestAnimationFrame(() => {
        $item.removeClass("is-open");
        triggerEl.setAttribute("aria-expanded", "false");
        panelEl.setAttribute("aria-hidden", "true");
        setPanelHeight(panelEl, "0px");
      });
    };

    // init: set initial state (closed by default)
    $items.each(function () {
      const $item = $(this);
      const $trigger = $item.find("[data-accordion-trigger]").first();
      const $panel = $item.find("[data-accordion-panel]").first();

      if (!$trigger.length || !$panel.length) return;

      const isOpen = $item.hasClass("is-open") || $trigger.attr("aria-expanded") === "true";
      $trigger.attr("aria-expanded", isOpen ? "true" : "false");
      $panel.attr("aria-hidden", isOpen ? "false" : "true");
      $panel.get(0).style.transitionDuration = `${speed}ms`;
      $panel.get(0).style.maxHeight = isOpen ? `${$panel.get(0).scrollHeight}px` : "0px";
    });

    $root.on("click", "[data-accordion-trigger]", function (e) {
      e.preventDefault();

      const $trigger = $(this);
      const $item = $trigger.closest("[data-accordion-item]");
      const $panel = $item.find("[data-accordion-panel]").first();
      if (!$panel.length) return;

      const isOpen = $item.hasClass("is-open");

      if (mode !== "multi") {
        $items.not($item).filter(".is-open").each(function () {
          closeItem($(this));
        });
      }

      if (isOpen) {
        closeItem($item);
      } else {
        openItem($item);
      }
    });
  });
}

/**
 * Initializes cookie consent banner visibility and persistence.
 * @returns {void}
 */
function initCookieBanner() {
  const cookieBanner = document.querySelector("#cookie-banner");
  const cookieAcceptBtn = cookieBanner.querySelector("#cookie-accept");

  if (!cookieBanner || !cookieAcceptBtn) return;

  if (!localStorage.getItem(cookieConsentStorageKey)) {
    cookieBanner.hidden = false;
  }
  
  cookieAcceptBtn.addEventListener("click", () => {
    cookieBanner.hidden = true;
    localStorage.setItem(cookieConsentStorageKey, "true");
  });
}

/**
 * Handles initial hash scroll on full page load.
 * @returns {void}
 */
function handleScrollOnPageLoad() {
  const hash = window.location.hash;
  if (!hash || hash === "#") return;

  const blockId = hash.substring(1);

  const block =
    document.getElementById(blockId) ||
    document.querySelector(hash) ||
    document.querySelector(`.${blockId}`);

  if (!block) return;
  const rect = block.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const targetTop = rect.top + scrollTop - getHeaderOffset();

  window.scrollTo({
    top: targetTop,
    behavior: "smooth",
  });
}

const baseRedirectOptions = {
  redirect: "follow",
};

window.addEventListener("load", () => {
  handleScrollOnPageLoad();
});

document.addEventListener("DOMContentLoaded", () => {
  initMiracleSlides();
  initShowMore();
  initAnchorScroll();
  initScrollToTop();
  initPrayerForm();
  initVideoWidget();
  initAccordionJq();
  initCookieBanner();
});
