/* ===============================
   NAVBAR LOADER + USER INIT
================================ */

let activeUser = null;
let activeUserProfile = {};
const ADMIN_STORAGE_KEY = "smartagro_admin_logged_in";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";
const LANGUAGE_STORAGE_KEY = "smartagro_language";

const NAV_I18N = {
  en: {
    navDashboardLabel: "Dashboard",
    navAnalyticsLabel: "Analytics",
    navCalendarLabel: "Calendar",
    editProfileMenuItem: "Edit Profile",
    languageLabel: "Language",
    logoutMenuItem: "Logout",
    adminLogin: "Admin Login",
    adminLogout: "Admin Logout",
    profileEditTitle: "Edit Profile",
    profileEditSubtitle: "Update your display name for SmartAgro.",
    displayNameLabel: "Display Name",
    mobileNumberLabel: "Mobile Number",
    regionLabel: "Region",
    cityLabel: "City",
    excelPathLabel: "Excel Path",
    profileNamePlaceholder: "Enter your name",
    mobilePlaceholder: "Enter mobile number",
    regionPlaceholder: "Enter region/state",
    cityPlaceholder: "Enter city",
    excelPathPlaceholder: "Enter Excel path",
    pickExcelPathBtn: "Browse",
    excelPathHint: "For drive path, type manually (example: D:\\Farm\\weather.xlsx).",
    profileEditCancel: "Cancel",
    profileEditSave: "Save",
    adminPromptUser: "Enter username",
    adminPromptPass: "Enter password",
    adminInvalid: "Invalid admin credentials.",
    profileNameEmpty: "Display name cannot be empty.",
    mobileInvalid: "Enter a valid mobile number.",
    profileSaveFailed: "Failed to update profile.",
    defaultProfileName: "User"
  },
  hi: {
    navDashboardLabel: "नियंत्रण पटल",
    navAnalyticsLabel: "विश्लेषण",
    navCalendarLabel: "दिनदर्शिका",
    editProfileMenuItem: "रूपरेखा संपादित करें",
    languageLabel: "भाषा",
    logoutMenuItem: "बाहर निकलें",
    adminLogin: "प्रशासक प्रवेश",
    adminLogout: "प्रशासक निर्गमन",
    profileEditTitle: "रूपरेखा संपादित करें",
    profileEditSubtitle: "SmartAgro के लिए अपना प्रदर्शित नाम अद्यतन करें।",
    displayNameLabel: "प्रदर्शित नाम",
    mobileNumberLabel: "मोबाइल नंबर",
    regionLabel: "क्षेत्र",
    cityLabel: "शहर",
    excelPathLabel: "एक्सेल पथ",
    profileNamePlaceholder: "अपना नाम दर्ज करें",
    mobilePlaceholder: "मोबाइल नंबर दर्ज करें",
    regionPlaceholder: "क्षेत्र/राज्य दर्ज करें",
    cityPlaceholder: "शहर दर्ज करें",
    excelPathPlaceholder: "एक्सेल पथ दर्ज करें",
    pickExcelPathBtn: "ब्राउज़",
    excelPathHint: "ड्राइव पथ के लिए मैन्युअल टाइप करें (उदाहरण: D:\\Farm\\weather.xlsx)।",
    profileEditCancel: "रद्द करें",
    profileEditSave: "सहेजें",
    adminPromptUser: "यूजरनेम दर्ज करें",
    adminPromptPass: "पासवर्ड दर्ज करें",
    adminInvalid: "अमान्य प्रशासक प्रमाण-पत्र।",
    profileNameEmpty: "प्रदर्शित नाम खाली नहीं हो सकता।",
    mobileInvalid: "कृपया मान्य मोबाइल नंबर दर्ज करें।",
    profileSaveFailed: "रूपरेखा अद्यतन नहीं हो पाई।",
    defaultProfileName: "उपयोगकर्ता"
  },
  mr: {
    navDashboardLabel: "नियंत्रण फलक",
    navAnalyticsLabel: "विश्लेषण",
    navCalendarLabel: "दिनदर्शिका",
    editProfileMenuItem: "रूपरेखा संपादित करा",
    languageLabel: "भाषा",
    logoutMenuItem: "बाहेर पडा",
    adminLogin: "प्रशासक प्रवेश",
    adminLogout: "प्रशासक निर्गमन",
    profileEditTitle: "रूपरेखा संपादित करा",
    profileEditSubtitle: "SmartAgro साठी तुमचे प्रदर्शित नाव अद्यतनित करा.",
    displayNameLabel: "प्रदर्शित नाव",
    mobileNumberLabel: "मोबाइल क्रमांक",
    regionLabel: "प्रदेश",
    cityLabel: "शहर",
    excelPathLabel: "एक्सेल मार्ग",
    profileNamePlaceholder: "तुमचे नाव लिहा",
    mobilePlaceholder: "मोबाइल क्रमांक टाका",
    regionPlaceholder: "प्रदेश/राज्य टाका",
    cityPlaceholder: "शहर टाका",
    excelPathPlaceholder: "एक्सेल मार्ग टाका",
    pickExcelPathBtn: "ब्राउझ",
    excelPathHint: "ड्राइव्ह मार्गासाठी स्वतः लिहा (उदा.: D:\\Farm\\weather.xlsx).",
    profileEditCancel: "रद्द करा",
    profileEditSave: "जतन करा",
    adminPromptUser: "युजरनेम टाका",
    adminPromptPass: "पासवर्ड टाका",
    adminInvalid: "अवैध प्रशासक तपशील.",
    profileNameEmpty: "प्रदर्शित नाव रिकामे असू शकत नाही.",
    mobileInvalid: "कृपया वैध मोबाइल क्रमांक टाका.",
    profileSaveFailed: "रूपरेखा अद्यतनित करण्यात अयशस्वी.",
    defaultProfileName: "वापरकर्ता"
  }
};

const LANGUAGE_OPTION_LABELS = {
  en: {
    en: "English",
    hi: "हिंदी",
    mr: "मराठी"
  },
  hi: {
    en: "English",
    hi: "हिंदी",
    mr: "मराठी"
  },
  mr: {
    en: "English",
    hi: "हिंदी",
    mr: "मराठी"
  }
};

function getCurrentLanguage() {
  const lang = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
  return NAV_I18N[lang] ? lang : "en";
}

function tNav(key) {
  const lang = getCurrentLanguage();
  return (NAV_I18N[lang] && NAV_I18N[lang][key]) || NAV_I18N.en[key] || key;
}

function setCurrentLanguage(lang) {
  if (!NAV_I18N[lang]) return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  applyNavbarLanguage();

  document.dispatchEvent(new CustomEvent("language-changed", {
    detail: { lang }
  }));
}

function applyNavbarLanguage() {
  const keys = [
    "navDashboardLabel",
    "navAnalyticsLabel",
    "navCalendarLabel",
    "editProfileMenuItem",
    "languageLabel",
    "logoutMenuItem",
    "profileEditTitle",
    "profileEditSubtitle",
    "displayNameLabel",
    "mobileNumberLabel",
    "regionLabel",
    "cityLabel",
    "excelPathLabel",
    "pickExcelPathBtn",
    "excelPathHint",
    "profileEditCancel",
    "profileEditSave"
  ];

  keys.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = tNav(id);
  });

  const nameInput = document.getElementById("editProfileName");
  if (nameInput) nameInput.placeholder = tNav("profileNamePlaceholder");

  const mobileInput = document.getElementById("editProfileMobile");
  if (mobileInput) mobileInput.placeholder = tNav("mobilePlaceholder");

  const regionInput = document.getElementById("editProfileRegion");
  if (regionInput) regionInput.placeholder = tNav("regionPlaceholder");

  const cityInput = document.getElementById("editProfileCity");
  if (cityInput) cityInput.placeholder = tNav("cityPlaceholder");

  const excelPathInput = document.getElementById("editProfileExcelPath");
  if (excelPathInput) excelPathInput.placeholder = tNav("excelPathPlaceholder");

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
    const lang = getCurrentLanguage();
    const labels = LANGUAGE_OPTION_LABELS[lang] || LANGUAGE_OPTION_LABELS.en;
    Array.from(languageSelect.options).forEach(option => {
      const label = labels[option.value];
      if (label) option.textContent = label;
    });
    languageSelect.value = lang;
  }

  if (activeUser) initNavbarUser(activeUser);

  updateAdminAccessUi();
}

function initLanguageUi() {
  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect && !languageSelect.dataset.bound) {
    languageSelect.value = getCurrentLanguage();
    languageSelect.addEventListener("change", () => {
      setCurrentLanguage(languageSelect.value);
    });
    languageSelect.dataset.bound = "1";
  }
}

function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) === "1";
}

function setAdminAuthenticated(isAdmin) {
  if (isAdmin) {
    localStorage.setItem(ADMIN_STORAGE_KEY, "1");
  } else {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }

  document.dispatchEvent(new CustomEvent("admin-state-changed", {
    detail: { isAdmin }
  }));
}

function updateAdminAccessUi() {
  const menuItem = document.getElementById("adminAccessMenuItem");
  if (!menuItem) return;

  menuItem.textContent = isAdminAuthenticated() ? tNav("adminLogout") : tNav("adminLogin");
}

function localizeDigitsForLanguage(text, lang) {
  if (lang !== "hi" && lang !== "mr") return text;
  const devanagari = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(text).replace(/[0-9]/g, d => devanagari[Number(d)]);
}

function normalizeLocalizedDigits(text) {
  return String(text || "").replace(/[०-९]/g, d => String("०१२३४५६७८९".indexOf(d)));
}

async function loadUserProfile(uid) {
  if (!uid) return {};
  try {
    const snap = await firebase.database().ref(`user/${uid}/profile`).once("value");
    return snap.val() || {};
  } catch {
    return {};
  }
}

function initNavbarUser(user) {
  if (!user) return;

  const lang = getCurrentLanguage();

  const rawName =
    user.displayName ||
    (user.email ? user.email.split("@")[0] : tNav("defaultProfileName"));

  const displayName = localizeDigitsForLanguage(rawName, lang);

  const avatar = rawName
    .split(" ")
    .map(p => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const nameEl = document.getElementById("profileName");
  const avatarEl = document.getElementById("profileAvatar");
  const editNameEl = document.getElementById("editProfileName");
  const editMobileEl = document.getElementById("editProfileMobile");
  const editRegionEl = document.getElementById("editProfileRegion");
  const editCityEl = document.getElementById("editProfileCity");
  const editExcelPathEl = document.getElementById("editProfileExcelPath");

  if (nameEl) nameEl.textContent = displayName;
  if (avatarEl) avatarEl.textContent = avatar;
  if (editNameEl) editNameEl.value = rawName;
  if (editMobileEl) {
    const mobile = activeUserProfile && activeUserProfile.mobile ? String(activeUserProfile.mobile) : "";
    editMobileEl.value = localizeDigitsForLanguage(mobile, lang);
  }
  if (editRegionEl) editRegionEl.value = (activeUserProfile && activeUserProfile.region) ? String(activeUserProfile.region) : "";
  if (editCityEl) editCityEl.value = (activeUserProfile && activeUserProfile.city) ? String(activeUserProfile.city) : "";
  if (editExcelPathEl) editExcelPathEl.value = (activeUserProfile && activeUserProfile.excelPath) ? String(activeUserProfile.excelPath) : "";
}

function initProfileModal() {
  const cancelBtn = document.getElementById("profileEditCancel");
  const saveBtn = document.getElementById("profileEditSave");
  const modal = document.getElementById("profileEditModal");
  const pickExcelBtn = document.getElementById("pickExcelPathBtn");
  const excelPicker = document.getElementById("excelPathPicker");
  const excelPathInput = document.getElementById("editProfileExcelPath");

  if (cancelBtn) cancelBtn.addEventListener("click", closeProfileModal);
  if (saveBtn) saveBtn.addEventListener("click", saveProfile);
  if (pickExcelBtn && excelPicker) {
    pickExcelBtn.addEventListener("click", () => excelPicker.click());
  }
  if (excelPicker && excelPathInput) {
    excelPicker.addEventListener("change", () => {
      const file = excelPicker.files && excelPicker.files[0];
      if (!file) return;
      excelPathInput.value = file.name || "";
    });
  }

  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeProfileModal();
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeProfileModal();
  });

  initLanguageUi();
  applyNavbarLanguage();
}

/* ===============================
   LOAD NAVBAR HTML
================================ */

document.addEventListener("DOMContentLoaded", () => {
  fetch("navbar.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("navbar").innerHTML = html;

      highlightActiveNav();
      initProfileModal();
      applyNavbarLanguage();

      firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          location.href = "sign_in.html";
          return;
        }
        activeUser = user;
        loadUserProfile(user.uid).then(profile => {
          activeUserProfile = profile || {};
          initNavbarUser(user);
        });
      });
    });
});

/* ===============================
   ACTIVE TAB HIGHLIGHT
================================ */

function highlightActiveNav() {
  const page = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-center a").forEach(a => {
    if (a.getAttribute("href") === page) {
      a.classList.add("active");
    }
  });
}

/* ===============================
   PROFILE MENU
================================ */

function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");
  if (menu) {
    menu.style.display =
      menu.style.display === "block" ? "none" : "block";
  }
}

async function handleEditProfile() {
  const menu = document.getElementById("profileMenu");
  if (menu) menu.style.display = "none";

  if (activeUser) {
    activeUserProfile = await loadUserProfile(activeUser.uid);
  }

  if (activeUser) {
    initNavbarUser(activeUser);
  }

  const modal = document.getElementById("profileEditModal");
  const errorEl = document.getElementById("profileEditError");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hide");
  }
  if (modal) modal.classList.remove("hide");
  updateAdminAccessUi();
}

function toggleAdminAccess() {
  const menu = document.getElementById("profileMenu");
  if (menu) menu.style.display = "none";

  if (isAdminAuthenticated()) {
    setAdminAuthenticated(false);
    updateAdminAccessUi();
    return;
  }

  const username = window.prompt(tNav("adminPromptUser"));
  if (username === null) return;
  const password = window.prompt(tNav("adminPromptPass"));
  if (password === null) return;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    setAdminAuthenticated(true);
    updateAdminAccessUi();
    return;
  }

  alert(tNav("adminInvalid"));
}

window.toggleAdminAccess = toggleAdminAccess;

function closeProfileModal() {
  const modal = document.getElementById("profileEditModal");
  const errorEl = document.getElementById("profileEditError");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hide");
  }
  if (modal) modal.classList.add("hide");
}

async function saveProfile() {
  const input = document.getElementById("editProfileName");
  const mobileInput = document.getElementById("editProfileMobile");
  const regionInput = document.getElementById("editProfileRegion");
  const cityInput = document.getElementById("editProfileCity");
  const excelPathInput = document.getElementById("editProfileExcelPath");
  const errorEl = document.getElementById("profileEditError");
  const saveBtn = document.getElementById("profileEditSave");

  if (!input || !activeUser) return;

  const nextName = input.value.trim();
  const nextMobileRaw = mobileInput ? normalizeLocalizedDigits(mobileInput.value).trim() : "";
  const nextRegion = regionInput ? regionInput.value.trim() : "";
  const nextCity = cityInput ? cityInput.value.trim() : "";
  const nextExcelPath = excelPathInput ? excelPathInput.value.trim() : "";
  const normalizedMobile = nextMobileRaw.replace(/[\s()-]/g, "");
  const mobileIsValid = !normalizedMobile || /^\+?[0-9]{7,15}$/.test(normalizedMobile);

  if (!nextName) {
    if (errorEl) {
      errorEl.textContent = tNav("profileNameEmpty");
      errorEl.classList.remove("hide");
    }
    return;
  }

  if (!mobileIsValid) {
    if (errorEl) {
      errorEl.textContent = tNav("mobileInvalid");
      errorEl.classList.remove("hide");
    }
    return;
  }

  if (saveBtn) saveBtn.disabled = true;
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hide");
  }

  try {
    await activeUser.updateProfile({ displayName: nextName });

    const db = firebase.database();
    await db.ref(`user/${activeUser.uid}/profile`).update({
      name: nextName,
      mobile: nextMobileRaw,
      region: nextRegion,
      city: nextCity,
      excelPath: nextExcelPath,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });

    activeUserProfile = {
      ...(activeUserProfile || {}),
      name: nextName,
      mobile: nextMobileRaw,
      region: nextRegion,
      city: nextCity,
      excelPath: nextExcelPath
    };

    initNavbarUser(activeUser);
    closeProfileModal();
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = (err && err.message) ? err.message : tNav("profileSaveFailed");
      errorEl.classList.remove("hide");
    }
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
}

document.addEventListener("click", e => {
  const wrapper = document.querySelector(".profile-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.style.display = "none";
  }
});
