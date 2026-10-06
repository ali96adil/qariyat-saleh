const copy = {
  ar: {
    archive: "ملف العرض",
    eyebrow: "مسرحية",
    title: "قرية صالح",
    durationShort: "مدة العرض",
    viewPoster: "عرض البوستر",
    crewHeading: "كادر العمل",
    dramaturgyDirection: "دراماتورج وإخراج",
    mohammedZaki: "محمد زكي",
    directionTeam: "كادر الإخراج",
    directionNames: "محمد حمزة\nأحمد كريم\nمحمد زكي",
    scenography: "سينوغرافيا",
    aliAdil: "علي عادل",
    cast: "تمثيل",
    castNames: "حسين العكيلي\nفاطمة حيدر\nأصيل عساف\nعبدالله أحمد\nستيڤ أحمد",
    duration: "مدة العرض",
    durationValue: "ساعة ودقيقتان",
    production: "إنتاج",
    logoPlaceholder: "شعار المهرجان",
    festivalName: "مهرجان بابل للثقافات العالمية",
    replay: "إعادة المقدمة",
    skip: "تخطي",
    introKicker: "ملف العرض",
    intro: [
      { role: "مسرحية", name: "قرية صالح", extra: "البرنامج الرسمي للعرض", group: "title" },
      { role: "دراماتورج وإخراج", name: "محمد زكي", extra: "", group: "direction" },
      { role: "كادر الإخراج", name: "محمد حمزة\nأحمد كريم\nمحمد زكي", extra: "فريق الإخراج", group: "direction" },
      { role: "سينوغرافيا", name: "علي عادل", extra: "", group: "scenography" },
      { role: "تمثيل", name: "حسين العكيلي\nفاطمة حيدر\nأصيل عساف\nعبدالله أحمد\nستيڤ أحمد", extra: "الممثلون", group: "cast" },
      { role: "مدة العرض", name: "ساعة ودقيقتان", extra: "01:02:00", group: "meta" },
      { role: "إنتاج", name: "", extra: "", group: "production", showLogo: true }
    ]
  },
  en: {
    archive: "Performance Program",
    eyebrow: "Theatre Performance",
    title: "Qariyat Saleh",
    durationShort: "Duration",
    viewPoster: "View Poster",
    crewHeading: "Creative Team",
    dramaturgyDirection: "Dramaturgy & Direction",
    mohammedZaki: "Mohammed Zaki",
    directionTeam: "Direction Team",
    directionNames: "Mohammed Hamza\nAhmed Karim\nMohammed Zaki",
    scenography: "Scenography",
    aliAdil: "Ali Adil",
    cast: "Cast",
    castNames: "Hussein Al-Aqili\nFatima Haider\nAseel Assaf\nAbdullah Ahmed\nSteve Ahmed",
    duration: "Duration",
    durationValue: "1 hour 2 minutes",
    production: "Production",
    logoPlaceholder: "Festival Logo",
    festivalName: "Babylon Festival for World Cultures",
    replay: "Replay intro",
    skip: "Skip",
    introKicker: "Performance File",
    intro: [
      { role: "Theatre Performance", name: "Qariyat Saleh", extra: "Official performance program", group: "title" },
      { role: "Dramaturgy & Direction", name: "Mohammed Zaki", extra: "", group: "direction" },
      { role: "Direction Team", name: "Mohammed Hamza\nAhmed Karim\nMohammed Zaki", extra: "Direction Team", group: "direction" },
      { role: "Scenography", name: "Ali Adil", extra: "", group: "scenography" },
      { role: "Cast", name: "Hussein Al-Aqili\nFatima Haider\nAseel Assaf\nAbdullah Ahmed\nSteve Ahmed", extra: "Cast", group: "cast" },
      { role: "Duration", name: "1 hour 2 minutes", extra: "01:02:00", group: "meta" },
      { role: "Production", name: "", extra: "", group: "production", showLogo: true }
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
const introLogoWrap = document.getElementById("intro-logo-wrap");
const introLogo = document.getElementById("intro-logo");
const introKicker = document.getElementById("intro-kicker");
const introDots = document.getElementById("intro-dots");
const skipButton = document.getElementById("skip-intro");
const languageButton = document.getElementById("language-toggle");
const replayButton = document.getElementById("replay-intro");
const logo = document.getElementById("festival-logo");
const logoPlaceholder = document.getElementById("logo-placeholder");
const posterButton = document.getElementById("poster-button");
const posterModal = document.getElementById("poster-modal");
const posterClose = document.getElementById("poster-close");
const posterImage = document.getElementById("poster-image");

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
    introCard.dataset.group = item.group || "default";
    introRole.textContent = item.role;
    introName.textContent = item.name || "";
    introName.hidden = !!item.showLogo;
    introLogoWrap.hidden = !item.showLogo;
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

introLogo.addEventListener("error", () => {
  introLogoWrap.hidden = true;
  introName.hidden = false;
  introName.textContent = language === "ar" ? "المهرجان" : "Festival";
});

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


function closePoster() {
  posterModal.hidden = true;
  posterModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("poster-open");
}

function openPoster() {
  posterModal.hidden = false;
  posterModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("poster-open");
}

function setupPoster() {
  const posterSrc = "./assets/poster.png?v=20261006-6";
  fetch(posterSrc, { method: "HEAD", cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Poster not found");
      posterImage.src = posterSrc;
      posterButton.hidden = false;
    })
    .catch(() => {
      posterButton.hidden = true;
    });

  posterButton.addEventListener("click", openPoster);
  posterClose.addEventListener("click", closePoster);

  posterModal.addEventListener("click", (event) => {
    if (event.target === posterModal) closePoster();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !posterModal.hidden) closePoster();
  });
}

setupPoster();
