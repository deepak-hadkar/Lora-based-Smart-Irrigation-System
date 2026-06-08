/* ===============================
   NAVBAR LOADER + USER INIT
================================ */

let activeUser = null;
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
    profileNamePlaceholder: "Enter your name",
    profileEditCancel: "Cancel",
    profileEditSave: "Save",
    adminPromptUser: "Enter username",
    adminPromptPass: "Enter password",
    adminInvalid: "Invalid admin credentials.",
    profileNameEmpty: "Display name cannot be empty.",
    profileSaveFailed: "Failed to update profile.",
    defaultProfileName: "User"
  },
  hi: {
    navDashboardLabel: "डैशबोर्ड",
    navAnalyticsLabel: "एनालिटिक्स",
    navCalendarLabel: "कैलेंडर",
    editProfileMenuItem: "प्रोफाइल संपादित करें",
    languageLabel: "भाषा",
    logoutMenuItem: "लॉगआउट",
    adminLogin: "एडमिन लॉगिन",
    adminLogout: "एडमिन लॉगआउट",
    profileEditTitle: "प्रोफाइल संपादित करें",
    profileEditSubtitle: "SmartAgro के लिए अपना डिस्प्ले नाम अपडेट करें।",
    displayNameLabel: "डिस्प्ले नाम",
    profileNamePlaceholder: "अपना नाम दर्ज करें",
    profileEditCancel: "रद्द करें",
    profileEditSave: "सेव करें",
    adminPromptUser: "यूजरनेम दर्ज करें",
    adminPromptPass: "पासवर्ड दर्ज करें",
    adminInvalid: "अमान्य एडमिन क्रेडेंशियल्स।",
    profileNameEmpty: "डिस्प्ले नाम खाली नहीं हो सकता।",
    profileSaveFailed: "प्रोफाइल अपडेट नहीं हो पाया।",
    defaultProfileName: "उपयोगकर्ता"
  },
  mr: {
    navDashboardLabel: "डॅशबोर्ड",
    navAnalyticsLabel: "अनालिटिक्स",
    navCalendarLabel: "कॅलेंडर",
    editProfileMenuItem: "प्रोफाइल संपादित करा",
    languageLabel: "भाषा",
    logoutMenuItem: "लॉगआउट",
    adminLogin: "अ‍ॅडमिन लॉगिन",
    adminLogout: "अ‍ॅडमिन लॉगआउट",
    profileEditTitle: "प्रोफाइल संपादित करा",
    profileEditSubtitle: "SmartAgro साठी तुमचे डिस्प्ले नाव अपडेट करा.",
    displayNameLabel: "डिस्प्ले नाव",
    profileNamePlaceholder: "तुमचे नाव लिहा",
    profileEditCancel: "रद्द करा",
    profileEditSave: "सेव्ह करा",
    adminPromptUser: "युजरनेम टाका",
    adminPromptPass: "पासवर्ड टाका",
    adminInvalid: "अवैध अ‍ॅडमिन तपशील.",
    profileNameEmpty: "डिस्प्ले नाव रिकामे असू शकत नाही.",
    profileSaveFailed: "प्रोफाइल अपडेट करण्यात अयशस्वी.",
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
    "profileEditCancel",
    "profileEditSave"
  ];

  keys.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = tNav(id);
  });

  const nameInput = document.getElementById("editProfileName");
  if (nameInput) nameInput.placeholder = tNav("profileNamePlaceholder");

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

  if (nameEl) nameEl.textContent = displayName;
  if (avatarEl) avatarEl.textContent = avatar;
  if (editNameEl) editNameEl.value = rawName;
}

function initProfileModal() {
  const cancelBtn = document.getElementById("profileEditCancel");
  const saveBtn = document.getElementById("profileEditSave");
  const modal = document.getElementById("profileEditModal");

  if (cancelBtn) cancelBtn.addEventListener("click", closeProfileModal);
  if (saveBtn) saveBtn.addEventListener("click", saveProfile);

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
        initNavbarUser(user);
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

function handleEditProfile() {
  const menu = document.getElementById("profileMenu");
  if (menu) menu.style.display = "none";

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
  const errorEl = document.getElementById("profileEditError");
  const saveBtn = document.getElementById("profileEditSave");

  if (!input || !activeUser) return;

  const nextName = input.value.trim();
  if (!nextName) {
    if (errorEl) {
      errorEl.textContent = tNav("profileNameEmpty");
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
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });

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
