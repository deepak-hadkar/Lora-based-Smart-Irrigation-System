let uid, db;
let devices = {};
let dashboardCfg = {};
let catalog = {};
let activeDevice = null;
let activeDeviceOriginalCards = null;
let didBootstrapCfg = false;
let uiBound = false;
let deviceDataPath = "";

const ready = { devices: false, dashboard: false, catalog: false };
const sortableByDevice = {};
const CARD_TYPES = ["display", "toggle", "number-input"];
const DEVICE_TYPES = ["sensor", "actuator"];
const DASH_LANGUAGE_STORAGE_KEY = "smartagro_language";

const DASH_I18N = {
  en: {
    dashboardTitle: "Dashboard",
    addDashboardDeviceBtn: "Add Device",
    createCatalogCardBtn: "Create Card",
    updateDashboardDeviceBtn: "Update Device",
    adminLoginRequired: "Admin login required",
    loadingTitle: "Loading dashboard...",
    loadingDesc: "Connecting to your data.",
    noDevicesTitle: "No devices found",
    noWidgetsNote: "No widgets available for this device yet.",
    nothingToShowTitle: "Nothing to show yet",
    nothingToShowDesc: "No renderable device cards are available.",
    customizeBtn: "Customize",
    deleteDeviceSymbolTitle: "Delete Device",
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
    addDeviceModalTitle: "Create New Device",
    addDeviceIdLabel: "New Device ID",
    addDeviceDisplayNameLabel: "Display Name (optional)",
    addDeviceTypeLabel: "Device Type",
    cardsToShowLabel: "Cards To Show",
    createLabel: "Create",
    updateDeviceModalTitle: "Update Device",
    updateDeviceLabel: "Device",
    openUpdateDeviceBtn: "Open",
    updateDeviceCancelBtn: "Cancel",
    createCardModalTitle: "Create New Card",
    createCardKeyLabel: "Card Key",
    createCardLabelLabel: "Card Label",
    createCardTypeLabel: "Card Type",
    createCardUnitLabel: "Unit (optional)",
    createCardCancelBtn: "Cancel",
    saveCreateCardBtn: "Create",
    addDeviceCancelBtn: "Cancel",
    addDeviceNamePlaceholder: "Use custom dashboard name",
    addDeviceIdPlaceholder: "Enter new device id",
    deviceIdRequired: "Enter a new device ID.",
    invalidDeviceId: "Invalid Device ID. Avoid . # $ [ ] / characters.",
    cardKeyRequired: "Enter card key.",
    invalidCardKey: "Invalid card key. Avoid . # $ [ ] / characters.",
    deviceAlreadyExists: "Device ID already exists. Use Update Device to edit it.",
    noDevicesToUpdate: "No devices available to update.",
    visibleLabel: "Visible",
    customCardNamePlaceholder: "Custom card name",
    readModeLabel: "Read",
    writeModeLabel: "Write",
    buttonModeLabel: "Button",
    noAddCardOptions: "No more cards available",
    removeLabel: "Remove",
    onLabel: "ON",
    offLabel: "OFF",
    createCardKeyPlaceholder: "Example: Voltage",
    createCardLabelPlaceholder: "Example: Battery Voltage",
    createCardUnitPlaceholder: "Example: V",
    deviceDefaultNamePrefix: "Device",
    selectDeviceTypePlaceholder: "Select device type",
    reorderCardAriaLabel: "Reorder card",
    customizeTitlePrefix: "Customize",
    deviceNameRequired: "Device name required",
    dbPathLabel: "Data path"
  },
  hi: {
    dashboardTitle: "नियंत्रण पटल",
    addDashboardDeviceBtn: "उपकरण जोड़ें",
    createCatalogCardBtn: "घटक बनाएं",
    updateDashboardDeviceBtn: "उपकरण अद्यतन करें",
    adminLoginRequired: "प्रशासक प्रवेश आवश्यक है",
    loadingTitle: "नियंत्रण पटल लोड हो रहा है...",
    loadingDesc: "आपके डेटा से जुड़ा जा रहा है।",
    noDevicesTitle: "कोई उपकरण नहीं मिला",
    noWidgetsNote: "इस उपकरण के लिए अभी कोई घटक उपलब्ध नहीं है।",
    nothingToShowTitle: "अभी दिखाने के लिए कुछ नहीं",
    nothingToShowDesc: "दिखाने योग्य उपकरण घटक उपलब्ध नहीं हैं।",
    customizeBtn: "सानुकूलित करें",
    deleteDeviceSymbolTitle: "उपकरण हटाएं",
    addLabel: "जोड़ें",
    updateLabel: "अद्यतन करें",
    selectOneCard: "कम से कम एक घटक चुनें।",
    customizeDeviceNameLabel: "उपकरण नाम",
    customizeDeviceTypeLabel: "उपकरण प्रकार",
    customizeAddCardLabel: "नया घटक जोड़ें",
    addCardBtn: "घटक जोड़ें",
    removeDeviceBtn: "उपकरण हटाएं",
    customizeCancelBtn: "रद्द करें",
    customizeSaveBtn: "सहेजें",
    addDeviceModalTitle: "नया उपकरण बनाएं",
    addDeviceIdLabel: "नया उपकरण पहचान क्रमांक",
    addDeviceDisplayNameLabel: "प्रदर्शित नाम (वैकल्पिक)",
    addDeviceTypeLabel: "उपकरण प्रकार",
    cardsToShowLabel: "दिखाने वाले घटक",
    createLabel: "बनाएं",
    updateDeviceModalTitle: "उपकरण अद्यतन करें",
    updateDeviceLabel: "उपकरण",
    openUpdateDeviceBtn: "खोलें",
    updateDeviceCancelBtn: "रद्द करें",
    createCardModalTitle: "नया घटक बनाएं",
    createCardKeyLabel: "घटक कुंजी",
    createCardLabelLabel: "घटक नाम",
    createCardTypeLabel: "घटक प्रकार",
    createCardUnitLabel: "इकाई (वैकल्पिक)",
    createCardCancelBtn: "रद्द करें",
    saveCreateCardBtn: "बनाएं",
    addDeviceCancelBtn: "रद्द करें",
    addDeviceNamePlaceholder: "नियंत्रण पटल के लिए मनचाहा नाम दें",
    addDeviceIdPlaceholder: "नया उपकरण पहचान क्रमांक दर्ज करें",
    deviceIdRequired: "कृपया नया उपकरण पहचान क्रमांक दर्ज करें।",
    invalidDeviceId: "अमान्य उपकरण पहचान क्रमांक। . # $ [ ] / अक्षरों का उपयोग न करें।",
    cardKeyRequired: "कृपया घटक कुंजी दर्ज करें।",
    invalidCardKey: "अमान्य घटक कुंजी। . # $ [ ] / अक्षरों का उपयोग न करें।",
    deviceAlreadyExists: "उपकरण पहचान क्रमांक पहले से मौजूद है। बदलने के लिए उपकरण अद्यतन करें का उपयोग करें।",
    noDevicesToUpdate: "अद्यतन के लिए कोई उपकरण उपलब्ध नहीं है।",
    visibleLabel: "दिखाएं",
    customCardNamePlaceholder: "मनचाहा घटक नाम",
    readModeLabel: "पठन",
    writeModeLabel: "लेखन",
    buttonModeLabel: "बटन",
    noAddCardOptions: "और घटक उपलब्ध नहीं हैं",
    removeLabel: "हटाएं",
    onLabel: "चालू",
    offLabel: "बंद",
    createCardKeyPlaceholder: "उदाहरण: वोल्टेज",
    createCardLabelPlaceholder: "उदाहरण: बैटरी वोल्टेज",
    createCardUnitPlaceholder: "उदाहरण: वोल्ट",
    deviceDefaultNamePrefix: "उपकरण",
    selectDeviceTypePlaceholder: "उपकरण प्रकार चुनें",
    reorderCardAriaLabel: "कार्ड क्रम बदलें",
    customizeTitlePrefix: "सानुकूलित करें",
    deviceNameRequired: "उपकरण नाम आवश्यक है",
    dbPathLabel: "डेटा पथ"
  },
  mr: {
    dashboardTitle: "नियंत्रण फलक",
    addDashboardDeviceBtn: "साधन जोडा",
    createCatalogCardBtn: "घटक तयार करा",
    updateDashboardDeviceBtn: "साधन अद्यतनित करा",
    adminLoginRequired: "प्रशासक प्रवेश आवश्यक आहे",
    loadingTitle: "नियंत्रण फलक लोड होत आहे...",
    loadingDesc: "तुमच्या डेटाशी जोडले जात आहे.",
    noDevicesTitle: "कोणतेही साधन सापडले नाही",
    noWidgetsNote: "या साधनासाठी सध्या कोणतेही घटक उपलब्ध नाहीत.",
    nothingToShowTitle: "दाखवण्यासाठी काहीही नाही",
    nothingToShowDesc: "दाखवण्यायोग्य साधन घटक उपलब्ध नाहीत.",
    customizeBtn: "सानुकूलित करा",
    deleteDeviceSymbolTitle: "साधन काढा",
    addLabel: "जोडा",
    updateLabel: "अद्यतन करा",
    selectOneCard: "किमान एक घटक निवडा.",
    customizeDeviceNameLabel: "साधन नाव",
    customizeDeviceTypeLabel: "साधन प्रकार",
    customizeAddCardLabel: "नवा घटक जोडा",
    addCardBtn: "घटक जोडा",
    removeDeviceBtn: "साधन काढा",
    customizeCancelBtn: "रद्द करा",
    customizeSaveBtn: "जतन करा",
    addDeviceModalTitle: "नवीन साधन तयार करा",
    addDeviceIdLabel: "नवीन साधन ओळख क्रमांक",
    addDeviceDisplayNameLabel: "प्रदर्शित नाव (पर्यायी)",
    addDeviceTypeLabel: "साधन प्रकार",
    cardsToShowLabel: "दाखवायचे घटक",
    createLabel: "तयार करा",
    updateDeviceModalTitle: "साधन अद्यतनित करा",
    updateDeviceLabel: "साधन",
    openUpdateDeviceBtn: "उघडा",
    updateDeviceCancelBtn: "रद्द करा",
    createCardModalTitle: "नवीन घटक तयार करा",
    createCardKeyLabel: "घटक कळी",
    createCardLabelLabel: "घटक नाव",
    createCardTypeLabel: "घटक प्रकार",
    createCardUnitLabel: "एकक (पर्यायी)",
    createCardCancelBtn: "रद्द करा",
    saveCreateCardBtn: "तयार करा",
    addDeviceCancelBtn: "रद्द करा",
    addDeviceNamePlaceholder: "नियंत्रण फलकासाठी सानुकूल नाव वापरा",
    addDeviceIdPlaceholder: "नवीन साधन ओळख क्रमांक टाका",
    deviceIdRequired: "कृपया नवीन साधन ओळख क्रमांक टाका.",
    invalidDeviceId: "अवैध साधन ओळख क्रमांक. . # $ [ ] / अक्षरे टाळा.",
    cardKeyRequired: "कृपया घटक कळी टाका.",
    invalidCardKey: "अवैध घटक कळी. . # $ [ ] / अक्षरे टाळा.",
    deviceAlreadyExists: "साधन ओळख क्रमांक आधीच अस्तित्वात आहे. बदलासाठी साधन अद्यतनित करा वापरा.",
    noDevicesToUpdate: "अद्यतनासाठी कोणतेही साधन उपलब्ध नाही.",
    visibleLabel: "दृश्यमान",
    customCardNamePlaceholder: "सानुकूल घटक नाव",
    sensorTypeLabel: "संवेदक",
    actuatorTypeLabel: "संचालक",
    readModeLabel: "वाचा",
    writeModeLabel: "लिहा",
    buttonModeLabel: "बटण",
    noAddCardOptions: "आणखी घटक उपलब्ध नाहीत",
    removeLabel: "काढा",
    onLabel: "चालू",
    offLabel: "बंद",
    createCardKeyPlaceholder: "उदा.: व्होल्टेज",
    createCardLabelPlaceholder: "उदा.: बॅटरी व्होल्टेज",
    createCardUnitPlaceholder: "उदा.: व्होल्ट",
    deviceDefaultNamePrefix: "साधन",
    selectDeviceTypePlaceholder: "साधन प्रकार निवडा",
    reorderCardAriaLabel: "कार्ड क्रम बदला",
    customizeTitlePrefix: "सानुकूलित करा",
    deviceNameRequired: "साधन नाव आवश्यक आहे",
    dbPathLabel: "डेटा मार्ग"
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
    status: "स्थिती",
    flow: "प्रवाह",
    pressure: "दाब",
    threshold: "मर्यादा",
    battery: "बॅटरी",
    control: "नळ नियंत्रण",
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

function getCardTypeLabel(type) {
  if (type === "display") return tDash("readModeLabel");
  if (type === "number-input") return tDash("writeModeLabel");
  if (type === "toggle") return tDash("buttonModeLabel");
  return humanize(type);
}

function getDeviceTypeLabel(type) {
  if (type === "sensor") {
    const label = tDash("sensorTypeLabel");
    return label === "sensorTypeLabel" ? humanize(type) : label;
  }
  if (type === "actuator") {
    const label = tDash("actuatorTypeLabel");
    return label === "actuatorTypeLabel" ? humanize(type) : label;
  }
  return humanize(type);
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
  const createCardBtn = document.getElementById("createCatalogCardBtn");
  const updateBtn = document.getElementById("updateDashboardDeviceBtn");
  const toggles = document.getElementById("deviceToggles");

  if (addBtn) {
    addBtn.disabled = !unlocked;
    addBtn.title = unlocked ? "" : tDash("adminLoginRequired");
  }
  if (updateBtn) {
    updateBtn.disabled = !unlocked;
    updateBtn.title = unlocked ? "" : tDash("adminLoginRequired");
  }
  if (createCardBtn) {
    createCardBtn.disabled = !unlocked;
    createCardBtn.title = unlocked ? "" : tDash("adminLoginRequired");
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
    "createCatalogCardBtn",
    "updateDashboardDeviceBtn",
    "customizeDeviceNameLabel",
    "customizeDeviceTypeLabel",
    "customizeAddCardLabel",
    "addCardBtn",
    "removeDeviceBtn",
    "customizeCancelBtn",
    "customizeSaveBtn",
    "addDeviceModalTitle",
    "addDeviceIdLabel",
    "addDeviceDisplayNameLabel",
    "addDeviceTypeLabel",
    "cardsToShowLabel",
    "addDeviceCancelBtn",
    "updateDeviceModalTitle",
    "updateDeviceLabel",
    "openUpdateDeviceBtn",
    "updateDeviceCancelBtn",
    "createCardModalTitle",
    "createCardKeyLabel",
    "createCardLabelLabel",
    "createCardTypeLabel",
    "createCardUnitLabel",
    "createCardCancelBtn",
    "saveCreateCardBtn"
  ];

  keys.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = tDash(id);
  });

  const nameInput = document.getElementById("addDeviceNameInput");
  if (nameInput) nameInput.placeholder = tDash("addDeviceNamePlaceholder");

  const idInput = document.getElementById("addDeviceIdInput");
  if (idInput) idInput.placeholder = tDash("addDeviceIdPlaceholder");

  const createCardKeyInput = document.getElementById("createCardKeyInput");
  if (createCardKeyInput) createCardKeyInput.placeholder = tDash("createCardKeyPlaceholder");

  const createCardLabelInput = document.getElementById("createCardLabelInput");
  if (createCardLabelInput) createCardLabelInput.placeholder = tDash("createCardLabelPlaceholder");

  const createCardUnitInput = document.getElementById("createCardUnitInput");
  if (createCardUnitInput) createCardUnitInput.placeholder = tDash("createCardUnitPlaceholder");
}

function getDefaultDeviceName(id) {
  return `${tDash("deviceDefaultNamePrefix")} ${id}`;
}

function localizeDeviceNameTerms(text, lang) {
  const source = String(text || "");
  if (lang === "hi") {
    return source
      .replace(/device/gi, "उपकरण")
      .replace(/sensor/gi, "संवेदक")
      .replace(/actuator/gi, "संचालक")
      .replace(/valve/gi, "वाल्व")
      .replace(/status/gi, "स्थिति");
  }

  if (lang === "mr") {
    return source
      .replace(/device/gi, "साधन")
      .replace(/sensor/gi, "संवेदक")
      .replace(/actuator/gi, "संचालक")
      .replace(/valve/gi, "नळ")
      .replace(/status/gi, "स्थिती")
      .replace(/यंत्र/g, "साधन");
  }

  return source;
}

function resolveDeviceNameForLang(id, storedName) {
  const lang = getDashLang();
  const current = String(storedName || "").trim();
  if (!current) return localizeDeviceNameTerms(getDefaultDeviceName(id), lang);

  const normalized = current.toLowerCase();
  const suffix = String(id || "").toLowerCase();
  const legacyPrefixes = ["device", "उपकरण", "साधन", "यंत्र"];

  const isDefaultLike = legacyPrefixes.some(prefix => normalized === `${prefix} ${suffix}`);
  if (isDefaultLike) return localizeDeviceNameTerms(getDefaultDeviceName(id), lang);

  return localizeDeviceNameTerms(current, lang);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showInitialPlaceholder);
} else {
  showInitialPlaceholder();
}

const DEFAULT_CATALOG = {
  Temperature: { label: "Temperature", type: "display", unit: "degC", icon: "" },
  Humidity: { label: "Humidity", type: "display", unit: "%", icon: "" },
  Moisture: { label: "Soil Moisture", type: "display", unit: "%", icon: "" },
  MoistureThreshold: { label: "Moisture Threshold", type: "number-input", unit: "%", icon: "" },
  LowThreshold: { label: "Low Threshold", type: "number-input", unit: "", icon: "" },
  status: { label: "Valve", type: "toggle", unit: "", icon: "" },
  flow: { label: "Flow", type: "display", unit: "L/min", icon: "" },
  pressure: { label: "Pressure", type: "display", unit: "kPa", icon: "" },
  threshold: { label: "Threshold", type: "number-input", unit: "", icon: "" }
};

function normalizeDeviceType(type) {
  const t = String(type || "").toLowerCase().trim();
  if (t === "soil_sensor" || t === "soil" || t === "sensor") return "sensor";
  if (t === "valve" || t === "actuator") return "actuator";
  return "sensor";
}

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
  const existingPaths = [
    `user/${uid}/devices`,
    `users/${uid}/devices`,
    `user/${uid}/dashboard/devices`,
    `users/${uid}/dashboard/devices`
  ];

  for (const path of existingPaths) {
    try {
      const snap = await db.ref(path).once("value");
      const val = snap.val();
      if (val && typeof val === "object" && Object.keys(val).length > 0) {
        return;
      }
    } catch (err) {
      console.warn("bootstrap existing-data probe failed for", path, err && err.message);
    }
  }

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

  const updates = {};
  updates[`user/${uid}/profile/name`] = defaultName;
  updates[`user/${uid}/profile/email`] = email;

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

  const createCardBtn = document.getElementById("createCatalogCardBtn");
  if (createCardBtn) createCardBtn.addEventListener("click", openCreateCardModal);

  const updateBtn = document.getElementById("updateDashboardDeviceBtn");
  if (updateBtn) updateBtn.addEventListener("click", openUpdateDeviceModal);

  const addDeviceIdInput = document.getElementById("addDeviceIdInput");
  if (addDeviceIdInput) addDeviceIdInput.addEventListener("input", syncCreateSaveButtonState);

  const addDeviceTypeSelect = document.getElementById("addDeviceTypeSelect");
  if (addDeviceTypeSelect) {
    addDeviceTypeSelect.addEventListener("change", () => {
      renderAddDeviceCardChoices();
      syncCreateSaveButtonState();
    });
  }

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
  const legacyTypeBuckets = ["sensor", "actuator", "generic", "soil_sensor", "valve"];
  const fromLegacy = {};
  legacyTypeBuckets.forEach(bucket => {
    const group = customCatalog[bucket];
    if (!group || typeof group !== "object" || Array.isArray(group)) return;
    Object.assign(fromLegacy, group);
  });

  const fromFlat = {};
  Object.entries(customCatalog || {}).forEach(([key, value]) => {
    if (legacyTypeBuckets.includes(key)) return;
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    const looksLikeMeta = ("label" in value) || ("type" in value) || ("unit" in value) || ("icon" in value);
    if (!looksLikeMeta) return;
    fromFlat[key] = value;
  });

  const merged = {
    ...fromLegacy,
    ...fromFlat
  };

  return Object.keys(merged).length ? merged : { ...DEFAULT_CATALOG };
}

function ensureDashboardConfig() {
  const deviceEntries = Object.entries(devices || {});

  if (Object.keys(dashboardCfg).length === 0 && !didBootstrapCfg) {
    if (deviceEntries.length === 0) return;
    didBootstrapCfg = true;
    const inferred = buildDashboardFromDevices();
    if (Object.keys(inferred).length === 0) return;

    dashboardCfg = inferred;
    db.ref(`user/${uid}/dashboard/devices`).set(inferred);
    return;
  }

  const deviceIds = new Set(deviceEntries.map(([id]) => id));
  const missing = {};
  deviceEntries.forEach(([id, device]) => {
    if (!dashboardCfg[id]) {
      missing[id] = createDashboardDeviceConfig(id, device);
    }
  });

  const staleIds = Object.keys(dashboardCfg || {}).filter(id => !deviceIds.has(id));
  if (Object.keys(missing).length === 0 && staleIds.length === 0) return;

  const updates = { ...missing };
  staleIds.forEach(id => {
    updates[id] = null;
  });

  const nextCfg = { ...dashboardCfg, ...missing };
  staleIds.forEach(id => {
    delete nextCfg[id];
  });

  dashboardCfg = nextCfg;
  db.ref(`user/${uid}/dashboard/devices`).update(updates);
}

function buildDashboardFromDevices() {
  const result = {};
  Object.entries(devices || {}).forEach(([id, device]) => {
    result[id] = createDashboardDeviceConfig(id, device);
  });
  return result;
}

function inferDeviceType(device) {
  const declaredRaw = String(device?.type || "").trim();
  if (declaredRaw) return normalizeDeviceType(declaredRaw);

  const keys = getMetricKeysFromDevice(device).map(k => k.toLowerCase());
  if (keys.some(k => k.includes("temperature") || k.includes("humidity") || k.includes("moisture"))) return "sensor";
  if (keys.some(k => k.includes("status") || k.includes("valve") || k.includes("pump") || k.includes("relay"))) return "actuator";
  return "sensor";
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
  return catalog || {};
}

function populateDeviceTypeOptions(selectEl) {
  if (!selectEl) return;
  const types = DEVICE_TYPES;
  selectEl.innerHTML = "";
  types.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = getDeviceTypeLabel(type);
    selectEl.appendChild(opt);
  });
}

function createDashboardDeviceConfig(id, device, options = {}) {
  const selectedType = normalizeDeviceType(options.type || inferDeviceType(device));
  const typeCatalog = getTypeCatalogForDevice(selectedType, device);
  const allKeys = Object.keys(typeCatalog);
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
    name: options.customName || device?.name || getDefaultDeviceName(id),
    type: selectedType,
    visible: true,
    cards
  };
}

function createDevicePayloadByType(id, type, customName) {
  const safeType = normalizeDeviceType(type || "sensor");
  const safeName = customName || getDefaultDeviceName(id);

  if (safeType === "sensor") {
    return {
      name: safeName,
      type: safeType,
      Temperature: 0,
      Humidity: 0,
      Moisture: 0,
      MoistureThreshold: 50
    };
  }

  if (safeType === "actuator") {
    return {
      name: safeName,
      type: safeType,
      status: 0,
      flow: 0,
      pressure: 0,
      threshold: 50
    };
  }

  return {
    name: safeName,
    type: safeType
  };
}

async function upsertDeviceInDb(id, type, customName) {
  const existing = devices[id];
  let payload;

  if (existing && typeof existing === "object") {
    payload = {
      ...existing,
      name: customName || existing.name || getDefaultDeviceName(id),
      type: type || existing.type || inferDeviceType(existing)
    };
  } else {
    payload = createDevicePayloadByType(id, type, customName);
  }

  await db.ref(`${deviceDataPath}/${id}`).set(payload);
  devices[id] = payload;
  return payload;
}

function buildSelectedDevicePayload(id, type, customName, selectedKeys) {
  const base = createDevicePayloadByType(id, type, customName);
  const payload = {
    name: base.name,
    type: base.type
  };

  (selectedKeys || []).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(base, key)) {
      payload[key] = base[key];
      return;
    }

    const meta = (catalog && catalog[key]) || inferMetaFromKey(key);
    if (meta.type === "toggle") {
      payload[key] = 0;
      return;
    }
    if (meta.type === "number-input") {
      payload[key] = key.toLowerCase().includes("threshold") ? 50 : 0;
      return;
    }
    payload[key] = 0;
  });

  return payload;
}

async function createDeviceInDb(id, type, customName, selectedKeys) {
  const payload = buildSelectedDevicePayload(id, type, customName, selectedKeys);
  await db.ref(`${deviceDataPath}/${id}`).set(payload);
  devices[id] = payload;
  return payload;
}

function openCreateCardModal() {
  if (!canEditDashboard()) return;

  const modal = document.getElementById("createCardModal");
  const keyInput = document.getElementById("createCardKeyInput");
  const labelInput = document.getElementById("createCardLabelInput");
  const typeSelect = document.getElementById("createCardTypeSelect");
  const unitInput = document.getElementById("createCardUnitInput");

  if (!modal || !keyInput || !labelInput || !typeSelect || !unitInput) return;

  keyInput.value = "";
  labelInput.value = "";
  unitInput.value = "";
  typeSelect.innerHTML = "";
  CARD_TYPES.forEach(mode => {
    const opt = document.createElement("option");
    opt.value = mode;
    opt.textContent = getCardTypeLabel(mode);
    typeSelect.appendChild(opt);
  });
  typeSelect.value = "display";

  modal.classList.remove("hide");
}

function closeCreateCardModal() {
  const modal = document.getElementById("createCardModal");
  if (modal) modal.classList.add("hide");
}

async function saveCreateCardToCatalog() {
  if (!canEditDashboard()) return;

  const keyInput = document.getElementById("createCardKeyInput");
  const labelInput = document.getElementById("createCardLabelInput");
  const typeSelect = document.getElementById("createCardTypeSelect");
  const unitInput = document.getElementById("createCardUnitInput");
  if (!keyInput || !labelInput || !typeSelect || !unitInput) return;

  const key = keyInput.value.trim();
  if (!key) return alert(tDash("cardKeyRequired"));
  if (/[.#$\[\]/]/.test(key)) return alert(tDash("invalidCardKey"));

  const label = labelInput.value.trim() || humanize(key);
  const type = typeSelect.value || "display";
  const unit = unitInput.value.trim();

  const payload = {
    label,
    type,
    unit,
    icon: ""
  };

  await db.ref(`user/${uid}/catalog/${key}`).update(payload);

  if (!catalog) catalog = {};
  catalog[key] = {
    ...(catalog[key] || {}),
    ...payload
  };

  const addDeviceModal = document.getElementById("addDeviceModal");
  if (addDeviceModal && !addDeviceModal.classList.contains("hide")) {
    renderAddDeviceCardChoices();
  }
  if (activeDevice) {
    populateAddCardSelect(activeDevice);
  }

  closeCreateCardModal();
}

function openAddDeviceModal() {
  if (!canEditDashboard()) return;

  const modal = document.getElementById("addDeviceModal");
  const typeSelect = document.getElementById("addDeviceTypeSelect");
  const saveBtn = document.getElementById("saveAddDeviceBtn");
  const nameInput = document.getElementById("addDeviceNameInput");
  const idInput = document.getElementById("addDeviceIdInput");

  if (!modal || !typeSelect) return;

  if (nameInput) nameInput.value = "";
  if (idInput) idInput.value = "";
  populateDeviceTypeOptions(typeSelect);

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = tDash("selectDeviceTypePlaceholder");
  typeSelect.insertBefore(placeholder, typeSelect.firstChild);

  typeSelect.disabled = false;
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.textContent = tDash("createLabel");
  }

  typeSelect.value = "";
  renderAddDeviceCardChoices();
  syncCreateSaveButtonState();

  modal.classList.remove("hide");
}

function syncCreateSaveButtonState() {
  const idInput = document.getElementById("addDeviceIdInput");
  const typeSelect = document.getElementById("addDeviceTypeSelect");
  const saveBtn = document.getElementById("saveAddDeviceBtn");
  if (!saveBtn) return;
  const id = (idInput && idInput.value ? idInput.value.trim() : "");
  const hasType = !!(typeSelect && typeSelect.value);
  saveBtn.disabled = !id || !hasType;
  saveBtn.textContent = tDash("createLabel");
}

function renderAddDeviceCardChoices() {
  const typeSelect = document.getElementById("addDeviceTypeSelect");
  const label = document.getElementById("cardsToShowLabel");
  const box = document.getElementById("addDeviceCardChoices");
  if (!typeSelect || !box) return;

  if (!typeSelect.value) {
    box.innerHTML = "";
    box.style.display = "none";
    if (label) label.style.display = "none";
    return;
  }

  const type = typeSelect.value;
  const device = {};
  const entries = Object.entries(getTypeCatalogForDevice(type, device));

  box.style.display = "grid";
  if (label) label.style.display = "block";
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

function openUpdateDeviceModal() {
  if (!canEditDashboard()) return;

  const modal = document.getElementById("updateDeviceModal");
  const select = document.getElementById("updateDeviceSelect");
  const openBtn = document.getElementById("openUpdateDeviceBtn");
  if (!modal || !select || !openBtn) return;

  const entries = Object.entries(dashboardCfg || {});
  select.innerHTML = "";
  entries.forEach(([id, cfg]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = `${resolveDeviceNameForLang(id, cfg?.name)} (${id})`;
    select.appendChild(opt);
  });

  openBtn.disabled = entries.length === 0;
  if (entries.length === 0) {
    alert(tDash("noDevicesToUpdate"));
    return;
  }

  modal.classList.remove("hide");
}

function closeUpdateDeviceModal() {
  const modal = document.getElementById("updateDeviceModal");
  if (modal) modal.classList.add("hide");
}

function openSelectedDeviceCustomize() {
  const select = document.getElementById("updateDeviceSelect");
  if (!select || !select.value) return;
  closeUpdateDeviceModal();
  openCustomize(select.value);
}

async function saveAddDevice() {
  if (!canEditDashboard()) return;

  const idInput = document.getElementById("addDeviceIdInput");
  const typeSelect = document.getElementById("addDeviceTypeSelect");
  const nameInput = document.getElementById("addDeviceNameInput");
  const checkedCards = document.querySelectorAll("#addDeviceCardChoices input[type='checkbox']:checked");

  if (!typeSelect) return;
  const id = idInput?.value.trim() || "";
  if (!id) return alert(tDash("deviceIdRequired"));
  if (/[.#$\[\]/]/.test(id)) return alert(tDash("invalidDeviceId"));
  if (devices[id]) return alert(tDash("deviceAlreadyExists"));
  const customName = nameInput?.value.trim() || "";
  const selectedType = typeSelect.value;

  const selectedKeys = [...checkedCards].map(cb => cb.value);
  if (!selectedKeys.length) return alert(tDash("selectOneCard"));

  const deviceForConfig = await createDeviceInDb(id, selectedType, customName, selectedKeys);

  const cfg = createDashboardDeviceConfig(id, deviceForConfig, {
    customName: customName || undefined,
    type: selectedType,
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

    label.append(cb, " ", resolveDeviceNameForLang(id, cfg.name));
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
    dash.innerHTML = `<div class="empty-state"><h3>${tDash("noDevicesTitle")}</h3><p>${tDash("dbPathLabel")}: ${deviceDataPath || "user/{uid}/devices"}</p></div>`;
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
    title.textContent = resolveDeviceNameForLang(id, cfg.name);

    const customizeBtn = document.createElement("button");
    customizeBtn.type = "button";
    customizeBtn.textContent = tDash("customizeBtn");
    customizeBtn.addEventListener("click", () => openCustomize(id));

    const actions = document.createElement("div");
    actions.className = "device-header-actions";
    actions.appendChild(customizeBtn);

    const cardsWrap = document.createElement("div");
    cardsWrap.className = "cards sortable";
    cardsWrap.id = `cards-${id}`;

    header.appendChild(title);
    if (unlocked) header.appendChild(actions);
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

async function deleteDeviceEverywhere(deviceId) {
  if (!canEditDashboard()) return;
  const label = resolveDeviceNameForLang(
    deviceId,
    (dashboardCfg[deviceId] && dashboardCfg[deviceId].name) || (devices[deviceId] && devices[deviceId].name)
  );
  if (!confirm(`${tDash("deleteDeviceSymbolTitle")}: ${label}?`)) return;

  await db.ref(`user/${uid}/dashboard/devices/${deviceId}`).remove();
  await db.ref(`${deviceDataPath}/${deviceId}`).remove();

  if (activeDevice === deviceId) closeCustomize();
}

function getEffectiveCardMeta(deviceId, key, cardCfg, deviceCfg) {
  const cfg = deviceCfg || dashboardCfg[deviceId] || {};
  const device = devices[deviceId] || {};
  const sourceKey = cardCfg.sourceKey || key;
  const baseCatalog = getTypeCatalogForDevice(cfg.type || inferDeviceType(device), device);
  const base = baseCatalog[sourceKey] || inferMetaFromKey(sourceKey);
  return {
    ...base,
    ...cardCfg,
    label: resolveCardLabelForLang(sourceKey, cardCfg.label, base.label || humanize(sourceKey)),
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
    const metricKey = cardCfg.sourceKey || key;

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.key = key;

    const dragHandle = document.createElement("span");
    dragHandle.className = "drag-handle";
    dragHandle.textContent = "";
    dragHandle.setAttribute("aria-label", tDash("reorderCardAriaLabel"));

    const header = document.createElement("div");
    header.className = "card-header";

    const label = document.createElement("span");
    label.textContent = `${meta.label}`;

    header.appendChild(label);
    if (unlocked) {
      card.classList.add("has-drag-handle");
      card.appendChild(dragHandle);
    }

    const valueEl = document.createElement("div");
    valueEl.className = "card-value";

    card.appendChild(header);
    card.appendChild(valueEl);
    wrap.appendChild(card);

    getDeviceValueRef(deviceId, metricKey).on("value", snap => {
      renderCardValue(valueEl, meta, snap.val(), deviceId, metricKey, card);
    });

    count += 1;
  });

  if (unlocked) enableCardReorder(wrap, deviceId);

  return count;
}

function renderCardValue(el, meta, val, deviceId, key, cardEl) {
  el.innerHTML = "";
  applyPercentageCardShade(cardEl, meta, val);

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

function applyPercentageCardShade(cardEl, meta, val) {
  if (!cardEl) return;

  const unit = String(meta?.unit || "").trim();
  if (unit !== "%") {
    cardEl.classList.remove("percent-card");
    cardEl.style.removeProperty("--percent-card-bg");
    return;
  }

  cardEl.classList.add("percent-card");

  const numeric = Number(val);
  if (!Number.isFinite(numeric)) {
    cardEl.style.removeProperty("--percent-card-bg");
    return;
  }

  const clamped = Math.max(0, Math.min(100, numeric));
  const hue = (clamped / 100) * 120;
  const bg = `hsl(${hue}, 72%, 91%)`;
  cardEl.style.setProperty("--percent-card-bg", bg);
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
  activeDeviceOriginalCards = JSON.parse(JSON.stringify(cfg.cards || {}));

  const displayName = resolveDeviceNameForLang(deviceId, cfg.name);
  document.getElementById("customizeTitle").textContent = `${tDash("customizeTitlePrefix")} ${displayName}`;
  document.getElementById("deviceNameInput").value = displayName;

  const typeSelect = document.getElementById("deviceTypeInput");
  populateDeviceTypeOptions(typeSelect);
  typeSelect.value = normalizeDeviceType(cfg.type || inferDeviceType(devices[deviceId]));

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
    title.textContent = meta.label || humanize(key);

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
      opt.textContent = getCardTypeLabel(mode);
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
  const options = Object.keys(typeCatalog);

  select.innerHTML = "";
  options.forEach(key => {
    const meta = typeCatalog[key] || inferMetaFromKey(key);
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${resolveCardLabelForLang(key, meta.label, humanize(key))} (${key})`;
    select.appendChild(opt);
  });

  if (options.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = tDash("noAddCardOptions");
    select.appendChild(opt);
  } else {
    select.value = options[0];
  }

  select.disabled = options.length === 0;
  addBtn.disabled = options.length === 0;
}

function buildDuplicateCardKey(cards, baseKey) {
  if (!cards[baseKey]) return baseKey;
  let index = 1;
  let candidate = `${baseKey}${index}`;
  while (cards[candidate]) {
    index += 1;
    candidate = `${baseKey}${index}`;
  }
  return candidate;
}

function getCardLabelForKey(baseLabel, cardKey) {
  const m = /(\d+)$/.exec(cardKey);
  if (!m) return baseLabel;
  return `${baseLabel} ${m[1]}`;
}

function addCardToActiveDevice() {
  if (!activeDevice) return;
  const select = document.getElementById("addCardSelect");
  if (!select || !select.value) return;

  const cfg = dashboardCfg[activeDevice];
  if (!cfg) return;
  if (!cfg.cards || typeof cfg.cards !== "object") cfg.cards = {};

  const typeCatalog = getTypeCatalogForDevice(cfg.type || inferDeviceType(devices[activeDevice]), devices[activeDevice]);
  const baseKey = select.value;
  const cardKey = buildDuplicateCardKey(cfg.cards, baseKey);
  const meta = typeCatalog[baseKey] || inferMetaFromKey(baseKey);
  const label = getCardLabelForKey(meta.label || humanize(baseKey), cardKey);

  const maxOrder = Math.max(0, ...Object.values(cfg.cards || {}).map(c => c.order || 0));
  cfg.cards[cardKey] = {
    visible: true,
    order: maxOrder + 1,
    sourceKey: baseKey,
    label,
    type: meta.type || "display",
    unit: meta.unit || "",
    icon: meta.icon || ""
  };

  upsertCatalogCard(baseKey, cfg.cards[cardKey]);

  renderCustomizeCardOptions(activeDevice);
  populateAddCardSelect(activeDevice);
}

function closeCustomize() {
  document.getElementById("customizeModal").classList.add("hide");
  activeDeviceOriginalCards = null;
}

async function removeActiveDeviceFromDashboard() {
  if (!canEditDashboard()) return;
  if (!activeDevice) return;
  await deleteDeviceEverywhere(activeDevice);
}

function collectCatalogLabelUpdates(deviceType, cards) {
  const typeCatalog = catalog || {};
  const updates = {};

  Object.entries(cards || {}).forEach(([cardKey, cardCfg]) => {
    const sourceKey = cardCfg.sourceKey || cardKey;
    const catalogMeta = typeCatalog[sourceKey];
    if (!catalogMeta) return;

    const nextLabel = String(cardCfg.label || "").trim();
    if (!nextLabel) return;
    if (nextLabel === String(catalogMeta.label || "").trim()) return;

    updates[`user/${uid}/catalog/${sourceKey}/label`] = nextLabel;
  });

  return updates;
}

function upsertCatalogCard(sourceKey, cardCfg) {
  const key = String(sourceKey || "").trim();
  if (!key) return;

  const existing = (catalog && catalog[key]) || {};
  const next = {
    ...existing,
    label: String(cardCfg.label || existing.label || humanize(key)).trim(),
    type: cardCfg.type || existing.type || "display",
    unit: cardCfg.unit ?? existing.unit ?? "",
    icon: cardCfg.icon ?? existing.icon ?? ""
  };

  if (!catalog) catalog = {};
  catalog[key] = next;
  db.ref(`user/${uid}/catalog/${key}`).update(next);
}

function getCardSourceCounts(cards) {
  const counts = {};
  Object.entries(cards || {}).forEach(([cardKey, cardCfg]) => {
    const sourceKey = cardCfg.sourceKey || cardKey;
    counts[sourceKey] = (counts[sourceKey] || 0) + 1;
  });
  return counts;
}

async function saveCustomize() {
  if (!canEditDashboard()) return;
  if (!activeDevice) return;

  const cfg = dashboardCfg[activeDevice];
  const name = document.getElementById("deviceNameInput").value.trim();
  const type = document.getElementById("deviceTypeInput").value;
  if (!name) return alert(tDash("deviceNameRequired"));

  cfg.name = name;
  cfg.type = type;
  normalizeCardOrder(cfg.cards || {});

  const originalCounts = getCardSourceCounts(activeDeviceOriginalCards || {});
  const nextCounts = getCardSourceCounts(cfg.cards || {});
  const removedSourceKeys = Object.keys(originalCounts).filter(sourceKey => !nextCounts[sourceKey]);

  const updates = {
    [`user/${uid}/dashboard/devices/${activeDevice}/name`]: cfg.name,
    [`user/${uid}/dashboard/devices/${activeDevice}/type`]: cfg.type,
    [`user/${uid}/dashboard/devices/${activeDevice}/cards`]: cfg.cards,
    ...collectCatalogLabelUpdates(cfg.type, cfg.cards)
  };

  removedSourceKeys.forEach(sourceKey => {
    updates[`${deviceDataPath}/${activeDevice}/${sourceKey}`] = null;
  });

  await db.ref().update(updates);

  if (!catalog) catalog = {};
  Object.entries(cfg.cards || {}).forEach(([cardKey, cardCfg]) => {
    const sourceKey = cardCfg.sourceKey || cardKey;
    if (!catalog[sourceKey]) return;
    catalog[sourceKey] = {
      ...catalog[sourceKey],
      label: cardCfg.label
    };
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
