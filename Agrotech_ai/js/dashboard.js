let uid, db;
let devices = {};
let dashboardCfg = {};
let catalog = {};
let activeDevice = null;
let didBootstrapCfg = false;
let uiBound = false;
let deviceDataPath = "";

const ready = { devices: false, dashboard: false, catalog: false };
const sortableByDevice = {};
const CARD_TYPES = ["display", "toggle", "number-input"];
const DASH_LANGUAGE_STORAGE_KEY = "smartagro_language";

const DASH_I18N = {
  en: {
    dashboardTitle: "Dashboard",
    addDashboardDeviceBtn: "Add Device",
    adminLoginRequired: "Admin login required",
    loadingTitle: "Loading dashboard...",
    loadingDesc: "Connecting to your data.",
    noDevicesTitle: "No devices found",
    noWidgetsNote: "No widgets available for this device yet.",
    nothingToShowTitle: "Nothing to show yet",
    nothingToShowDesc: "No renderable device cards are available.",
    customizeBtn: "Customize",
    addLabel: "Add",
    updateLabel: "Update",
    selectOneCard: "Select at least one card.",
    customizeDeviceNameLabel: "Device Name",
    customizeDeviceTypeLabel: "Device Type",
    customizeAddCardLabel: "Add New Card",
    addCardBtn: "Add Card",
    removeDeviceBtn: "Remove Device",
    customizeCancelBtn: "Cancel",
    customizeSaveBtn: "Save",
    addDeviceModalTitle: "Add Device To Dashboard",
    addDeviceLabel: "Device",
    addDeviceDisplayNameLabel: "Display Name (optional)",
    addDeviceTypeLabel: "Device Type",
    cardsToShowLabel: "Cards To Show",
    addDeviceCancelBtn: "Cancel",
    addDeviceEmptyMsg: "No available devices to add.",
    addDeviceNamePlaceholder: "Use custom dashboard name",
    visibleLabel: "Visible",
    customCardNamePlaceholder: "Custom card name",
    removeLabel: "Remove",
    onLabel: "ON",
    offLabel: "OFF"
  },
  hi: {
    dashboardTitle: "डैशबोर्ड",
    addDashboardDeviceBtn: "डिवाइस जोड़ें",
    adminLoginRequired: "एडमिन लॉगिन आवश्यक है",
    loadingTitle: "डैशबोर्ड लोड हो रहा है...",
    loadingDesc: "आपके डेटा से कनेक्ट किया जा रहा है।",
    noDevicesTitle: "कोई डिवाइस नहीं मिला",
    noWidgetsNote: "इस डिवाइस के लिए अभी कोई विजेट उपलब्ध नहीं है।",
    nothingToShowTitle: "अभी दिखाने के लिए कुछ नहीं",
    nothingToShowDesc: "दिखाने योग्य डिवाइस कार्ड उपलब्ध नहीं हैं।",
    customizeBtn: "कस्टमाइज़",
    addLabel: "जोड़ें",
    updateLabel: "अपडेट",
    selectOneCard: "कम से कम एक कार्ड चुनें।",
    customizeDeviceNameLabel: "डिवाइस नाम",
    customizeDeviceTypeLabel: "डिवाइस प्रकार",
    customizeAddCardLabel: "नया कार्ड जोड़ें",
    addCardBtn: "कार्ड जोड़ें",
    removeDeviceBtn: "डिवाइस हटाएं",
    customizeCancelBtn: "रद्द करें",
    customizeSaveBtn: "सेव करें",
    addDeviceModalTitle: "डैशबोर्ड में डिवाइस जोड़ें",
    addDeviceLabel: "डिवाइस",
    addDeviceDisplayNameLabel: "डिस्प्ले नाम (वैकल्पिक)",
    addDeviceTypeLabel: "डिवाइस प्रकार",
    cardsToShowLabel: "दिखाने वाले कार्ड",
    addDeviceCancelBtn: "रद्द करें",
    addDeviceEmptyMsg: "जोड़ने के लिए कोई उपलब्ध डिवाइस नहीं है।",
    addDeviceNamePlaceholder: "कस्टम डैशबोर्ड नाम उपयोग करें",
    visibleLabel: "दिखाएं",
    customCardNamePlaceholder: "कस्टम कार्ड नाम",
    removeLabel: "हटाएं",
    onLabel: "चालू",
    offLabel: "बंद"
  },
  mr: {
    dashboardTitle: "डॅशबोर्ड",
    addDashboardDeviceBtn: "डिव्हाइस जोडा",
    adminLoginRequired: "अ‍ॅडमिन लॉगिन आवश्यक आहे",
    loadingTitle: "डॅशबोर्ड लोड होत आहे...",
    loadingDesc: "तुमच्या डेटाशी कनेक्ट करत आहे.",
    noDevicesTitle: "कोणतेही डिव्हाइस सापडले नाही",
    noWidgetsNote: "या डिव्हाइससाठी सध्या कोणतेही विजेट उपलब्ध नाहीत.",
    nothingToShowTitle: "दाखवण्यासाठी काहीही नाही",
    nothingToShowDesc: "दाखवण्यायोग्य डिव्हाइस कार्ड उपलब्ध नाहीत.",
    customizeBtn: "कस्टमाइझ",
    addLabel: "जोडा",
    updateLabel: "अपडेट",
    selectOneCard: "किमान एक कार्ड निवडा.",
    customizeDeviceNameLabel: "डिव्हाइस नाव",
    customizeDeviceTypeLabel: "डिव्हाइस प्रकार",
    customizeAddCardLabel: "नवे कार्ड जोडा",
    addCardBtn: "कार्ड जोडा",
    removeDeviceBtn: "डिव्हाइस काढा",
    customizeCancelBtn: "रद्द करा",
    customizeSaveBtn: "सेव्ह करा",
    addDeviceModalTitle: "डॅशबोर्डमध्ये डिव्हाइस जोडा",
    addDeviceLabel: "डिव्हाइस",
    addDeviceDisplayNameLabel: "डिस्प्ले नाव (पर्यायी)",
    addDeviceTypeLabel: "डिव्हाइस प्रकार",
    cardsToShowLabel: "दाखवायची कार्डे",
    addDeviceCancelBtn: "रद्द करा",
    addDeviceEmptyMsg: "जोडण्यासाठी उपलब्ध डिव्हाइस नाहीत.",
    addDeviceNamePlaceholder: "कस्टम डॅशबोर्ड नाव वापरा",
    visibleLabel: "दृश्यमान",
    customCardNamePlaceholder: "कस्टम कार्ड नाव",
    removeLabel: "काढा",
    onLabel: "चालू",
    offLabel: "बंद"
  }
};

const CARD_TITLE_I18N = {
  en: {
    temperature: "Temperature",
    humidity: "Humidity",
    moisture: "Soil Moisture",
    moisturethreshold: "Moisture Threshold",
    status: "Valve",
    flow: "Flow",
    pressure: "Pressure",
    threshold: "Threshold",
    battery: "Battery",
    control: "Valve Control",
    ontime: "ON Time",
    offtime: "OFF Time",
    highthreshold: "High Threshold",
    lowthreshold: "Low Threshold"
  },
  hi: {
    temperature: "तापमान",
    humidity: "नमी",
    moisture: "मिट्टी नमी",
    moisturethreshold: "नमी सीमा",
    status: "वाल्व",
    flow: "प्रवाह",
    pressure: "दबाव",
    threshold: "सीमा",
    battery: "बैटरी",
    control: "वाल्व नियंत्रण",
    ontime: "चालू समय",
    offtime: "बंद समय",
    highthreshold: "ऊपरी सीमा",
    lowthreshold: "निचली सीमा"
  },
  mr: {
    temperature: "तापमान",
    humidity: "आर्द्रता",
    moisture: "माती आर्द्रता",
    moisturethreshold: "आर्द्रता मर्यादा",
    status: "वाल्व",
    flow: "प्रवाह",
    pressure: "दाब",
    threshold: "मर्यादा",
    battery: "बॅटरी",
    control: "वाल्व नियंत्रण",
    ontime: "चालू वेळ",
    offtime: "बंद वेळ",
    highthreshold: "वरची मर्यादा",
    lowthreshold: "खालची मर्यादा"
  }
};

function getDashLang() {
  const lang = localStorage.getItem(DASH_LANGUAGE_STORAGE_KEY) || "en";
  return DASH_I18N[lang] ? lang : "en";
}

function tDash(key) {
  const lang = getDashLang();
  return (DASH_I18N[lang] && DASH_I18N[lang][key]) || DASH_I18N.en[key] || key;
}

function localizeDashDigits(text) {
  const lang = getDashLang();
  if (lang !== "hi" && lang !== "mr") return String(text);
  const devanagari = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(text).replace(/[0-9]/g, d => devanagari[Number(d)]);
}

function normalizeDashDigits(text) {
  return String(text || "").replace(/[०-९]/g, d => String("०१२३४५६७८९".indexOf(d)));
}

function normalizeCardTitleKey(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getTranslatedCardTitle(key, fallbackLabel) {
  const lang = getDashLang();
  const langMap = CARD_TITLE_I18N[lang] || CARD_TITLE_I18N.en;
  const normalized = normalizeCardTitleKey(key);
  return langMap[normalized] || fallbackLabel;
}

function resolveCardLabelForLang(key, storedLabel, baseLabel) {
  const normalized = normalizeCardTitleKey(key);
  const englishDefault = (CARD_TITLE_I18N.en[normalized] || baseLabel || humanize(key) || "").trim();
  const localized = getTranslatedCardTitle(key, englishDefault);

  const current = (storedLabel || "").trim();
  if (!current) return localized;

  const isDefaultLike = current === englishDefault || current === humanize(key) || normalizeCardTitleKey(current) === normalized;
  return isDefaultLike ? localized : current;
}

function canEditDashboard() {
  return localStorage.getItem("smartagro_admin_logged_in") === "1";
}

function applyEditLockUi() {
  const unlocked = canEditDashboard();
  const addBtn = document.getElementById("addDashboardDeviceBtn");
  const toggles = document.getElementById("deviceToggles");

  if (addBtn) {
    addBtn.disabled = !unlocked;
    addBtn.title = unlocked ? "" : tDash("adminLoginRequired");
  }
  if (toggles) toggles.classList.toggle("hide", !unlocked);
}

function showInitialPlaceholder() {
  const dash = document.getElementById("dashboard");
  if (dash && !dash.innerHTML.trim()) {
    dash.innerHTML = `<div class="empty-state"><h3>${tDash("loadingTitle")}</h3><p>${tDash("loadingDesc")}</p></div>`;
  }
}

function applyDashboardLanguage() {
  const keys = [
    "dashboardTitle",
    "addDashboardDeviceBtn",
    "customizeDeviceNameLabel",
    "customizeDeviceTypeLabel",
    "customizeAddCardLabel",
    "addCardBtn",
    "removeDeviceBtn",
    "customizeCancelBtn",
    "customizeSaveBtn",
    "addDeviceModalTitle",
    "addDeviceLabel",
    "addDeviceDisplayNameLabel",
    "addDeviceTypeLabel",
    "cardsToShowLabel",
    "addDeviceCancelBtn",
    "addDeviceEmptyMsg"
  ];

  keys.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = tDash(id);
  });

  const nameInput = document.getElementById("addDeviceNameInput");
  if (nameInput) nameInput.placeholder = tDash("addDeviceNamePlaceholder");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showInitialPlaceholder);
} else {
  showInitialPlaceholder();
}

const DEFAULT_CATALOG = {
  soil_sensor: {
    Temperature: { label: "Temperature", type: "display", unit: "degC", icon: "" },
    Humidity: { label: "Humidity", type: "display", unit: "%", icon: "" },
    Moisture: { label: "Soil Moisture", type: "display", unit: "%", icon: "" },
    MoistureThreshold: { label: "Moisture Threshold", type: "number-input", unit: "%", icon: "" }
  },
  valve: {
    status: { label: "Valve", type: "toggle", unit: "", icon: "" },
    flow: { label: "Flow", type: "display", unit: "L/min", icon: "" },
    pressure: { label: "Pressure", type: "display", unit: "kPa", icon: "" },
    threshold: { label: "Threshold", type: "number-input", unit: "", icon: "" }
  },
  generic: {}
};

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function collectMetricPaths(obj, prefix = "", depth = 0, out = []) {
  if (!isPlainObject(obj) || depth > 3) return out;

  Object.entries(obj).forEach(([key, value]) => {
    if (key === "type" || key === "name") return;
    const path = prefix ? `${prefix}/${key}` : key;

    if (isPlainObject(value)) {
      collectMetricPaths(value, path, depth + 1, out);
      return;
    }

    if (["string", "number", "boolean"].includes(typeof value) || value === null) {
      out.push(path);
    }
  });

  return out;
}

function getMetricKeysFromDevice(device) {
  return collectMetricPaths(device || {});
}

function getDeviceValueRef(deviceId, key) {
  return db.ref(`${deviceDataPath}/${deviceId}/${key}`);
}

async function resolveDevicePath() {
  const candidates = [
    `user/${uid}/devices`,
    `users/${uid}/devices`,
    `devices/${uid}`,
    `user/${uid}/device`,
    `users/${uid}/device`
  ];

  for (const path of candidates) {
    try {
      const snap = await db.ref(path).once("value");
      const val = snap.val();
      if (val && typeof val === "object" && Object.keys(val).length > 0) return path;
    } catch (err) {
      console.warn("resolveDevicePath probe failed for", path, err && err.message);
    }
  }

  return candidates[0];
}

async function subscribeDevices() {
  try {
    deviceDataPath = await resolveDevicePath();
  } catch (err) {
    console.warn("resolveDevicePath failed, using default", err && err.message);
    deviceDataPath = `user/${uid}/devices`;
  }

  db.ref(deviceDataPath).on(
    "value",
    s => {
      devices = s.val() || {};
      ready.devices = true;
      tryRender();
    },
    err => {
      console.warn("devices subscription error", err && err.message);
      devices = {};
      ready.devices = true;
      tryRender();
    }
  );
}

async function bootstrapNewUserData() {
  const initRef = db.ref(`user/${uid}/_meta/initialized`);
  let isNewUser = false;

  try {
    await initRef.transaction(current => {
      if (current == null) {
        isNewUser = true;
        return true;
      }
      return current;
    });
  } catch (err) {
    console.warn("new user bootstrap check failed", err && err.message);
    return;
  }

  if (!isNewUser) return;

  const email = (firebase.auth().currentUser && firebase.auth().currentUser.email) || "";
  const defaultName = email ? email.split("@")[0] : "New User";

  const starterDevice = {
    name: "Starter Valve",
    type: "valve",
    status: 0,
    flow: 0,
    pressure: 0,
    threshold: 50
  };

  const starterLayout = {
    name: "Starter Valve",
    type: "valve",
    visible: true,
    cards: {
      status: { visible: true, order: 1, label: "Valve", type: "toggle", unit: "", icon: "" },
      flow: { visible: true, order: 2, label: "Flow", type: "display", unit: "L/min", icon: "" },
      threshold: { visible: true, order: 3, label: "Threshold", type: "number-input", unit: "", icon: "" }
    }
  };

  const updates = {};
  updates[`user/${uid}/profile/name`] = defaultName;
  updates[`user/${uid}/profile/email`] = email;
  updates[`user/${uid}/devices/device1`] = starterDevice;
  updates[`user/${uid}/dashboard/devices/device1`] = starterLayout;

  try {
    await db.ref().update(updates);
  } catch (err) {
    console.warn("new user bootstrap seed failed", err && err.message);
  }
}

firebase.auth().onAuthStateChanged(async user => {
  if (!user) return;

  uid = user.uid;
  db = firebase.database();
  bindUiEventsOnce();
  applyEditLockUi();

  await bootstrapNewUserData();

  db.ref(`user/${uid}/catalog`).once("value").then(s => {
    catalog = mergeCatalog(s.val() || {});
  }).catch(err => {
    console.warn("catalog fetch failed", err && err.message);
    catalog = mergeCatalog({});
  }).finally(() => {
    ready.catalog = true;
    tryRender();
  });

  try {
    await subscribeDevices();
  } catch (err) {
    console.warn("subscribeDevices failed", err && err.message);
    ready.devices = true;
    tryRender();
  }

  db.ref(`user/${uid}/dashboard/devices`).on(
    "value",
    s => {
      dashboardCfg = s.val() || {};
      ready.dashboard = true;
      tryRender();
    },
    err => {
      console.warn("dashboard subscription error", err && err.message);
      dashboardCfg = {};
      ready.dashboard = true;
      tryRender();
    }
  );

  setTimeout(() => {
    if (!(ready.devices && ready.dashboard && ready.catalog)) {
      console.warn("dashboard watchdog forcing render. ready=", { ...ready });
      ready.devices = true;
      ready.dashboard = true;
      ready.catalog = true;
      tryRender();
    }
  }, 4000);
});

document.addEventListener("admin-state-changed", () => {
  applyEditLockUi();
  applyDashboardLanguage();
  renderDeviceToggles();
  renderDashboard();
});

document.addEventListener("language-changed", () => {
  applyDashboardLanguage();
  applyEditLockUi();
  showInitialPlaceholder();
  renderDashboard();
});

function bindUiEventsOnce() {
  if (uiBound) return;
  uiBound = true;

  const addBtn = document.getElementById("addDashboardDeviceBtn");
  if (addBtn) addBtn.addEventListener("click", openAddDeviceModal);

  const addDeviceSelect = document.getElementById("addDeviceSelect");
  if (addDeviceSelect) addDeviceSelect.addEventListener("change", renderAddDeviceCardChoices);

  const addDeviceTypeSelect = document.getElementById("addDeviceTypeSelect");
  if (addDeviceTypeSelect) addDeviceTypeSelect.addEventListener("change", renderAddDeviceCardChoices);

  const deviceTypeInput = document.getElementById("deviceTypeInput");
  if (deviceTypeInput) {
    deviceTypeInput.addEventListener("change", () => {
      if (!activeDevice || !dashboardCfg[activeDevice]) return;
      dashboardCfg[activeDevice].type = deviceTypeInput.value;
      renderCustomizeCardOptions(activeDevice);
      populateAddCardSelect(activeDevice);
    });
  }

  const addCardBtn = document.getElementById("addCardBtn");
  if (addCardBtn) addCardBtn.addEventListener("click", addCardToActiveDevice);
}

function tryRender() {
  if (!(ready.devices && ready.dashboard && ready.catalog)) return;
  applyDashboardLanguage();
  applyEditLockUi();
  ensureDashboardConfig();
  renderDeviceToggles();
  renderDashboard();
}

function mergeCatalog(customCatalog) {
  return {
    ...DEFAULT_CATALOG,
    ...customCatalog,
    soil_sensor: { ...DEFAULT_CATALOG.soil_sensor, ...(customCatalog.soil_sensor || {}) },
    valve: { ...DEFAULT_CATALOG.valve, ...(customCatalog.valve || {}) },
    generic: { ...DEFAULT_CATALOG.generic, ...(customCatalog.generic || {}) }
  };
}

function ensureDashboardConfig() {
  if (Object.keys(dashboardCfg).length > 0) return;
  if (didBootstrapCfg) return;

  didBootstrapCfg = true;
  const inferred = buildDashboardFromDevices();
  if (Object.keys(inferred).length === 0) return;

  dashboardCfg = inferred;
  db.ref(`user/${uid}/dashboard/devices`).set(inferred);
}

function buildDashboardFromDevices() {
  const result = {};
  Object.entries(devices || {}).forEach(([id, device]) => {
    result[id] = createDashboardDeviceConfig(id, device);
  });
  return result;
}

function inferDeviceType(device) {
  const declared = (device?.type || "").toLowerCase();
  if (declared.includes("soil")) return "soil_sensor";
  if (declared.includes("valve")) return "valve";

  const keys = getMetricKeysFromDevice(device).map(k => k.toLowerCase());
  if (keys.some(k => k.includes("temperature") || k.includes("humidity") || k.includes("moisture"))) return "soil_sensor";
  if (keys.some(k => k.includes("status") || k.includes("valve") || k.includes("pump") || k.includes("relay"))) return "valve";
  return "generic";
}

function inferMetaFromKey(key) {
  const tail = String(key).split("/").pop() || String(key);
  const k = tail.toLowerCase();

  if (["status", "valve", "pump", "relay", "switch", "onoff"].some(p => k.includes(p))) {
    return { label: humanize(tail), type: "toggle", unit: "", icon: "" };
  }
  if (["threshold", "setpoint", "limit", "target"].some(p => k.includes(p))) {
    return { label: humanize(tail), type: "number-input", unit: "", icon: "" };
  }

  let unit = "";
  if (k.includes("temp")) unit = "degC";
  if (k.includes("humidity") || k.includes("moisture")) unit = "%";
  if (k.includes("flow")) unit = "L/min";
  if (k.includes("press")) unit = "kPa";

  return { label: humanize(tail), type: "display", unit, icon: "" };
}

function getTypeCatalogForDevice(type, device) {
  const byType = catalog[type] || {};
  if (Object.keys(byType).length) return byType;

  const derived = {};
  getMetricKeysFromDevice(device).forEach(key => {
    derived[key] = inferMetaFromKey(key);
  });
  return derived;
}

function populateDeviceTypeOptions(selectEl) {
  if (!selectEl) return;
  const types = [...new Set([...Object.keys(DEFAULT_CATALOG), ...Object.keys(catalog || {})])];
  selectEl.innerHTML = "";
  types.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = humanize(type);
    selectEl.appendChild(opt);
  });
}

function createDashboardDeviceConfig(id, device, options = {}) {
  const selectedType = options.type || inferDeviceType(device);
  const typeCatalog = getTypeCatalogForDevice(selectedType, device);
  const allKeys = Object.keys(typeCatalog).length ? Object.keys(typeCatalog) : getMetricKeysFromDevice(device);
  const selectedKeys = (options.selectedKeys && options.selectedKeys.length) ? options.selectedKeys : allKeys;

  const cards = {};
  selectedKeys.forEach((key, index) => {
    const meta = typeCatalog[key] || inferMetaFromKey(key);
    cards[key] = {
      visible: true,
      order: index + 1,
      label: meta.label || humanize(key),
      type: meta.type || "display",
      unit: meta.unit || "",
      icon: meta.icon || ""
    };
  });

  return {
    name: options.customName || device?.name || `Device ${id}`,
    type: selectedType,
    visible: true,
    cards
  };
}

function openAddDeviceModal() {
  if (!canEditDashboard()) return;

  const modal = document.getElementById("addDeviceModal");
  const select = document.getElementById("addDeviceSelect");
  const typeSelect = document.getElementById("addDeviceTypeSelect");
  const emptyMsg = document.getElementById("addDeviceEmptyMsg");
  const saveBtn = document.getElementById("saveAddDeviceBtn");
  const nameInput = document.getElementById("addDeviceNameInput");

  if (!modal || !select || !typeSelect) return;

  if (nameInput) nameInput.value = "";
  populateDeviceTypeOptions(typeSelect);
  select.innerHTML = "";

  const available = Object.entries(devices || {});
  available.forEach(([id, device]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = dashboardCfg[id]
      ? `${device?.name || id} (${id}) - on dashboard`
      : `${device?.name || id} (${id})`;
    select.appendChild(opt);
  });

  const noAvailable = available.length === 0;
  if (emptyMsg) emptyMsg.classList.toggle("hide", !noAvailable);
  select.disabled = noAvailable;
  typeSelect.disabled = noAvailable;
  if (saveBtn) {
    saveBtn.disabled = noAvailable;
    saveBtn.textContent = (select.value && dashboardCfg[select.value]) ? tDash("updateLabel") : tDash("addLabel");
  }

  if (!noAvailable) {
    typeSelect.value = inferDeviceType(devices[select.value]);
    renderAddDeviceCardChoices();
  } else {
    const box = document.getElementById("addDeviceCardChoices");
    if (box) box.innerHTML = "";
  }

  modal.classList.remove("hide");
}

function renderAddDeviceCardChoices() {
  const deviceSelect = document.getElementById("addDeviceSelect");
  const typeSelect = document.getElementById("addDeviceTypeSelect");
  const box = document.getElementById("addDeviceCardChoices");
  const saveBtn = document.getElementById("saveAddDeviceBtn");
  if (!deviceSelect || !typeSelect || !box || !deviceSelect.value) return;

  if (saveBtn) saveBtn.textContent = dashboardCfg[deviceSelect.value] ? tDash("updateLabel") : tDash("addLabel");

  const device = devices[deviceSelect.value] || {};
  const type = typeSelect.value || inferDeviceType(device);
  const entries = Object.entries(getTypeCatalogForDevice(type, device));

  box.innerHTML = "";
  entries.forEach(([key, meta]) => {
    const row = document.createElement("label");
    row.className = "card-option-head";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = key;
    cb.checked = true;

    const text = document.createElement("span");
    text.textContent = `${resolveCardLabelForLang(key, meta.label, humanize(key))}`;

    row.append(cb, text);
    box.appendChild(row);
  });
}

function closeAddDeviceModal() {
  const modal = document.getElementById("addDeviceModal");
  if (modal) modal.classList.add("hide");
}

async function saveAddDevice() {
  if (!canEditDashboard()) return;

  const select = document.getElementById("addDeviceSelect");
  const typeSelect = document.getElementById("addDeviceTypeSelect");
  const nameInput = document.getElementById("addDeviceNameInput");
  const checkedCards = document.querySelectorAll("#addDeviceCardChoices input[type='checkbox']:checked");

  if (!select || !select.value || !typeSelect) return;
  const id = select.value;

  const selectedKeys = [...checkedCards].map(cb => cb.value);
  if (!selectedKeys.length) return alert(tDash("selectOneCard"));

  const cfg = createDashboardDeviceConfig(id, devices[id], {
    customName: nameInput?.value.trim() || undefined,
    type: typeSelect.value,
    selectedKeys
  });

  await db.ref(`user/${uid}/dashboard/devices/${id}`).set(cfg);
  closeAddDeviceModal();
}

function renderDeviceToggles() {
  const box = document.getElementById("deviceToggles");
  if (!box) return;

  box.innerHTML = "";
  if (!canEditDashboard()) return;

  Object.entries(dashboardCfg).forEach(([id, cfg]) => {
    const label = document.createElement("label");
    const cb = document.createElement("input");

    cb.type = "checkbox";
    cb.checked = cfg.visible !== false;
    cb.onchange = () => db.ref(`user/${uid}/dashboard/devices/${id}/visible`).set(cb.checked);

    label.append(cb, " ", cfg.name || id);
    box.appendChild(label);
  });
}

function renderDashboard() {
  const dash = document.getElementById("dashboard");
  if (!dash) return;

  dash.innerHTML = "";

  const hasDevices = Object.keys(devices || {}).length > 0;
  const hasCfg = Object.keys(dashboardCfg || {}).length > 0;

  if (!hasDevices && !hasCfg) {
    dash.innerHTML = `<div class="empty-state"><h3>${tDash("noDevicesTitle")}</h3><p>DB path: ${deviceDataPath || "user/{uid}/devices"}</p></div>`;
    return;
  }

  const source = hasCfg ? dashboardCfg : buildDashboardFromDevices();
  let renderedCount = 0;
  const unlocked = canEditDashboard();

  Object.entries(source).forEach(([id, cfg]) => {
    if (cfg.visible === false) return;
    if (!devices[id] && !cfg.cards) return;

    const box = document.createElement("div");
    box.className = "device-box";

    const header = document.createElement("div");
    header.className = "device-header";

    const title = document.createElement("h2");
    title.textContent = cfg.name || id;

    const customizeBtn = document.createElement("button");
    customizeBtn.type = "button";
    customizeBtn.textContent = tDash("customizeBtn");
    customizeBtn.addEventListener("click", () => openCustomize(id));

    const cardsWrap = document.createElement("div");
    cardsWrap.className = "cards sortable";
    cardsWrap.id = `cards-${id}`;

    header.appendChild(title);
    if (unlocked) header.appendChild(customizeBtn);
    box.appendChild(header);
    box.appendChild(cardsWrap);
    dash.appendChild(box);

    const count = renderCards(id, cfg);
    if (count === 0) {
      cardsWrap.innerHTML = `<div class="empty-note">${tDash("noWidgetsNote")}</div>`;
    }

    renderedCount += 1;
  });

  if (renderedCount === 0) {
    dash.innerHTML = `<div class="empty-state"><h3>${tDash("nothingToShowTitle")}</h3><p>${tDash("nothingToShowDesc")}</p></div>`;
  }
}

function getEffectiveCardMeta(deviceId, key, cardCfg, deviceCfg) {
  const cfg = deviceCfg || dashboardCfg[deviceId] || {};
  const device = devices[deviceId] || {};
  const baseCatalog = getTypeCatalogForDevice(cfg.type || inferDeviceType(device), device);
  const base = baseCatalog[key] || inferMetaFromKey(key);
  return {
    ...base,
    ...cardCfg,
    label: resolveCardLabelForLang(key, cardCfg.label, base.label || humanize(key)),
    type: cardCfg.type || base.type || "display",
    unit: cardCfg.unit ?? base.unit ?? "",
    icon: cardCfg.icon ?? base.icon ?? ""
  };
}

function renderCards(deviceId, cfgOverride) {
  const wrap = document.getElementById(`cards-${deviceId}`);
  if (!wrap) return 0;
  wrap.innerHTML = "";

  const cfg = cfgOverride || dashboardCfg[deviceId] || createDashboardDeviceConfig(deviceId, devices[deviceId] || {});
  const orderedCards = Object.entries(cfg.cards || {})
    .filter(([_, c]) => c.visible !== false)
    .sort((a, b) => (a[1].order || 0) - (b[1].order || 0));

  let count = 0;
  const unlocked = canEditDashboard();

  orderedCards.forEach(([key, cardCfg]) => {
    const meta = getEffectiveCardMeta(deviceId, key, cardCfg, cfg);

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.key = key;

    const dragHandle = document.createElement("span");
    dragHandle.className = "drag-handle";
    dragHandle.textContent = "?";

    const header = document.createElement("div");
    header.className = "card-header";

    const label = document.createElement("span");
    label.textContent = `${meta.label}`;

    header.appendChild(label);
    if (unlocked) card.appendChild(dragHandle);

    const valueEl = document.createElement("div");
    valueEl.className = "card-value";

    card.appendChild(header);
    card.appendChild(valueEl);
    wrap.appendChild(card);

    getDeviceValueRef(deviceId, key).on("value", snap => {
      renderCardValue(valueEl, meta, snap.val(), deviceId, key);
    });

    count += 1;
  });

  if (unlocked) enableCardReorder(wrap, deviceId);

  return count;
}

function renderCardValue(el, meta, val, deviceId, key) {
  el.innerHTML = "";

  if (meta.type === "display") {
    el.textContent = format(val, meta.unit);
    return;
  }

  if (meta.type === "number-input") {
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "decimal";
    input.className = "threshold-input";
    input.value = val ?? "";
    input.value = input.value === "" ? "" : localizeDashDigits(input.value);
    input.addEventListener("focus", () => {
      input.value = normalizeDashDigits(input.value);
    });
    input.addEventListener("blur", () => {
      const normalized = normalizeDashDigits(input.value).trim();
      input.value = normalized === "" ? "" : localizeDashDigits(normalized);
    });
    input.onchange = () => {
      const normalized = normalizeDashDigits(input.value).trim();
      if (normalized === "") return;
      const parsed = Number(normalized);
      if (Number.isFinite(parsed)) getDeviceValueRef(deviceId, key).set(parsed);
    };
    el.appendChild(input);
    return;
  }

  if (meta.type === "toggle") {
    const btn = document.createElement("button");
    const isOn = val === 1 || val === true;
    btn.className = `toggle ${isOn ? "on" : "off"}`;
    btn.textContent = isOn ? tDash("onLabel") : tDash("offLabel");
    btn.onclick = () => getDeviceValueRef(deviceId, key).set(isOn ? 0 : 1);
    el.appendChild(btn);
    return;
  }

  el.textContent = format(val, meta.unit);
}

function enableCardReorder(container, deviceId) {
  if (sortableByDevice[deviceId]) sortableByDevice[deviceId].destroy();

  sortableByDevice[deviceId] = Sortable.create(container, {
    animation: 180,
    handle: ".drag-handle",
    ghostClass: "drag-ghost",
    dragClass: "dragging",
    onEnd: () => {
      const updates = {};
      [...container.children].forEach((card, index) => {
        updates[`user/${uid}/dashboard/devices/${deviceId}/cards/${card.dataset.key}/order`] = index + 1;
      });
      db.ref().update(updates);
    }
  });
}

function openCustomize(deviceId) {
  if (!canEditDashboard()) return;

  activeDevice = deviceId;
  const cfg = dashboardCfg[deviceId];
  if (!cfg) return;

  document.getElementById("customizeTitle").textContent = `Customize ${cfg.name || deviceId}`;
  document.getElementById("deviceNameInput").value = cfg.name || deviceId;

  const typeSelect = document.getElementById("deviceTypeInput");
  populateDeviceTypeOptions(typeSelect);
  typeSelect.value = cfg.type || inferDeviceType(devices[deviceId]);

  renderCustomizeCardOptions(deviceId);
  populateAddCardSelect(deviceId);
  document.getElementById("customizeModal").classList.remove("hide");
}

function renderCustomizeCardOptions(deviceId) {
  const box = document.getElementById("cardOptions");
  box.innerHTML = "";

  const cfg = dashboardCfg[deviceId];
  const ordered = Object.entries(cfg.cards || {}).sort((a, b) => (a[1].order || 0) - (b[1].order || 0));

  ordered.forEach(([key, cardCfg]) => {
    const meta = getEffectiveCardMeta(deviceId, key, cardCfg);

    const row = document.createElement("div");
    row.className = "card-option";

    const head = document.createElement("div");
    head.className = "card-option-head";

    const title = document.createElement("span");
    title.className = "card-option-title";
    title.textContent = key;

    const visibleWrap = document.createElement("label");
    const visibleCb = document.createElement("input");
    visibleCb.type = "checkbox";
    visibleCb.checked = cardCfg.visible !== false;
    visibleCb.onchange = () => { cardCfg.visible = visibleCb.checked; };
    visibleWrap.append(visibleCb, ` ${tDash("visibleLabel")}`);

    head.append(title, visibleWrap);

    const controls = document.createElement("div");
    controls.className = "card-option-controls";

    const labelInput = document.createElement("input");
    labelInput.placeholder = tDash("customCardNamePlaceholder");
    labelInput.value = meta.label;
    labelInput.oninput = () => { cardCfg.label = labelInput.value.trim(); };

    const modeSelect = document.createElement("select");
    CARD_TYPES.forEach(mode => {
      const opt = document.createElement("option");
      opt.value = mode;
      opt.textContent = mode;
      modeSelect.appendChild(opt);
    });
    modeSelect.value = meta.type;
    modeSelect.onchange = () => { cardCfg.type = modeSelect.value; };

    controls.append(labelInput, modeSelect);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-card";
    removeBtn.textContent = tDash("removeLabel");
    removeBtn.onclick = () => {
      delete cfg.cards[key];
      normalizeCardOrder(cfg.cards);
      renderCustomizeCardOptions(deviceId);
      populateAddCardSelect(deviceId);
    };

    row.append(head, controls, removeBtn);
    box.appendChild(row);
  });
}

function populateAddCardSelect(deviceId) {
  const select = document.getElementById("addCardSelect");
  const addBtn = document.getElementById("addCardBtn");
  if (!select || !addBtn) return;

  const cfg = dashboardCfg[deviceId];
  const typeCatalog = getTypeCatalogForDevice(cfg.type || inferDeviceType(devices[deviceId]), devices[deviceId]);
  const missing = Object.keys(typeCatalog).filter(key => !(cfg.cards || {})[key]);

  select.innerHTML = "";
  missing.forEach(key => {
    const meta = typeCatalog[key] || inferMetaFromKey(key);
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${meta.label || humanize(key)}`;
    select.appendChild(opt);
  });

  select.disabled = missing.length === 0;
  addBtn.disabled = missing.length === 0;
}

function addCardToActiveDevice() {
  if (!activeDevice) return;
  const select = document.getElementById("addCardSelect");
  if (!select || !select.value) return;

  const cfg = dashboardCfg[activeDevice];
  const typeCatalog = getTypeCatalogForDevice(cfg.type || inferDeviceType(devices[activeDevice]), devices[activeDevice]);
  const key = select.value;
  const meta = typeCatalog[key] || inferMetaFromKey(key);

  const maxOrder = Math.max(0, ...Object.values(cfg.cards || {}).map(c => c.order || 0));
  cfg.cards[key] = {
    visible: true,
    order: maxOrder + 1,
    label: meta.label || humanize(key),
    type: meta.type || "display",
    unit: meta.unit || "",
    icon: meta.icon || ""
  };

  renderCustomizeCardOptions(activeDevice);
  populateAddCardSelect(activeDevice);
}

function closeCustomize() {
  document.getElementById("customizeModal").classList.add("hide");
}

async function removeActiveDeviceFromDashboard() {
  if (!canEditDashboard()) return;
  if (!activeDevice) return;
  if (!confirm("Remove this device from dashboard?")) return;

  await db.ref(`user/${uid}/dashboard/devices/${activeDevice}`).remove();
  closeCustomize();
}

function saveCustomize() {
  if (!canEditDashboard()) return;
  if (!activeDevice) return;

  const cfg = dashboardCfg[activeDevice];
  const name = document.getElementById("deviceNameInput").value.trim();
  const type = document.getElementById("deviceTypeInput").value;
  if (!name) return alert("Device name required");

  cfg.name = name;
  cfg.type = type;
  normalizeCardOrder(cfg.cards || {});

  db.ref(`user/${uid}/dashboard/devices/${activeDevice}`).update({
    name: cfg.name,
    type: cfg.type,
    cards: cfg.cards
  });

  closeCustomize();
}

function normalizeCardOrder(cards) {
  Object.entries(cards || {})
    .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
    .forEach(([key, card], index) => {
      cards[key] = { ...card, order: index + 1 };
    });
}

function humanize(text) {
  return String(text)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, c => c.toUpperCase());
}

function format(v, unit) {
  if (v === undefined || v === null || v === "") return "--";
  const base = unit ? `${v} ${unit}` : String(v);
  return localizeDashDigits(base);
}
