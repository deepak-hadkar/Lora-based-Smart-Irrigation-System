const cal = {
  LANGUAGE_STORAGE_KEY: "smartagro_language",

  i18n: {
    en: {
      calTitle: "Scheduler",
      cancelAllBtn: "Cancel All",
      simulateBtn: "Simulate",
      calendarLabel: "Calendar",
      historyLabel: "History",
      scheduleFormTitle: "Schedule Watering",
      dateLabel: "Date",
      scheduleTypeLabel: "Schedule Type",
      scheduleTypeSingle: "Single Date",
      scheduleTypeMonth: "Entire Month",
      scheduleTypeWeekdays: "Specific Weekdays",
      weekdaySunday: "Sunday",
      weekdayMonday: "Monday",
      weekdayTuesday: "Tuesday",
      weekdayWednesday: "Wednesday",
      weekdayThursday: "Thursday",
      weekdayFriday: "Friday",
      weekdaySaturday: "Saturday",
      valveOnLabel: "Valve ON",
      valveOffLabel: "Valve OFF",
      cancelBtn: "Cancel",
      saveBtn: "Save",
      deleteBtn: "Cancel Schedule",
      historyTitle: "Irrigation History",
      exportCsvBtn: "Export CSV",
      historyDateHead: "Date",
      historyOnHead: "ON",
      historyOffHead: "OFF",
      historySourceHead: "Source",
      historyStatusHead: "Status",
      historyCompletedHead: "Completed",
      historyDurationHead: "Duration",
      confirmCancelAll: "Cancel ALL irrigation schedules?\nThis cannot be undone.",
      allCancelled: "All schedules cancelled",
      runningBadge: "Running",
      confirmCancelDate: "Cancel irrigation for this date?",
      selectOnOff: "Select ON and OFF time",
      selectWeekdays: "Select weekdays",
      noScheduleToday: "No schedule today",
      statusCompleted: "completed",
      sourceSingle: "Single Date",
      sourceMonthly: "Entire Month",
      sourceWeekly: "Specific Weekdays",
      csvFileName: "irrigation_history.csv",
      durationMin: "min"
    },
    hi: {
      calTitle: "सिंचाई समय-सारणी",
      cancelAllBtn: "सभी रद्द करें",
      simulateBtn: "अनुकरण करें",
      calendarLabel: "दिनदर्शिका",
      historyLabel: "इतिहास",
      scheduleFormTitle: "सिंचाई समय-सारणी बनाएं",
      dateLabel: "तारीख",
      scheduleTypeLabel: "समय-सारणी प्रकार",
      scheduleTypeSingle: "एकल तारीख",
      scheduleTypeMonth: "पूरा महीना",
      scheduleTypeWeekdays: "विशिष्ट सप्ताह के दिन",
      weekdaySunday: "रविवार",
      weekdayMonday: "सोमवार",
      weekdayTuesday: "मंगलवार",
      weekdayWednesday: "बुधवार",
      weekdayThursday: "गुरुवार",
      weekdayFriday: "शुक्रवार",
      weekdaySaturday: "शनिवार",
      valveOnLabel: "वाल्व चालू",
      valveOffLabel: "वाल्व बंद",
      cancelBtn: "रद्द करें",
      saveBtn: "सहेजें",
      deleteBtn: "समय-सारणी रद्द करें",
      historyTitle: "सिंचाई इतिहास",
      exportCsvBtn: "CSV निर्यात करें",
      historyDateHead: "तारीख",
      historyOnHead: "चालू",
      historyOffHead: "बंद",
      historySourceHead: "स्रोत",
      historyStatusHead: "स्थिति",
      historyCompletedHead: "पूर्ण हुआ",
      historyDurationHead: "अवधि",
      confirmCancelAll: "क्या सभी सिंचाई समय-सारणियां रद्द करें?\nइसे वापस नहीं किया जा सकता।",
      allCancelled: "सभी समय-सारणियां रद्द की गईं",
      runningBadge: "चालू",
      confirmCancelDate: "क्या इस तारीख की सिंचाई रद्द करें?",
      selectOnOff: "चालू और बंद समय चुनें",
      selectWeekdays: "सप्ताह के दिन चुनें",
      noScheduleToday: "आज कोई समय-सारणी नहीं है",
      statusCompleted: "पूर्ण",
      sourceSingle: "एकल तारीख",
      sourceMonthly: "पूरा महीना",
      sourceWeekly: "विशिष्ट सप्ताह के दिन",
      csvFileName: "sinchai_itihas.csv",
      durationMin: "मिनट"
    },
    mr: {
      calTitle: "सिंचन वेळापत्रक",
      cancelAllBtn: "सर्व रद्द करा",
      simulateBtn: "अनुकरण करा",
      calendarLabel: "दिनदर्शिका",
      historyLabel: "इतिहास",
      scheduleFormTitle: "सिंचन वेळापत्रक तयार करा",
      dateLabel: "तारीख",
      scheduleTypeLabel: "वेळापत्रक प्रकार",
      scheduleTypeSingle: "एकच तारीख",
      scheduleTypeMonth: "संपूर्ण महिना",
      scheduleTypeWeekdays: "विशिष्ट आठवड्याचे दिवस",
      weekdaySunday: "रविवार",
      weekdayMonday: "सोमवार",
      weekdayTuesday: "मंगळवार",
      weekdayWednesday: "बुधवार",
      weekdayThursday: "गुरुवार",
      weekdayFriday: "शुक्रवार",
      weekdaySaturday: "शनिवार",
      valveOnLabel: "नळ चालू",
      valveOffLabel: "नळ बंद",
      cancelBtn: "रद्द करा",
      saveBtn: "जतन करा",
      deleteBtn: "वेळापत्रक रद्द करा",
      historyTitle: "सिंचन इतिहास",
      exportCsvBtn: "CSV निर्यात करा",
      historyDateHead: "तारीख",
      historyOnHead: "चालू",
      historyOffHead: "बंद",
      historySourceHead: "स्रोत",
      historyStatusHead: "स्थिती",
      historyCompletedHead: "पूर्ण",
      historyDurationHead: "कालावधी",
      confirmCancelAll: "सर्व सिंचन वेळापत्रके रद्द करायची का?\nहे परत आणता येणार नाही.",
      allCancelled: "सर्व वेळापत्रके रद्द झाली",
      runningBadge: "चालू",
      confirmCancelDate: "या तारखेचे सिंचन रद्द करायचे का?",
      selectOnOff: "चालू आणि बंद वेळ निवडा",
      selectWeekdays: "आठवड्याचे दिवस निवडा",
      noScheduleToday: "आज कोणतेही वेळापत्रक नाही",
      statusCompleted: "पूर्ण",
      sourceSingle: "एकच तारीख",
      sourceMonthly: "संपूर्ण महिना",
      sourceWeekly: "विशिष्ट आठवड्याचे दिवस",
      csvFileName: "sinchan_itihas.csv",
      durationMin: "मिनिटे"
    }
  },

  schedules: {},
  executions: {},
  history: {},
  timePicker: {
    open: false,
    mode: "hour",
    hour: 0,
    minute: 0,
    target: null
  },

  sDay: 0,
  sMth: 0,
  sYear: 0,

  lang: "en",

  months: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

  uid: null,
  db: null,

  getCurrentLanguage() {
    const lang = localStorage.getItem(this.LANGUAGE_STORAGE_KEY) || "en";
    return this.i18n[lang] ? lang : "en";
  },

  t(key) {
    const pack = this.i18n[this.lang] || this.i18n.en;
    return pack[key] || this.i18n.en[key] || key;
  },

  localizedMonths() {
    if (this.lang === "hi") {
      return ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
    }
    if (this.lang === "mr") {
      return ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
    }
    return this.months;
  },

  localizedDays() {
    if (this.lang === "hi") return ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
    if (this.lang === "mr") return ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"];
    return this.days;
  },

  localizedLocale() {
    if (this.lang === "hi") return "hi-IN";
    if (this.lang === "mr") return "mr-IN";
    return "en-US";
  },

  formatNumber(value) {
    const text = String(value);
    if (this.lang !== "hi" && this.lang !== "mr") return text;

    const devanagari = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return text.replace(/[0-9]/g, digit => devanagari[Number(digit)]);
  },

  normalizeDigits(text) {
    return String(text || "").replace(/[०-९]/g, digit => String("०१२३४५६७८९".indexOf(digit)));
  },

  parseLocalizedNumber(text, fallback) {
    const normalized = this.normalizeDigits(text).replace(/[^0-9-]/g, "").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  },

  normalizeTimeInput(text) {
    const normalized = this.normalizeDigits(text).replace(/[^0-9:]/g, "").trim();
    const match = normalized.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return "";

    const hh = Number(match[1]);
    const mm = Number(match[2]);
    if (!Number.isFinite(hh) || !Number.isFinite(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) return "";
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  },

  localizeTimeDisplay(text) {
    const normalized = this.normalizeTimeInput(text);
    return normalized ? this.formatNumber(normalized) : "";
  },

  applyLanguage() {
    const keys = [
      "calTitle", "cancelAllBtn", "simulateBtn", "calendarLabel", "historyLabel",
      "scheduleFormTitle", "dateLabel", "scheduleTypeLabel",
      "scheduleTypeSingle", "scheduleTypeMonth", "scheduleTypeWeekdays",
      "weekdaySunday", "weekdayMonday", "weekdayTuesday", "weekdayWednesday",
      "weekdayThursday", "weekdayFriday", "weekdaySaturday",
      "valveOnLabel", "valveOffLabel", "cancelBtn", "saveBtn", "deleteBtn",
      "historyTitle", "exportCsvBtn", "historyDateHead", "historyOnHead",
      "historyOffHead", "historySourceHead", "historyStatusHead",
      "historyCompletedHead", "historyDurationHead"
    ];

    keys.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = this.t(id);
    });

    this.hM.innerHTML = "";
    const monthLabels = this.localizedMonths();
    monthLabels.forEach((m, i) => {
      const o = document.createElement("option");
      o.value = i;
      o.text = m;
      if (i === this.sMth) o.selected = true;
      this.hM.appendChild(o);
    });

    this.draw();
    this.renderHistory();
  },

  sourceLabel(source) {
    if (source === "single") return this.t("sourceSingle");
    if (source === "monthly") return this.t("sourceMonthly");
    if (source === "weekly") return this.t("sourceWeekly");
    return source || "-";
  },

  statusLabel(status) {
    if (status === "completed") return this.t("statusCompleted");
    return status || "-";
  },

  init() {
    this.lang = this.getCurrentLanguage();

    // DOM
    this.hM = calMonth;
    this.hY = calYear;
    this.wrap = calWrap;
    this.form = calForm;
    this.fDate = evtDate;
    this.fOn = document.getElementById("event-start-time");
    this.fOff = document.getElementById("event-end-time");
    this.tpModal = document.getElementById("timePickerModal");
    this.tpReadout = document.getElementById("timePickerReadout");
    this.tpDial = document.getElementById("timePickerDial");
    this.tpHand = document.getElementById("timePickerHand");
    this.tpMarks = document.getElementById("timePickerMarks");
    this.tpHourBtn = document.getElementById("pickHourBtn");
    this.tpMinuteBtn = document.getElementById("pickMinuteBtn");

    this.hY.addEventListener("blur", () => {
      const parsedYear = this.parseLocalizedNumber(this.hY.value, this.sYear);
      this.hY.value = this.formatNumber(parsedYear);
    });

    [this.fOn, this.fOff].forEach(input => {
      if (!input) return;
      input.addEventListener("click", () => this.openTimePicker(input));
    });

    if (this.tpHourBtn) this.tpHourBtn.onclick = () => this.setTimePickerMode("hour");
    if (this.tpMinuteBtn) this.tpMinuteBtn.onclick = () => this.setTimePickerMode("minute");
    if (timePickerCancelBtn) timePickerCancelBtn.onclick = () => this.closeTimePicker(false);
    if (timePickerSetBtn) timePickerSetBtn.onclick = () => this.closeTimePicker(true);
    if (this.tpDial) this.tpDial.addEventListener("click", this.onTimeDialClick.bind(this));

    // Month init
    const now = new Date();
    this.sMth = now.getMonth();
    this.sYear = now.getFullYear();
    this.hY.value = this.formatNumber(this.sYear);

    this.localizedMonths().forEach((m, i) => {
      const o = document.createElement("option");
      o.value = i; o.text = m;
      if (i === this.sMth) o.selected = true;
      this.hM.appendChild(o);
    });

    // Controls
    calBack.onclick = () => this.shift(-1);
    calNext.onclick = () => this.shift(1);
    this.hM.onchange = this.draw.bind(this);
    this.hY.onchange = this.draw.bind(this);
    cancelBtn.onclick = () => this.form.close();

    scheduleType.onchange = () => weekdayOptions.classList.toggle(
      "hide", scheduleType.value !== "weekdays"
    );

    scheduleForm.onsubmit = this.save.bind(this);
    simulateBtn.onclick = this.simulateToday.bind(this);
    exportCsvBtn.onclick = this.exportCSV.bind(this);

    viewSwitch.onchange = () => {
      calendarView.classList.toggle("hide", viewSwitch.checked);
      historyView.classList.toggle("hide", !viewSwitch.checked);
    };

    document.addEventListener("language-changed", (e) => {
      this.lang = (e && e.detail && this.i18n[e.detail.lang]) ? e.detail.lang : this.getCurrentLanguage();
      this.applyLanguage();
    });

    // Firebase
    firebase.auth().onAuthStateChanged(user => {
      if (!user) return;
      this.uid = user.uid;
      this.db = firebase.database();

      this.db.ref(`user/${this.uid}/schedules`).on("value", s => {
        this.schedules = s.val() || {};
        this.draw();
        this.updateCancelBtn(); // REQUIRED
      });

      this.db.ref(`user/${this.uid}/executions`).on("value", s => {
        this.executions = s.val() || {};
        this.draw();
      });

      this.db.ref(`user/${this.uid}/executionHistory`).on("value", s => {
        this.history = s.val() || {};
        this.renderHistory();
      });

      this.draw();
    });

    cancelAllBtn.onclick = async () => {
      if (!confirm(this.t("confirmCancelAll"))) return;

      const base = `user/${this.uid}`;

      await Promise.all([
        this.db.ref(`${base}/schedules`).remove(),
        this.db.ref(`${base}/executions`).remove()
      ]);

      alert(this.t("allCancelled"));
    };

    this.applyLanguage();

  },

  shift(d) {
    let m = +this.hM.value + d;
    let y = this.parseLocalizedNumber(this.hY.value, this.sYear);
    if (m > 11) { m = 0; y++ }
    if (m < 0) { m = 11; y-- }
    this.hM.value = m; this.hY.value = this.formatNumber(y);
    this.draw();
  },

  draw() {
    this.sMth = +this.hM.value;
    this.sYear = this.parseLocalizedNumber(this.hY.value, this.sYear || new Date().getFullYear());
    this.hY.value = this.formatNumber(this.sYear);
    const days = new Date(this.sYear, this.sMth + 1, 0).getDate();
    const start = new Date(this.sYear, this.sMth, 1).getDay();

    const dayLabels = this.localizedDays();
    let html = `<div class="calHead">${dayLabels.map(d => `<div class="calCell">${d}</div>`).join("")}</div><div class="calBody"><div class="calRow">`;
    for (let i = 0; i < start; i++) html += `<div class="calCell calBlank"></div>`;

    for (let d = 1; d <= days; d++) {
      const key = `${this.sYear}-${String(this.sMth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      let badge = "", cls = "";
      if (this.executions[key]) { badge = `${this.t("runningBadge")}`; cls = "running"; }
      else if (this.schedules[key]) {
        badge = `${this.localizeTimeDisplay(this.schedules[key].on)}-${this.localizeTimeDisplay(this.schedules[key].off)}`;
        cls = "scheduled";
      }
      html += `<div class="calCell" onclick="cal.open(${d})"><div class="cellDate">${this.formatNumber(d)}</div>${badge ? `<div class="evt ${cls}">${badge}</div>` : ""}</div>`;
      if ((start + d) % 7 === 0) html += `</div><div class="calRow">`;
    }
    this.wrap.innerHTML = html + `</div></div>`;
  },

  open(day) {
    this.sDay = day;
    this.form.showModal();

    const pad = n => String(n).padStart(2, "0");
    const key = `${this.sYear}-${pad(this.sMth + 1)}-${pad(day)}`;

    const monthLabel = this.localizedMonths()[this.sMth] || this.months[this.sMth];
    evtDate.value = `${this.formatNumber(day)} ${monthLabel} ${this.formatNumber(this.sYear)}`;

    this.fOn.value = this.localizeTimeDisplay(this.schedules[key]?.on || "");
    this.fOff.value = this.localizeTimeDisplay(this.schedules[key]?.off || "");

    deleteBtn.classList.toggle("hide", !this.schedules[key]);

    deleteBtn.onclick = () => {
      if (confirm(this.t("confirmCancelDate"))) {
        this.db.ref(`user/${this.uid}/schedules/${key}`).remove();
        this.form.close();
      }
    };
  },

  save(e) {
    e.preventDefault();

    const type = scheduleType.value;
    const on = this.normalizeTimeInput(this.fOn.value);
    const off = this.normalizeTimeInput(this.fOff.value);

    if (!on || !off) {
      alert(this.t("selectOnOff"));
      return;
    }

    const updates = {};
    const year = this.sYear;
    const month = this.sMth;

    // helper
    const pad = n => String(n).padStart(2, "0");

    // 🔹 SINGLE DATE
    if (type === "single") {
      const key = `${year}-${pad(month + 1)}-${pad(this.sDay)}`;
      updates[`user/${this.uid}/schedules/${key}`] = {
        on, off, source: "single"
      };
    }

    // 🔹 ENTIRE MONTH
    if (type === "month") {
      const days = new Date(year, month + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const key = `${year}-${pad(month + 1)}-${pad(d)}`;
        updates[`user/${this.uid}/schedules/${key}`] = {
          on, off, source: "monthly"
        };
      }
    }

    // 🔹 WEEKDAYS
    if (type === "weekdays") {
      const selected = [...weekdayOptions.querySelectorAll("input:checked")]
        .map(i => Number(i.value));

      if (!selected.length) {
        alert(this.t("selectWeekdays"));
        return;
      }

      const days = new Date(year, month + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const dt = new Date(year, month, d);
        if (selected.includes(dt.getDay())) {
          const key = `${year}-${pad(month + 1)}-${pad(d)}`;
          updates[`user/${this.uid}/schedules/${key}`] = {
            on, off, source: "weekly"
          };
        }
      }
    }

    // 🔥 SINGLE ATOMIC WRITE
    this.db.ref().update(updates);

    this.form.close();
  },

  simulateToday() {
    const d = new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!this.schedules[key]) return alert(this.t("noScheduleToday"));
    this.db.ref(`user/${this.uid}/executionHistory/${key}`).set({
      ...this.schedules[key],
      status: "completed",
      completedAt: Date.now()
    });
    this.db.ref(`user/${this.uid}/schedules/${key}`).remove();
  },

  renderHistory() {
    historyBody.innerHTML = "";
    Object.entries(this.history).reverse().forEach(([k, v]) => {
      const source = this.sourceLabel(v.source);
      const status = this.statusLabel(v.status);
      historyBody.innerHTML += `
        <tr>
          <td>${this.formatNumber(k)}</td><td>${this.localizeTimeDisplay(v.on)}</td><td>${this.localizeTimeDisplay(v.off)}</td>
          <td>${source}</td><td>${status}</td>
          <td>${new Date(v.completedAt).toLocaleString(this.localizedLocale())}</td>
          <td>${this.calc(v.on, v.off)}</td>
        </tr>`;
    });
  },

  exportCSV() {
    let csv = `${this.t("historyDateHead")},${this.t("historyOnHead")},${this.t("historyOffHead")},${this.t("historySourceHead")},${this.t("historyCompletedHead")}\n`;
    Object.entries(this.history).forEach(([k, v]) => {
      csv += `${k},${v.on},${v.off},${this.sourceLabel(v.source)},${new Date(v.completedAt).toLocaleString(this.localizedLocale())}\n`;
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = this.t("csvFileName");
    a.click();
  },

  calc(on, off) {
    const [a, b] = on.split(":"), [c, d] = off.split(":");
    return (c * 60 + d) - (a * 60 + b) + ` ${this.t("durationMin")}`;
  },

  updateCancelBtn(){
  const btn = document.getElementById("cancelAllBtn");
  if(!btn) return;

  btn.disabled = Object.keys(this.schedules || {}).length === 0;
},

  openTimePicker(targetInput) {
    if (!this.tpModal || !targetInput) return;

    const parsed = this.normalizeTimeInput(targetInput.value) || "00:00";
    const [hh, mm] = parsed.split(":").map(Number);

    this.timePicker.target = targetInput;
    this.timePicker.hour = Number.isFinite(hh) ? hh : 0;
    this.timePicker.minute = Number.isFinite(mm) ? mm : 0;
    this.timePicker.open = true;

    this.setTimePickerMode("hour");
    if (typeof this.tpModal.showModal === "function") {
      this.tpModal.showModal();
    }
  },

  closeTimePicker(apply) {
    if (!this.tpModal) return;

    if (apply && this.timePicker.target) {
      const value = `${String(this.timePicker.hour).padStart(2, "0")}:${String(this.timePicker.minute).padStart(2, "0")}`;
      this.timePicker.target.value = this.localizeTimeDisplay(value);
    }

    if (typeof this.tpModal.close === "function") {
      this.tpModal.close();
    }
    this.timePicker.open = false;
    this.timePicker.target = null;
  },

  setTimePickerMode(mode) {
    this.timePicker.mode = mode === "minute" ? "minute" : "hour";
    if (this.tpHourBtn) this.tpHourBtn.classList.toggle("active", this.timePicker.mode === "hour");
    if (this.tpMinuteBtn) this.tpMinuteBtn.classList.toggle("active", this.timePicker.mode === "minute");
    this.renderTimePicker();
  },

  renderTimePicker() {
    if (!this.tpReadout || !this.tpMarks || !this.tpHand) return;

    const timeText = `${String(this.timePicker.hour).padStart(2, "0")}:${String(this.timePicker.minute).padStart(2, "0")}`;
    this.tpReadout.textContent = this.localizeTimeDisplay(timeText) || timeText;

    this.tpMarks.innerHTML = "";
    if (this.timePicker.mode === "hour") {
      for (let i = 0; i < 24; i += 1) {
        const angle = i * 15;
        const rad = ((angle - 90) * Math.PI) / 180;
        const r = 104;
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;

        const mark = document.createElement("div");
        mark.className = "time-picker-mark";
        mark.style.left = `calc(50% + ${x}px)`;
        mark.style.top = `calc(50% + ${y}px)`;
        mark.textContent = this.formatNumber(String(i).padStart(2, "0"));
        this.tpMarks.appendChild(mark);
      }

      const hourAngle = this.timePicker.hour * 15;
      this.tpHand.style.transform = `rotate(${hourAngle}deg)`;
    } else {
      for (let i = 0; i < 60; i += 5) {
        const angle = i * 6;
        const rad = ((angle - 90) * Math.PI) / 180;
        const r = 104;
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;

        const mark = document.createElement("div");
        mark.className = "time-picker-mark";
        mark.style.left = `calc(50% + ${x}px)`;
        mark.style.top = `calc(50% + ${y}px)`;
        mark.textContent = this.formatNumber(String(i).padStart(2, "0"));
        this.tpMarks.appendChild(mark);
      }

      const minuteAngle = this.timePicker.minute * 6;
      this.tpHand.style.transform = `rotate(${minuteAngle}deg)`;
    }
  },

  onTimeDialClick(event) {
    if (!this.tpDial) return;

    const rect = this.tpDial.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;

    if (this.timePicker.mode === "hour") {
      this.timePicker.hour = Math.round(deg / 15) % 24;
      this.renderTimePicker();
      return;
    }

    this.timePicker.minute = Math.round(deg / 6) % 60;
    this.renderTimePicker();
  },

};

document.addEventListener("DOMContentLoaded", () => cal.init());
