const copy = {
  ar: {
    archive: "ملف العرض الرقمي",
    eyebrow: "مسرحية",
    title: "قرية صالح",
    heroCopy: "ملف رقمي للعرض المسرحي",
    durationShort: "مدة العرض",
    permanentPage: "صفحة العرض",
    crewHeading: "كادر العمل",
    dramaturgyDirection: "دراماتورج وإخراج",
    mohammedZaki: "محمد زكي",
    directionTeam: "كادر الإخراج",
    directionNames: "محمد حمزة · أحمد كريم · محمد زكي",
    scenography: "سينوغرافيا",
    aliAdil: "علي عادل",
    cast: "تمثيل",
    castNames: "حسين العكيلي · فاطمة حيدر · أصيل عساف · عبدالله أحمد · ستيڤ أحمد",
    duration: "مدة العرض",
    durationValue: "ساعة ودقيقتان",
    production: "إنتاج",
    logoPlaceholder: "شعار المهرجان",
    identityHeading: "هوية رقمية للعرض",
    identityCopy: "هذا الرابط هو النسخة الدائمة لبطاقة العرض، ويمكن تحديث محتوى الصفحة لاحقاً من دون تغيير رمز QR المطبوع.",
    replay: "إعادة المقدمة",
    skip: "تخطي",
    introKicker: "ملف العرض",
    intro: [
      { role: "مسرحية", name: "قرية صالح", extra: "ملف العرض الرقمي" },
      { role: "دراماتورج وإخراج", name: "محمد زكي", extra: "" },
      { role: "كادر الإخراج", name: "محمد حمزة · أحمد كريم · محمد زكي", extra: "" },
      { role: "سينوغرافيا", name: "علي عادل", extra: "" },
      { role: "تمثيل", name: "حسين العكيلي · فاطمة حيدر · أصيل عساف · عبدالله أحمد · ستيڤ أحمد", extra: "" },
      { role: "مدة العرض", name: "ساعة ودقيقتان", extra: "01:02:00" },
      { role: "إنتاج", name: "المهرجان", extra: "يُضاف الشعار لاحقاً" }
    ]
  },
  en: {
    archive: "Digital Performance File",
    eyebrow: "Theatre Performance",
    title: "Qariyat Saleh",
    heroCopy: "Digital performance archive",
    durationShort: "Duration",
    permanentPage: "Permanent page",
    crewHeading: "Creative Team",
    dramaturgyDirection: "Dramaturgy & Direction",
    mohammedZaki: "Mohammed Zaki",
    directionTeam: "Direction Team",
    directionNames: "Mohammed Hamza · Ahmed Karim · Mohammed Zaki",
    scenography: "Scenography",
    aliAdil: "Ali Adil",
    cast: "Cast",
    castNames: "Hussein Al-Aqili · Fatima Haider · Aseel Assaf · Abdullah Ahmed · Steve Ahmed",
    duration: "Duration",
    durationValue: "1 hour 2 minutes",
    production: "Production",
    logoPlaceholder: "Festival Logo",
    identityHeading: "A Digital Identity for the Performance",
    identityCopy: "This URL is the permanent digital card for the performance. Its content can be updated later without changing the printed QR code.",
    replay: "Replay intro",
    skip: "Skip",
    introKicker: "Performance File",
    intro: [
      { role: "Theatre Performance", name: "Qariyat Saleh", extra: "Digital Performance File" },
      { role: "Dramaturgy & Direction", name: "Mohammed Zaki", extra: "" },
      { role: "Direction Team", name: "Mohammed Hamza · Ahmed Karim · Mohammed Zaki", extra: "" },
      { role: "Scenography", name: "Ali Adil", extra: "" },
      { role: "Cast", name: "Hussein Al-Aqili · Fatima Haider · Aseel Assaf · Abdullah Ahmed · Steve Ahmed", extra: "" },
      { role: "Duration", name: "1 hour 2 minutes", extra: "01:02:00" },
      { role: "Production", name: "Festival", extra: "Logo to be added" }
    ]
  }
};

const html = document.documentElement;
const main = document.getElementById("main");
const intro = document.getElementById("intro");
const introCard = document.getElementById("intro-card");
const introRole = document.getElementById("intro-role");
const introName = document.getElementById("intro-name");
const introExtra = document.getElementById("intro-extra");
const introKicker = document.getElementById("intro-kicker");
const introDots = document.getElementById("intro-dots");
const skipButton = document.getElementById("skip-intro");
const languageButton = document.getElementById("language-toggle");
const replayButton = document.getElementById("replay-intro");
const logo = document.getElementById("festival-logo");
const logoPlaceholder = document.getElementById("logo-placeholder");

let language = localStorage.getItem("qariyat-saleh-language") || "ar";
let introIndex = 0;
let introTimer = null;
let isIntroRunning = false;

function applyLanguage(lang) {
  language = lang;
  localStorage.setItem("qariyat-saleh-language", lang);

  const isArabic = lang === "ar";
  html.lang = lang;
  html.dir = isArabic ? "rtl" : "ltr";
  languageButton.textContent = isArabic ? "EN" : "ع";
  languageButton.setAttribute("aria-label", isArabic ? "Switch to English" : "التبديل إلى العربية");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (copy[lang][key]) el.textContent = copy[lang][key];
  });

  skipButton.textContent = copy[lang].skip;
  introKicker.textContent = copy[lang].introKicker;

  if (isIntroRunning) {
    renderIntroCard(introIndex, false);
  }
}

function buildDots() {
  introDots.innerHTML = "";
  copy[language].intro.forEach((_, i) => {
    const dot = document.createElement("i");
    if (i === introIndex) dot.classList.add("active");
    introDots.appendChild(dot);
  });
}

function renderIntroCard(index, animate = true) {
  const item = copy[language].intro[index];
  if (!item) return;

  const update = () => {
    introRole.textContent = item.role;
    introName.textContent = item.name;
    introExtra.textContent = item.extra || "";
    introExtra.hidden = !item.extra;
    buildDots();
    introCard.classList.remove("is-changing");
  };

  if (!animate) {
    update();
    return;
  }

  introCard.classList.add("is-changing");
  window.setTimeout(update, 380);
}

function scheduleNext() {
  clearTimeout(introTimer);
  introTimer = window.setTimeout(() => {
    if (introIndex >= copy[language].intro.length - 1) {
      finishIntro();
      return;
    }
    introIndex += 1;
    renderIntroCard(introIndex);
    scheduleNext();
  }, 2600);
}

function startIntro() {
  clearTimeout(introTimer);
  isIntroClosing = false;
  isIntroRunning = true;
  introIndex = 0;
  intro.classList.remove("is-leaving");
  intro.hidden = false;
  main.hidden = true;
  renderIntroCard(0, false);
  scheduleNext();
}

let isIntroClosing = false;

function finishIntro() {
  if (isIntroClosing || intro.hidden) return;

  clearTimeout(introTimer);
  isIntroRunning = false;
  isIntroClosing = true;
  intro.classList.add("is-leaving");

  window.setTimeout(() => {
    intro.hidden = true;
    intro.classList.remove("is-leaving");
    main.hidden = false;
    isIntroClosing = false;

    document.querySelectorAll(".credit-card").forEach((card) => {
      card.classList.remove("reveal");
      void card.offsetWidth;
      card.classList.add("reveal");
    });

    window.scrollTo({ top: 0, behavior: "instant" });
  }, 600);
}

function setupLogoFallback() {
  const showPlaceholder = () => {
    logo.hidden = true;
    logoPlaceholder.style.display = "block";
  };

  logo.addEventListener("error", showPlaceholder);
  logo.addEventListener("load", () => {
    logo.hidden = false;
    logoPlaceholder.style.display = "none";
  });

  if (logo.complete && logo.naturalWidth === 0) showPlaceholder();
}

languageButton.addEventListener("click", () => {
  applyLanguage(language === "ar" ? "en" : "ar");
});

skipButton.addEventListener("click", finishIntro);
replayButton.addEventListener("click", startIntro);

applyLanguage(language);
setupLogoFallback();
startIntro();
