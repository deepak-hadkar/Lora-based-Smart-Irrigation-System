(function () {
  var LANGUAGE_STORAGE_KEY = "smartagro_language";
  var menuToggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");
  var navLinks = document.querySelectorAll("#primary-nav a");
  var demoForm = document.querySelector(".demo-form");
  var yearNow = document.getElementById("yearNow");
  var langTabs = document.querySelectorAll(".lang-tab");
  var heroViewDashboardBtn = document.getElementById("heroViewDashboardBtn");
  var dashboardPreviewModal = document.getElementById("dashboardPreviewModal");
  var previewCloseBtn = document.getElementById("previewCloseBtn");

  var I18N = {
    en: {
      skipToContent: "Skip to main content",
      brandText: "SmartAgro",
      navOpen: "Open navigation",
      navClose: "Close navigation",
      navHome: "Home",
      navDashboard: "Dashboard",
      navFeatures: "Features",
      navDemo: "Request Demo",
      navLaunch: "Launch App",
      heroEyebrow: "Smart irrigation made practical",
      heroTitle: "Control field irrigation from one intelligent IoT dashboard.",
      heroLead: "Track soil moisture, valve activity, and trend analytics in real time. Reduce water waste, prevent over-irrigation, and scale to multi-zone farms.",
      heroBookDemo: "Book a Demo",
      heroViewDashboard: "Dashboard Demo",
      heroTechShowcase: "Technology Highlights",
      previewModalTitle: "Live Dashboard Quick Insight",
      previewModalSub: "This demo gives you an idea of how the real dashboard and calendar interface will look.",
      previewDashFrameTitle: "Dashboard",
      previewLiveTag: "Live",
      previewCardMoisture: "Moisture",
      previewCardHumidity: "Humidity",
      previewCardValve: "Valve",
      previewCardFlow: "Flow",
      previewCalFrameTitle: "Calendar",
      previewMonthLabel: "June 2026",
      previewLegendScheduled: "Scheduled",
      previewLegendRunning: "Running",
      techShowcaseEyebrow: "Technology Stack",
      techShowcaseTitle: "Core technologies powering the SmartAgro platform",
      techShowcaseDesc: "A quick visual breakdown of the hardware and software capabilities used in the real deployment.",
      techHighlighter: "Highlighted Tech",
      techSolar: "Solar inbuilt power support",
      techLora: "LoRa-based communication",
      techFirebase: "Real-time Firebase integration",
      techExcel: "Excel data logging for future analytics",
      techScheduler: "Pre-planned scheduler for timings",
      techCustomDashboard: "Custom dashboard controls",
      techRegional: "Hindi and Marathi compatible interface",
      previewDashTitle: "Dashboard Functions",
      previewDashPoint1: "Track live sensor cards for moisture, humidity, flow, and valve status.",
      previewDashPoint2: "Run manual valve actions and adjust key thresholds quickly.",
      previewDashPoint3: "Customize card visibility and layout for each device.",
      previewCalTitle: "Calendar Functions",
      previewCalPoint1: "Schedule one-time, monthly, or weekday irrigation plans.",
      previewCalPoint2: "Review run history with source, status, completion, and duration.",
      previewCalPoint3: "Export irrigation history to CSV for field reporting.",
      previewCloseBtn: "Close",
      metricWater: "Average water savings",
      metricMonitoring: "Remote monitoring",
      metricEvents: "Daily sensor events",
      statusLive: "Live telemetry online",
      farmNodeOverview: "Farm Node Overview",
      heroPanelAria: "Dashboard summary card",
      statMoistureTitle: "Moisture",
      statZoneA: "Zone A",
      statValveTitle: "Valve",
      statValveOn: "ON",
      statAutoMode: "Auto mode",
      statFlowRateTitle: "Flow Rate",
      statPipeline2: "Pipeline 2",
      statAlertStateTitle: "Alert State",
      statNormal: "Normal",
      statNoCritical: "No critical events",
      previewEyebrow: "Device dashboard preview",
      previewTitle: "Card-based monitoring built for daily farm operations",
      previewDesc: "Every card is optimized for quick checks: sensor values, thresholds, schedules, and actuator controls, all in one responsive layout.",
      controlCardAria: "Irrigation control card",
      controlCardTitle: "Irrigation Control",
      controlHealthy: "Healthy",
      controlCurrentState: "Current state",
      controlValveOn: "Valve ON",
      controlNextSchedule: "Next schedule",
      controlThreshold: "Threshold",
      controlStartManual: "Start Manual Run",
      controlEditRules: "Edit Rules",
      sensorTrendAria: "Sensor trend card",
      sensorTrendTitle: "Sensor Trend",
      miniChartAria: "Illustrative trend chart",
      sensorTrendDesc: "10 sampled readings per day with smooth trend comparison.",
      alertFeedAria: "Alert feed card",
      alertFeedTitle: "Alert Feed",
      alert1: "Moisture dipped below threshold in Zone B.",
      alert2: "Valve command acknowledged by node.",
      alert3: "Flow rate stabilized within normal range.",
      featuresEyebrow: "Core capabilities",
      featuresTitle: "Designed for field reliability, not just dashboards",
      feature1Title: "Live Sensor Telemetry",
      feature1Desc: "Monitor moisture, humidity, temperature, pressure, and flow in real time from mobile or desktop.",
      feature2Title: "Smart Automation Rules",
      feature2Desc: "Configure threshold-based automation, weekly schedules, and override commands for precision watering.",
      feature3Title: "Analytics and History",
      feature3Desc: "Visualize trends, compare zones, and export historical data for agronomy and operations reporting.",
      feature4Title: "Role-aware Access",
      feature4Desc: "Separate operator and admin workflows to protect critical settings while enabling safe day-to-day usage.",
      feature5Title: "Scalable Device Layout",
      feature5Desc: "Add new nodes and card widgets without redesigning the interface or retraining your team.",
      feature6Title: "Cloud + Edge Ready",
      feature6Desc: "Synchronize local node activity with cloud dashboards for continuity in mixed-connectivity environments.",
      demoEyebrow: "Request a demo",
      demoTitle: "See SmartAgro on your field data",
      demoDesc: "Share your setup and irrigation goals. Our team will prepare a guided product walkthrough aligned to your zones and sensor strategy.",
      demoPoint1: "Personalized deployment guidance",
      demoPoint2: "Dashboard setup and automation templates",
      demoPoint3: "ROI and water-saving baseline review",
      formName: "Full name",
      formEmail: "Work email",
      formPhone: "Phone",
      formFarmSize: "Farm size (acres)",
      formMessage: "What would you like to automate?",
      formSubmit: "Request Demo",
      formInvalid: "Please complete all required fields before submitting.",
      formSuccess: "Request sent. Our team will contact you shortly.",
      footerTagline: "Modern irrigation intelligence for data-driven farms.",
      footerQuickLinks: "Quick links",
      footerDashboard: "Dashboard",
      footerAnalytics: "Analytics",
      footerScheduler: "Scheduler",
      footerContact: "Contact",
      footerSignIn: "Sign in",
      footerCreateAccount: "Create account",
      copyrightText: "SmartAgro. All rights reserved."
    },
    hi: {
      skipToContent: "मुख्य सामग्री पर जाएं",
      brandText: "स्मार्टएग्रो",
      navOpen: "नेविगेशन खोलें",
      navClose: "नेविगेशन बंद करें",
      navHome: "होम",
      navDashboard: "डैशबोर्ड",
      navFeatures: "फीचर्स",
      navDemo: "डेमो अनुरोध",
      navLaunch: "ऐप खोलें",
      heroEyebrow: "स्मार्ट सिंचाई अब आसान",
      heroTitle: "एक स्मार्ट IoT डैशबोर्ड से पूरे खेत की सिंचाई नियंत्रित करें।",
      heroLead: "मिट्टी की नमी, वाल्व गतिविधि और ट्रेंड एनालिटिक्स को रियल टाइम में देखें। पानी की बर्बादी कम करें और मल्टी-ज़ोन फार्म तक स्केल करें।",
      heroBookDemo: "डेमो बुक करें",
      heroViewDashboard: "डैशबोर्ड डेमो",
      heroTechShowcase: "टेक्नोलॉजी हाइलाइट्स",
      previewModalTitle: "लाइव डैशबोर्ड त्वरित जानकारी",
      previewModalSub: "यह डेमो दिखाता है कि असली डैशबोर्ड और कैलेंडर इंटरफेस कैसा दिखेगा।",
      previewDashFrameTitle: "डैशबोर्ड",
      previewLiveTag: "लाइव",
      previewCardMoisture: "नमी",
      previewCardHumidity: "आर्द्रता",
      previewCardValve: "वाल्व",
      previewCardFlow: "प्रवाह",
      previewCalFrameTitle: "कैलेंडर",
      previewMonthLabel: "जून 2026",
      previewLegendScheduled: "निर्धारित",
      previewLegendRunning: "चालू",
      techShowcaseEyebrow: "टेक्नोलॉजी स्टैक",
      techShowcaseTitle: "SmartAgro प्लेटफ़ॉर्म को चलाने वाली मुख्य तकनीकें",
      techShowcaseDesc: "रियल डिप्लॉयमेंट में उपयोग किए गए हार्डवेयर और सॉफ्टवेयर का त्वरित विज़ुअल अवलोकन।",
      techHighlighter: "हाइलाइटेड टेक",
      techSolar: "सोलर इनबिल्ट पावर सपोर्ट",
      techLora: "LoRa आधारित संचार",
      techFirebase: "रियल-टाइम Firebase इंटीग्रेशन",
      techExcel: "भविष्य एनालिटिक्स के लिए Excel डेटा लॉगिंग",
      techScheduler: "समय के लिए प्री-प्लान्ड शेड्यूलर",
      techCustomDashboard: "कस्टम डैशबोर्ड कंट्रोल",
      techRegional: "हिंदी और मराठी संगत इंटरफेस",
      previewDashTitle: "डैशबोर्ड फंक्शन",
      previewDashPoint1: "नमी, आर्द्रता, प्रवाह और वाल्व स्थिति के लाइव सेंसर कार्ड देखें।",
      previewDashPoint2: "मैन्युअल वाल्व एक्शन चलाएं और थ्रेशोल्ड तुरंत बदलें।",
      previewDashPoint3: "हर डिवाइस के लिए कार्ड दृश्यता और लेआउट कस्टमाइज़ करें।",
      previewCalTitle: "कैलेंडर फंक्शन",
      previewCalPoint1: "एकल, मासिक या सप्ताह के दिनों के सिंचाई शेड्यूल बनाएं।",
      previewCalPoint2: "इतिहास में स्रोत, स्थिति, पूर्णता और अवधि देखें।",
      previewCalPoint3: "फील्ड रिपोर्टिंग के लिए सिंचाई इतिहास CSV में निर्यात करें।",
      previewCloseBtn: "बंद करें",
      metricWater: "औसत पानी बचत",
      metricMonitoring: "रिमोट मॉनिटरिंग",
      metricEvents: "दैनिक सेंसर इवेंट्स",
      statusLive: "लाइव टेलीमेट्री ऑनलाइन",
      farmNodeOverview: "फार्म नोड अवलोकन",
      heroPanelAria: "डैशबोर्ड सारांश कार्ड",
      statMoistureTitle: "नमी",
      statZoneA: "ज़ोन A",
      statValveTitle: "वाल्व",
      statValveOn: "चालू",
      statAutoMode: "ऑटो मोड",
      statFlowRateTitle: "प्रवाह दर",
      statPipeline2: "पाइपलाइन 2",
      statAlertStateTitle: "अलर्ट स्थिति",
      statNormal: "सामान्य",
      statNoCritical: "कोई गंभीर घटना नहीं",
      previewEyebrow: "डिवाइस डैशबोर्ड प्रीव्यू",
      previewTitle: "रोज़ाना फार्म संचालन के लिए कार्ड-आधारित मॉनिटरिंग",
      previewDesc: "हर कार्ड त्वरित जांच के लिए ऑप्टिमाइज़ है: सेंसर वैल्यू, थ्रेशोल्ड, शेड्यूल और कंट्रोल।",
      controlCardAria: "सिंचाई नियंत्रण कार्ड",
      controlCardTitle: "सिंचाई नियंत्रण",
      controlHealthy: "स्वस्थ",
      controlCurrentState: "वर्तमान स्थिति",
      controlValveOn: "वाल्व चालू",
      controlNextSchedule: "अगला शेड्यूल",
      controlThreshold: "थ्रेशोल्ड",
      controlStartManual: "मैन्युअल रन शुरू करें",
      controlEditRules: "नियम संपादित करें",
      sensorTrendAria: "सेंसर ट्रेंड कार्ड",
      sensorTrendTitle: "सेंसर ट्रेंड",
      miniChartAria: "उदाहरण ट्रेंड चार्ट",
      sensorTrendDesc: "प्रति दिन 10 नमूना रीडिंग के साथ स्मूथ ट्रेंड तुलना।",
      alertFeedAria: "अलर्ट फीड कार्ड",
      alertFeedTitle: "अलर्ट फीड",
      alert1: "ज़ोन B में नमी थ्रेशोल्ड से नीचे गई।",
      alert2: "वाल्व कमांड को नोड ने स्वीकार किया।",
      alert3: "प्रवाह दर सामान्य सीमा में स्थिर हुई।",
      featuresEyebrow: "मुख्य क्षमताएं",
      featuresTitle: "सिर्फ डैशबोर्ड नहीं, फील्ड विश्वसनीयता के लिए डिज़ाइन",
      feature1Title: "लाइव सेंसर टेलीमेट्री",
      feature1Desc: "मोबाइल या डेस्कटॉप से नमी, आर्द्रता, तापमान, दबाव और प्रवाह को रियल टाइम में मॉनिटर करें।",
      feature2Title: "स्मार्ट ऑटोमेशन नियम",
      feature2Desc: "सटीक सिंचाई के लिए थ्रेशोल्ड-आधारित ऑटोमेशन, साप्ताहिक शेड्यूल और ओवरराइड कमांड सेट करें।",
      feature3Title: "एनालिटिक्स और हिस्ट्री",
      feature3Desc: "ट्रेंड देखें, ज़ोन की तुलना करें और रिपोर्टिंग के लिए ऐतिहासिक डेटा एक्सपोर्ट करें।",
      feature4Title: "भूमिका-आधारित एक्सेस",
      feature4Desc: "महत्वपूर्ण सेटिंग सुरक्षित रखते हुए ऑपरेटर और एडमिन वर्कफ़्लो अलग करें।",
      feature5Title: "स्केलेबल डिवाइस लेआउट",
      feature5Desc: "इंटरफ़ेस बदले बिना नए नोड और कार्ड विजेट जोड़ें।",
      feature6Title: "क्लाउड + एज रेडी",
      feature6Desc: "मिक्स्ड कनेक्टिविटी में निरंतरता के लिए लोकल नोड गतिविधि को क्लाउड डैशबोर्ड से सिंक करें।",
      demoEyebrow: "डेमो अनुरोध",
      demoTitle: "अपने खेत के डेटा पर SmartAgro देखें",
      demoDesc: "अपना सेटअप और सिंचाई लक्ष्य साझा करें। हमारी टीम आपके लिए उपयुक्त डेमो तैयार करेगी।",
      demoPoint1: "व्यक्तिगत डिप्लॉयमेंट मार्गदर्शन",
      demoPoint2: "डैशबोर्ड सेटअप और ऑटोमेशन टेम्पलेट्स",
      demoPoint3: "ROI और पानी बचत बेसलाइन समीक्षा",
      formName: "पूरा नाम",
      formEmail: "कार्य ईमेल",
      formPhone: "फोन",
      formFarmSize: "फार्म आकार (एकड़)",
      formMessage: "आप क्या ऑटोमेट करना चाहते हैं?",
      formSubmit: "डेमो अनुरोध भेजें",
      formInvalid: "कृपया भेजने से पहले सभी आवश्यक फ़ील्ड भरें।",
      formSuccess: "अनुरोध भेजा गया। हमारी टीम शीघ्र ही संपर्क करेगी।",
      footerTagline: "डेटा-आधारित फार्म के लिए आधुनिक सिंचाई इंटेलिजेंस।",
      footerQuickLinks: "त्वरित लिंक",
      footerDashboard: "डैशबोर्ड",
      footerAnalytics: "एनालिटिक्स",
      footerScheduler: "शेड्यूलर",
      footerContact: "संपर्क",
      footerSignIn: "साइन इन",
      footerCreateAccount: "खाता बनाएं",
      copyrightText: "स्मार्टएग्रो। सर्वाधिकार सुरक्षित।"
    },
    mr: {
      skipToContent: "मुख्य मजकुराकडे जा",
      brandText: "स्मार्टअ‍ॅग्रो",
      navOpen: "नेव्हिगेशन उघडा",
      navClose: "नेव्हिगेशन बंद करा",
      navHome: "मुख्यपृष्ठ",
      navDashboard: "डॅशबोर्ड",
      navFeatures: "फीचर्स",
      navDemo: "डेमो विनंती",
      navLaunch: "ॲप सुरू करा",
      heroEyebrow: "स्मार्ट सिंचन आता सोपे",
      heroTitle: "एकाच स्मार्ट IoT डॅशबोर्डमधून शेतातील सिंचन नियंत्रित करा.",
      heroLead: "मातीतील आर्द्रता, वाल्व स्थिती आणि ट्रेंड अॅनालिटिक्स रिअल टाइममध्ये पहा. पाण्याची बचत करा आणि मल्टी-झोन फार्मपर्यंत विस्तार करा.",
      heroBookDemo: "डेमो बुक करा",
      heroViewDashboard: "डॅशबोर्ड डेमो",
      heroTechShowcase: "टेक्नॉलॉजी हायलाइट्स",
      previewModalTitle: "लाइव्ह डॅशबोर्ड झटपट माहिती",
      previewModalSub: "हा डेमो खरा डॅशबोर्ड आणि कॅलेंडर इंटरफेस कसा दिसेल याची कल्पना देतो.",
      previewDashFrameTitle: "डॅशबोर्ड",
      previewLiveTag: "लाइव्ह",
      previewCardMoisture: "आर्द्रता",
      previewCardHumidity: "ह्युमिडिटी",
      previewCardValve: "वाल्व",
      previewCardFlow: "प्रवाह",
      previewCalFrameTitle: "कॅलेंडर",
      previewMonthLabel: "जून 2026",
      previewLegendScheduled: "शेड्युल्ड",
      previewLegendRunning: "चालू",
      techShowcaseEyebrow: "टेक्नॉलॉजी स्टॅक",
      techShowcaseTitle: "SmartAgro प्लॅटफॉर्म चालवणाऱ्या मुख्य तंत्रज्ञानांचा आढावा",
      techShowcaseDesc: "प्रत्यक्ष तैनातीमध्ये वापरलेल्या हार्डवेअर आणि सॉफ्टवेअर क्षमतांचा जलद व्हिज्युअल आढावा.",
      techHighlighter: "हायलाइटेड टेक",
      techSolar: "सोलर इनबिल्ट पॉवर सपोर्ट",
      techLora: "LoRa आधारित कम्युनिकेशन",
      techFirebase: "रिअल-टाइम Firebase इंटिग्रेशन",
      techExcel: "भविष्यातील अॅनालिटिक्ससाठी Excel डेटा लॉगिंग",
      techScheduler: "टायमिंगसाठी प्री-प्लॅन्ड शेड्युलर",
      techCustomDashboard: "कस्टम डॅशबोर्ड कंट्रोल्स",
      techRegional: "हिंदी आणि मराठी सुसंगत इंटरफेस",
      previewDashTitle: "डॅशबोर्ड फंक्शन्स",
      previewDashPoint1: "आर्द्रता, तापमान, प्रवाह आणि वाल्व स्थितीचे लाइव्ह कार्ड पहा.",
      previewDashPoint2: "मॅन्युअल वाल्व अॅक्शन चालवा आणि थ्रेशोल्ड लगेच बदला.",
      previewDashPoint3: "प्रत्येक डिव्हाइससाठी कार्ड दृश्यता आणि लेआउट सानुकूलित करा.",
      previewCalTitle: "कॅलेंडर फंक्शन्स",
      previewCalPoint1: "एकदाचा, मासिक किंवा आठवड्याच्या दिवसांनुसार सिंचन शेड्यूल करा.",
      previewCalPoint2: "स्रोत, स्थिती, पूर्णता आणि कालावधीसह इतिहास पहा.",
      previewCalPoint3: "फील्ड रिपोर्टिंगसाठी सिंचन इतिहास CSV मध्ये निर्यात करा.",
      previewCloseBtn: "बंद करा",
      metricWater: "सरासरी पाणी बचत",
      metricMonitoring: "रिमोट मॉनिटरिंग",
      metricEvents: "दैनंदिन सेन्सर इव्हेंट्स",
      statusLive: "लाइव्ह टेलिमेट्री ऑनलाइन",
      farmNodeOverview: "फार्म नोड आढावा",
      heroPanelAria: "डॅशबोर्ड सारांश कार्ड",
      statMoistureTitle: "आर्द्रता",
      statZoneA: "झोन A",
      statValveTitle: "वाल्व",
      statValveOn: "चालू",
      statAutoMode: "ऑटो मोड",
      statFlowRateTitle: "प्रवाह दर",
      statPipeline2: "पाइपलाइन 2",
      statAlertStateTitle: "अलर्ट स्थिती",
      statNormal: "सामान्य",
      statNoCritical: "गंभीर घटना नाहीत",
      previewEyebrow: "डिव्हाइस डॅशबोर्ड प्रीव्यू",
      previewTitle: "दैनंदिन शेत व्यवस्थापनासाठी कार्ड-आधारित मॉनिटरिंग",
      previewDesc: "प्रत्येक कार्ड झटपट तपासणीसाठी तयार: सेन्सर मूल्ये, थ्रेशोल्ड, शेड्यूल आणि कंट्रोल.",
      controlCardAria: "सिंचन नियंत्रण कार्ड",
      controlCardTitle: "सिंचन नियंत्रण",
      controlHealthy: "सुरळीत",
      controlCurrentState: "सध्याची स्थिती",
      controlValveOn: "वाल्व चालू",
      controlNextSchedule: "पुढील शेड्यूल",
      controlThreshold: "थ्रेशोल्ड",
      controlStartManual: "मॅन्युअल रन सुरू करा",
      controlEditRules: "नियम संपादा",
      sensorTrendAria: "सेन्सर ट्रेंड कार्ड",
      sensorTrendTitle: "सेन्सर ट्रेंड",
      miniChartAria: "दर्शनी ट्रेंड चार्ट",
      sensorTrendDesc: "दररोज 10 नमुना वाचनांसह गुळगुळीत ट्रेंड तुलना.",
      alertFeedAria: "अलर्ट फीड कार्ड",
      alertFeedTitle: "अलर्ट फीड",
      alert1: "झोन B मध्ये आर्द्रता थ्रेशोल्डखाली गेली.",
      alert2: "वाल्व कमांड नोडने स्वीकारली.",
      alert3: "प्रवाह दर सामान्य श्रेणीत स्थिर झाला.",
      featuresEyebrow: "मुख्य क्षमता",
      featuresTitle: "फक्त डॅशबोर्ड नव्हे, तर फील्ड विश्वसनीयतेसाठी डिझाइन",
      feature1Title: "लाइव्ह सेन्सर टेलिमेट्री",
      feature1Desc: "मोबाइल किंवा डेस्कटॉपवरून आर्द्रता, तापमान, दाब आणि प्रवाह रिअल टाइममध्ये मॉनिटर करा.",
      feature2Title: "स्मार्ट ऑटोमेशन नियम",
      feature2Desc: "अचूक सिंचनासाठी थ्रेशोल्ड-आधारित ऑटोमेशन, साप्ताहिक शेड्यूल आणि ओव्हरराइड कमांड सेट करा.",
      feature3Title: "अॅनालिटिक्स आणि इतिहास",
      feature3Desc: "ट्रेंड पाहा, झोन तुलना करा आणि अहवालांसाठी इतिहास डेटा एक्सपोर्ट करा.",
      feature4Title: "भूमिका-आधारित प्रवेश",
      feature4Desc: "महत्त्वाच्या सेटिंग्ज सुरक्षित ठेवून ऑपरेटर व अॅडमिन कार्यप्रवाह वेगळे करा.",
      feature5Title: "स्केलेबल डिव्हाइस लेआउट",
      feature5Desc: "इंटरफेस न बदलता नवीन नोड्स आणि कार्ड विजेट्स जोडा.",
      feature6Title: "क्लाउड + एज तयार",
      feature6Desc: "मिक्स कनेक्टिव्हिटीमध्ये सातत्यासाठी लोकल नोड अ‍ॅक्टिव्हिटी क्लाउड डॅशबोर्डशी सिंक करा.",
      demoEyebrow: "डेमो विनंती",
      demoTitle: "तुमच्या शेताच्या डेटावर SmartAgro पाहा",
      demoDesc: "तुमची व्यवस्था आणि सिंचन उद्दिष्टे सांगा. आमची टीम तुमच्यासाठी योग्य डेमो तयार करेल.",
      demoPoint1: "वैयक्तिक डिप्लॉयमेंट मार्गदर्शन",
      demoPoint2: "डॅशबोर्ड सेटअप आणि ऑटोमेशन टेम्पलेट्स",
      demoPoint3: "ROI आणि पाणी बचत बेसलाइन पुनरावलोकन",
      formName: "पूर्ण नाव",
      formEmail: "कार्य ईमेल",
      formPhone: "फोन",
      formFarmSize: "शेताचा आकार (एकर)",
      formMessage: "तुम्हाला काय ऑटोमेट करायचे आहे?",
      formSubmit: "डेमो विनंती पाठवा",
      formInvalid: "कृपया पाठवण्यापूर्वी सर्व आवश्यक फील्ड भरा.",
      formSuccess: "विनंती पाठवली. आमची टीम लवकरच संपर्क करेल.",
      footerTagline: "डेटा-आधारित शेतीसाठी आधुनिक सिंचन बुद्धिमत्ता.",
      footerQuickLinks: "द्रुत दुवे",
      footerDashboard: "डॅशबोर्ड",
      footerAnalytics: "अॅनालिटिक्स",
      footerScheduler: "शेड्युलर",
      footerContact: "संपर्क",
      footerSignIn: "साइन इन",
      footerCreateAccount: "खाते तयार करा",
      copyrightText: "स्मार्टअ‍ॅग्रो. सर्व हक्क राखीव."
    }
  };

  function getCurrentLanguage() {
    var lang = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
    return I18N[lang] ? lang : "en";
  }

  function translatePage(lang) {
    var pack = I18N[lang] || I18N.en;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = pack[key] || I18N.en[key] || el.textContent;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      if (!key) return;
      el.setAttribute("aria-label", pack[key] || I18N.en[key] || el.getAttribute("aria-label") || "");
    });

    langTabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-lang") === lang;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    document.documentElement.lang = lang;

    if (menuToggle && nav) {
      var isOpen = nav.classList.contains("open");
      menuToggle.setAttribute("aria-label", isOpen ? (pack.navClose || I18N.en.navClose) : (pack.navOpen || I18N.en.navOpen));
    }

    document.dispatchEvent(new CustomEvent("language-changed", {
      detail: { lang: lang }
    }));
  }

  function setLanguage(lang) {
    if (!I18N[lang]) return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    translatePage(lang);
  }

  if (yearNow) {
    yearNow.textContent = new Date().getFullYear();
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      var pack = I18N[getCurrentLanguage()] || I18N.en;
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? (pack.navClose || I18N.en.navClose) : (pack.navOpen || I18N.en.navOpen));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        var pack = I18N[getCurrentLanguage()] || I18N.en;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", pack.navOpen || I18N.en.navOpen);
      });
    });
  }

  if (demoForm) {
    demoForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var statusEl = demoForm.querySelector(".form-status");
      var fullName = document.getElementById("fullName");
      var email = document.getElementById("email");
      var message = document.getElementById("message");

      if (!fullName || !email || !message || !statusEl) return;

      var isValid = demoForm.checkValidity();
      var activeLang = getCurrentLanguage();
      var pack = I18N[activeLang] || I18N.en;
      if (!isValid) {
        statusEl.textContent = pack.formInvalid || I18N.en.formInvalid;
        statusEl.style.color = "#a63a2f";
        demoForm.reportValidity();
        return;
      }

      statusEl.textContent = pack.formSuccess || I18N.en.formSuccess;
      statusEl.style.color = "#0b8f66";
      demoForm.reset();
    });
  }

  if (langTabs.length) {
    langTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        setLanguage(tab.getAttribute("data-lang"));
      });
    });
  }

  if (heroViewDashboardBtn && dashboardPreviewModal) {
    heroViewDashboardBtn.addEventListener("click", function (event) {
      event.preventDefault();
      dashboardPreviewModal.classList.remove("hide");
      document.body.style.overflow = "hidden";
    });
  }

  function closeDashboardPreview() {
    if (!dashboardPreviewModal) return;
    dashboardPreviewModal.classList.add("hide");
    document.body.style.overflow = "";
  }

  if (previewCloseBtn) {
    previewCloseBtn.addEventListener("click", closeDashboardPreview);
  }

  if (dashboardPreviewModal) {
    dashboardPreviewModal.addEventListener("click", function (event) {
      if (event.target === dashboardPreviewModal) closeDashboardPreview();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeDashboardPreview();
  });

  translatePage(getCurrentLanguage());
})();
