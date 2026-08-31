import type { Lang } from "@/types";

export const t = {
  nav: {
    how: { en: "How it works", cs: "Jak to funguje" },
    pricing: { en: "Pricing", cs: "Ceník" },
    faq: { en: "FAQ", cs: "FAQ" },
    cta: { en: "Start free", cs: "Začni zdarma" },
    ctaShort: { en: "Start", cs: "Začít" },
    menu: { en: "Menu", cs: "Menu" },
    close: { en: "Close", cs: "Zavřít" },
    signIn: { en: "Sign in", cs: "Přihlásit se" },
    dashboard: { en: "Dashboard", cs: "Přehled" },
    settings: { en: "Settings", cs: "Nastavení" },
    signOut: { en: "Sign out", cs: "Odhlásit se" },
    profile: { en: "Profile", cs: "Profil" },
  },
  hero: {
    tag: { en: "Personal Energy Diagnostic", cs: "Osobní diagnostika energie" },
    title: {
      en: "Find out why you're exhausted — and actually fix it",
      cs: "Zjisti, proč ti dochází energie — a konečně s tím něco udělej",
    },
    titleLead: {
      en: "Tired of being tired?",
      cs: "Máš dost věčné únavy?",
    },
    titleMid: {
      en: "",
      cs: "",
    },
    titleAccent: {
      en: "Stop guessing. Start fixing.",
      cs: "Přestaň hádat. Začni to řešit.",
    },
    subtitle: {
      en: "Answer 10 questions — your answers build a personal 30-day protocol shaped around your sleep, stress, and energy patterns.",
      cs: "Odpověz na 10 otázek — z tvých odpovědí sestavíme osobní 30denní protokol na míru tvému spánku, stresu a energii.",
    },
    cta: { en: "Start FREE diagnostic", cs: "Spustit diagnostiku ZDARMA" },
    sub: { en: "Takes 2 minutes.", cs: "Zabere 2 minuty." },
    // Factual product claims (replaced fabricated user/rating stats).
    claims: {
      time: {
        value: { en: "2 minutes", cs: "2 minuty" },
        label: { en: "to complete", cs: "a máš hotovo" },
      },
      plan: {
        value: { en: "30-day plan", cs: "30denní plán" },
        label: { en: "built from your answers", cs: "podle tvých odpovědí" },
      },
      pricing: {
        value: { en: "No subscription", cs: "Bez předplatného" },
        label: { en: "PRO is one payment", cs: "PRO platíš jednou" },
      },
    },
  },
  marquee: {
    items: {
      en: [
        "Brain fog",
        "Afternoon crashes",
        "3-cup mornings",
        "Can't fall asleep",
        "Wake up tired",
        "No motivation",
        "Scrolling at 2am",
        "Stress eating",
        "Sunday anxiety",
      ],
      cs: [
        "Mlha v hlavě",
        "Odpolední útlum",
        "Ráno na tři kávy",
        "Nemůžu usnout",
        "Vstávám bez energie",
        "Nulová motivace",
        "Scrollování ve 2 ráno",
        "Zajídání stresu",
        "Nedělní úzkost",
      ],
    },
  },
  problems: {
    title: { en: "Is this you?", cs: "Poznáváš se?" },
    subtitle: {
      en: "If at least 3 feel familiar — you're leaking energy every day.",
      cs: "Pokud ti aspoň 3 zní povědomě, ztrácíš energii každý den.",
    },
    items: {
      en: [
        "You never feel rested",
        "Coffee stopped working",
        "By 3 PM your brain turns off",
        "You scroll instead of sleeping — every night",
        "You know what to do but can't start",
        "Stress leaks into weekends",
      ],
      cs: [
        "Nikdy se necítíš odpočatě",
        "Káva přestala zabírat",
        "Ve tři odpoledne ti vypne mozek",
        "Místo spaní scrolluješ — každou noc",
        "Víš, co dělat, ale nedokážeš začít",
        "Stres ti prosakuje i do víkendů",
      ],
    },
  },
  how: {
    title: { en: "How it works", cs: "Jak to funguje" },
    steps: {
      en: [
        { t: "Answer 10 questions", d: "Sleep, stress, nutrition, energy — the whole picture." },
        { t: "Every answer shapes your plan", d: "Your specific patterns reveal your top energy leaks and root causes — not generic advice." },
        { t: "Get your protocol", d: "Morning, sleep, supplements, 30-day plan — on screen in 40 seconds." },
      ],
      cs: [
        { t: "Odpověz na 10 otázek", d: "Spánek, stres, strava, energie — celý obraz." },
        { t: "Každá odpověď tvaruje tvůj plán", d: "Tvoje konkrétní vzorce odhalí největší úniky energie a jejich příčiny — žádné obecné rady." },
        { t: "Získej svůj protokol", d: "Ráno, spánek, doplňky, 30denní plán — na obrazovce za 40 sekund." },
      ],
    },
  },
  preview: {
    title: { en: "This is what you get", cs: "Tohle dostaneš" },
    subtitle: {
      en: "A real plan, generated for you in 40 seconds.",
      cs: "Skutečný plán, vytvořený pro tebe za 40 sekund.",
    },
    // Fake-dashboard mockup (DashboardMockup + PlanPreview floating chips).
    // Illustrative sample content — not a generated plan.
    mockup: {
      badges: {
        ai: { en: "AI-personalized", cs: "Na míru od AI" },
        days: { en: "30 days", cs: "30 dní" },
        science: { en: "Science-backed", cs: "Založeno na výzkumu" },
        forYou: { en: "Just for you", cs: "Jen pro tebe" },
      },
      /** Topbar status badge — stays English in both locales. */
      live: { en: "Live", cs: "Live" },
      welcome: { en: "Welcome to your plan", cs: "Vítej ve svém plánu" },
      summary: {
        en: "Your protocol is built around your specific stress, sleep, and morning patterns. Each habit stacks on the previous one to compound energy gains over 30 days. Every recommendation is shaped by your answers — no generic templates.",
        cs: "Tvůj protokol je postavený na tvých konkrétních vzorcích stresu, spánku a rána. Každý návyk staví na předchozím, takže se přínos energie během 30 dní sčítá. Každé doporučení vychází z tvých odpovědí — žádné univerzální šablony.",
      },
      morningTitle: { en: "Morning Protocol", cs: "Ranní protokol" },
      sleepTitle: { en: "Sleep Protocol", cs: "Spánkový protokol" },
      morningBullets: {
        en: [
          "Wake 6:30 AM consistently",
          "10 min direct sunlight on waking",
          "500 ml water + electrolytes",
          "25g+ protein within 60 minutes",
        ],
        cs: [
          "Vstávej konzistentně v 6:30",
          "10 minut přímého slunce hned po probuzení",
          "500 ml vody + elektrolyty",
          "25+ g bílkovin do 60 minut",
        ],
      },
      sleepBullets: {
        en: [
          "Lights out by 10:30 PM",
          "No screens after 9:30",
          "Magnesium glycinate, 400mg",
          "Bedroom 18°C / 65°F",
        ],
        cs: [
          "Zhasnuto do 22:30",
          "Po 21:30 žádné obrazovky",
          "Hořčík bisglycinát, 400 mg",
          "Ložnice 18 °C",
        ],
      },
      supplements: {
        en: ["Vitamin D3", "Omega-3", "Magnesium", "Ashwagandha"],
        cs: ["Vitamin D3", "Omega-3", "Hořčík bisglycinát", "Ashwagandha"],
      },
    },
  },
  features: {
    title: { en: "What PRO includes", cs: "Co obsahuje PRO" },
    items: {
      en: [
        { t: "Personal 30-day plan", d: "Week by week — what to do and when." },
        { t: "Morning protocol", d: "First 60 minutes — engineered for energy." },
        { t: "Sleep protocol", d: "Fall asleep in 15 min. Wake up rested." },
        { t: "Supplement stack", d: "Exactly what, when, how much — with dosages." },
        { t: "Nutrition blueprint", d: "Meal timing, macros, what to cut." },
        { t: "Stress protocol", d: "Breathing, breaks, boundaries — field-tested." },
        { t: "PDF download", d: "Take it anywhere. Print. Pin to the fridge." },
        { t: "Lifetime access", d: "Once. Forever. No subscription nag." },
      ],
      cs: [
        { t: "Osobní 30denní plán", d: "Týden po týdnu — co dělat a kdy." },
        { t: "Ranní protokol", d: "Prvních 60 minut — navržených pro energii." },
        { t: "Spánkový protokol", d: "Usni do 15 minut. Probuď se svěží." },
        { t: "Sestava doplňků", d: "Přesně co, kdy a kolik — včetně dávkování." },
        { t: "Plán stravy", d: "Načasování jídel, makra, co vyřadit." },
        { t: "Protokol proti stresu", d: "Dýchání, pauzy, hranice — ověřené v praxi." },
        { t: "PDF ke stažení", d: "Vezmi si ho kamkoliv. Vytiskni. Přilep na lednici." },
        { t: "Doživotní přístup", d: "Jednou. Navždy. Žádné otravné předplatné." },
      ],
    },
  },
  pricing: {
    title: { en: "Pick your path", cs: "Vyber si svou cestu" },
    subtitle: { en: "Start free. Upgrade only if it's worth it.", cs: "Začni zdarma. Upgraduj, jen když to bude stát za to." },
    canceledBanner: {
      message: {
        en: "Payment canceled. If you had questions, email support@energyforge.app — we're happy to help.",
        cs: "Platba zrušena. Máš otázky? Napiš na support@energyforge.app — rádi pomůžeme.",
      },
      dismiss: { en: "Dismiss", cs: "Zavřít" },
    },
    plans: {
      en: [
        {
          name: "Starter",
          price: "Free",
          period: "",
          desc: "Basic analysis",
          features: ["Basic diagnostic", "Top-3 energy leaks", "5 targeted tips"],
          cta: "Start free",
          tag: "",
        },
        {
          name: "PRO",
          price: "€9.99",
          period: "one-time",
          desc: "Full 30-day plan",
          features: [
            "Everything in Starter",
            "Full 30-day plan",
            "Supplement stack",
            "All protocols",
            "PDF download",
            "Lifetime access",
          ],
          cta: "Get PRO",
          tag: "Most popular",
        },
        {
          name: "Coach",
          price: "€24.99",
          period: "/month",
          desc: "Weekly plan adjustments",
          features: [
            "Everything in PRO",
            "Weekly plan reviews",
            "Auto-tuning to your progress",
            "Priority support",
          ],
          cta: "Become Coach",
          tag: "",
        },
      ],
      cs: [
        {
          name: "Starter",
          price: "Zdarma",
          period: "",
          desc: "Základní analýza",
          features: ["Základní diagnostika", "Top 3 úniky energie", "5 cílených tipů"],
          cta: "Začni zdarma",
          tag: "",
        },
        {
          name: "PRO",
          price: "€9.99",
          period: "jednorázově",
          desc: "Kompletní 30denní plán",
          features: [
            "Vše ze Starteru",
            "Kompletní 30denní plán",
            "Sestava doplňků",
            "Všechny protokoly",
            "PDF ke stažení",
            "Doživotní přístup",
          ],
          cta: "Chci PRO",
          tag: "Nejoblíbenější",
        },
        {
          name: "Coach",
          price: "€24.99",
          period: "/měsíc",
          desc: "Týdenní úpravy plánu",
          features: [
            "Vše z PRO",
            "Týdenní revize plánu",
            "Automatické ladění podle tvého pokroku",
            "Prioritní podpora",
          ],
          cta: "Chci Coach",
          tag: "",
        },
      ],
    },
  },
  faq: {
    title: { en: "FAQ", cs: "Časté otázky" },
    items: {
      en: [
        { q: "Is this medical advice?", a: "No. EnergyForge is a lifestyle diagnostic. For medical issues see a doctor." },
        { q: "How fast will I feel it?", a: "The 30-day plan is structured so the early changes are the easiest ones — sleep timing and morning light. The compounding effects come later." },
        { q: "What if it doesn't work?", a: "14-day money-back on PRO. No questions, no forms." },
        { q: "Do I need to buy supplements?", a: "No. The plan works without them — supplements are a boost, not a must." },
        { q: "My data is safe?", a: "Answers are never shared. No email required for Starter." },
      ],
      cs: [
        { q: "Je to lékařská rada?", a: "Ne. EnergyForge je lifestylová diagnostika. Se zdravotními problémy zajdi k lékaři." },
        { q: "Za jak dlouho to pocítím?", a: "30denní plán je postavený tak, aby první změny byly ty nejsnazší — načasování spánku a ranní světlo. Efekty se pak postupně sčítají." },
        { q: "Co když to nezafunguje?", a: "14 dní na vrácení peněz u PRO. Bez otázek, bez formulářů." },
        { q: "Musím kupovat doplňky?", a: "Ne. Plán funguje i bez nich — doplňky jsou bonus, ne podmínka." },
        { q: "Jsou moje data v bezpečí?", a: "Tvoje odpovědi nikdy nikomu nepředáváme. U Starteru nepotřebuješ ani e-mail." },
      ],
    },
  },
  finalCta: {
    title: { en: "Your next 30 days can feel different.", cs: "Za 30 dní se můžeš cítit úplně jinak." },
    sub: { en: "Start with the free diagnostic.", cs: "Začni diagnostikou zdarma." },
    btn: { en: "Start diagnostic", cs: "Spustit diagnostiku" },
  },
  footer: {
    rights: { en: "All rights reserved.", cs: "Všechna práva vyhrazena." },
    privacy: { en: "Privacy Policy", cs: "Ochrana soukromí" },
    terms: { en: "Terms of Service", cs: "Obchodní podmínky" },
    refund: { en: "Refund Policy", cs: "Podmínky vrácení peněz" },
    contact: { en: "Contact", cs: "Kontakt" },
  },
  auth: {
    signIn: { en: "Sign in", cs: "Přihlásit se" },
    signUp: { en: "Sign up", cs: "Zaregistrovat se" },
    createAccount: { en: "Create account", cs: "Vytvořit účet" },
    email: { en: "Email", cs: "E-mail" },
    password: { en: "Password", cs: "Heslo" },
    confirmPassword: { en: "Confirm password", cs: "Potvrď heslo" },
    name: { en: "Name (optional)", cs: "Jméno (nepovinné)" },
    forgotPassword: { en: "Forgot password?", cs: "Zapomenuté heslo?" },
    orContinueWith: { en: "or continue with", cs: "nebo pokračuj přes" },
    signInWithGoogle: { en: "Sign in with Google", cs: "Přihlásit se přes Google" },
    signUpWithGoogle: { en: "Sign up with Google", cs: "Zaregistrovat se přes Google" },
    noAccount: { en: "Don't have an account?", cs: "Ještě nemáš účet?" },
    haveAccount: { en: "Already have an account?", cs: "Už máš účet?" },
    loginTitle: { en: "Welcome back", cs: "Vítej zpátky" },
    loginSubtitle: {
      en: "Sign in to access your personal plan.",
      cs: "Přihlas se a otevři svůj osobní plán.",
    },
    signupTitle: { en: "Create your account", cs: "Vytvoř si účet" },
    signupSubtitle: {
      en: "Save your results and access your plan from any device.",
      cs: "Ulož si výsledky a měj plán po ruce na jakémkoli zařízení.",
    },
    agreeToTerms: {
      en: "I agree to the",
      cs: "Souhlasím s",
    },
    and: { en: "and", cs: "a" },
    termsLink: { en: "Terms of Service", cs: "Obchodními podmínkami" },
    privacyLink: { en: "Privacy Policy", cs: "Zásadami ochrany osobních údajů" },
    mustAgree: {
      en: "Please accept the Terms and Privacy Policy to continue.",
      cs: "Nejdřív prosím odsouhlas podmínky a zásady ochrany údajů.",
    },
    passwordsDoNotMatch: {
      en: "Passwords do not match.",
      cs: "Hesla se neshodují.",
    },
    passwordTooShort: {
      en: "Password must be at least 8 characters.",
      cs: "Heslo musí mít aspoň 8 znaků.",
    },
    invalidEmail: { en: "Please enter a valid email.", cs: "Zadej platný e-mail." },
    checkEmailSignup: {
      en: "Check your email to confirm your account.",
      cs: "Zkontroluj e-mail a potvrď svůj účet.",
    },
    forgotTitle: { en: "Reset your password", cs: "Obnova hesla" },
    forgotSubtitle: {
      en: "Enter your email and we'll send you a reset link.",
      cs: "Zadej svůj e-mail a pošleme ti odkaz pro obnovu.",
    },
    sendResetLink: { en: "Send reset link", cs: "Poslat odkaz" },
    checkEmailReset: {
      en: "Check your email for a password reset link.",
      cs: "Zkontroluj e-mail — odkaz pro obnovu hesla je na cestě.",
    },
    resetTitle: { en: "Set a new password", cs: "Nastav si nové heslo" },
    resetSubtitle: {
      en: "Choose a new password for your account.",
      cs: "Zvol si nové heslo ke svému účtu.",
    },
    newPasswordLabel: { en: "New password", cs: "Nové heslo" },
    setNewPassword: { en: "Set new password", cs: "Nastavit nové heslo" },
    resetLinkExpired: {
      en: "This reset link has expired or was already used. Request a new one below.",
      cs: "Platnost odkazu pro obnovu vypršela, nebo už byl použit. Níže si vyžádej nový.",
    },
    requestNewLink: { en: "Request a new link", cs: "Vyžádat nový odkaz" },
    samePassword: {
      en: "The new password must be different from your current one.",
      cs: "Nové heslo se musí lišit od toho současného.",
    },
    working: { en: "…", cs: "…" },
    linkExpired: {
      en: "Your login link has expired. Please request a new one below.",
      cs: "Platnost přihlašovacího odkazu vypršela. Níže si vyžádej nový.",
    },
    accessDenied: {
      en: "Access denied. Please sign in again.",
      cs: "Přístup zamítnut. Přihlas se znovu.",
    },
    authErrorGeneric: {
      en: "Something went wrong. Please try signing in again.",
      cs: "Něco se pokazilo. Zkus se přihlásit znovu.",
    },
    magicLinkTitle: {
      en: "Sign in with magic link",
      cs: "Přihlásit se přes přihlašovací odkaz",
    },
    magicLinkSubtitle: {
      en: "We'll email you a one-time login link",
      cs: "Pošleme ti jednorázový přihlašovací odkaz na e-mail",
    },
    magicLinkButton: { en: "Send magic link", cs: "Poslat přihlašovací odkaz" },
    magicLinkSent: {
      en: "Check your email — link sent to",
      cs: "Zkontroluj e-mail — odkaz jsme poslali na",
    },
    orPassword: {
      en: "OR sign in with password",
      cs: "NEBO se přihlas heslem",
    },
    magicLinkError: {
      en: "Couldn't send the magic link. Please try again.",
      cs: "Odkaz se nepodařilo odeslat. Zkus to znovu.",
    },
    magicLinkNoAccount: {
      en: "No account found for that email. Check the spelling, or use the email you purchased with.",
      cs: "K tomuto e-mailu jsme nenašli účet. Zkontroluj překlepy, nebo použij e-mail, přes který proběhl nákup.",
    },
    clickToLoginTitle: {
      en: "One more click to sign you in",
      cs: "Ještě jeden klik a jsi uvnitř",
    },
    clickToLoginSubtitle: {
      en: "We're confirming this is really you. Click below to access your plan.",
      cs: "Jen ověřujeme, že jsi to opravdu ty. Klikni níže a otevři svůj plán.",
    },
    clickToLoginButton: {
      en: "Sign me in →",
      cs: "Přihlásit →",
    },
    clickToLoginInvalid: {
      en: "This link is invalid. Please request a new login link from the sign-in page.",
      cs: "Tenhle odkaz není platný. Vyžádej si nový na přihlašovací stránce.",
    },
  },
  legal: {
    back: { en: "← Back to home", cs: "← Zpět na hlavní stránku" },
    comingSoon: { en: "Coming soon", cs: "Už brzy" },
    placeholderBody: {
      en: "We're finalising the text. The full policy will appear here shortly.",
      cs: "Text dolaďujeme. Úplné znění tu najdeš už brzy.",
    },
    privacyTitle: { en: "Privacy Policy", cs: "Zásady ochrany osobních údajů" },
    termsTitle: { en: "Terms of Service", cs: "Obchodní podmínky" },
    refundTitle: { en: "Refund Policy", cs: "Podmínky vrácení peněz" },
    lastUpdated: { en: "Last updated", cs: "Poslední aktualizace" },
  },
  quiz: {
    next: { en: "Next", cs: "Dál" },
    back: { en: "Back", cs: "Zpět" },
    finish: { en: "Get my plan", cs: "Chci svůj plán" },
    step: { en: "Step", cs: "Krok" },
    of: { en: "of", cs: "z" },
  },
  loading: {
    title: { en: "Forging your personal plan…", cs: "Kujeme tvůj osobní plán…" },
    steps: {
      en: ["Analyzing your energy profile", "Finding root causes", "Matching protocols", "Personalizing the 30-day plan"],
      cs: ["Analyzujeme tvůj energetický profil", "Hledáme příčiny", "Vybíráme protokoly", "Ladíme 30denní plán na míru"],
    },
  },
  result: {
    freeTitle: { en: "Your free diagnostic", cs: "Tvoje diagnostika zdarma" },
    leaks: { en: "Top energy leaks", cs: "Největší úniky energie" },
    tips: { en: "Your 5 targeted tips", cs: "Tvých 5 cílených tipů" },
    whatWeNoticed: { en: "What we noticed", cs: "Čeho jsme si všimli" },
    locked: {
      badge: {
        en: "🔒 Locked — €9.99 to unlock",
        cs: "🔒 Zamčeno — odemkneš za €9.99",
      },
      // H2: "Your 30-day {name} protocol" — phenotype name (accent-colored)
      // sits between these two halves so EN/CS word order stays independent.
      titleBefore: { en: "Your 30-day ", cs: "Tvůj 30denní protokol " },
      titleAfter: { en: " protocol", cs: "" },
      subline: {
        en: "Built from your answers — not a generic template.",
        cs: "Sestavený z tvých odpovědí — žádná šablona.",
      },
      whatsInside: {
        heading: { en: "What's inside", cs: "Co je uvnitř" },
        items: {
          en: [
            "4-week progression",
            "Morning + sleep protocols",
            "Supplement stack",
            "Day-by-day actions",
          ],
          cs: [
            "Progrese na 4 týdny",
            "Ranní a spánkový protokol",
            "Sestava doplňků",
            "Kroky den po dni",
          ],
        },
      },
      progression: {
        heading: { en: "Your 4-week progression", cs: "Tvoje progrese na 4 týdny" },
        weekLabel: { en: "Week", cs: "Týden" },
        previewBadge: { en: "Preview", cs: "Ukázka" },
        lockedBadge: { en: "🔒 Locked", cs: "🔒 Zamčeno" },
      },
      week1: {
        hint: {
          en: "Unlock to see all of Week 1 + Weeks 2–4",
          cs: "Odemkni a uvidíš celý Týden 1 + Týdny 2–4",
        },
      },
      modal: {
        // "Unlock your full {name} protocol" — name (accent) sits between.
        titleBefore: { en: "Unlock your full ", cs: "Odemkni celý protokol " },
        titleAfter: { en: " protocol", cs: "" },
        sub: {
          en: "Your complete 30-day plan, supplement stack and daily protocols — one-time €9.99.",
          cs: "Kompletní 30denní plán, sestava doplňků a denní protokoly — jednorázově €9.99.",
        },
        unlockCta: { en: "Unlock now — €9.99", cs: "Odemknout — €9.99" },
        dismiss: { en: "Maybe later", cs: "Možná později" },
        close: { en: "Close", cs: "Zavřít" },
      },
    },
    unlock: { en: "Unlock PRO — €9.99", cs: "Odemknout PRO — €9.99" },
    tryAgain: { en: "Retake quiz", cs: "Vyplnit kvíz znovu" },
    error: { en: "Something went wrong. Please try again.", cs: "Něco se pokazilo. Zkus to znovu." },
    choose: {
      title: { en: "Choose your path", cs: "Vyber si svou cestu" },
      subtitle: {
        en: "Two ways to unlock your full personalized protocol.",
        cs: "Dva způsoby, jak odemknout svůj kompletní protokol na míru.",
      },
      upgradeNote: {
        en: "Upgrade from PRO to Coach anytime.",
        cs: "Z PRO na Coach můžeš přejít kdykoli.",
      },
      pro: {
        badge: { en: "One-time payment", cs: "Jednorázová platba" },
        name: { en: "PRO", cs: "PRO" },
        price: { en: "€9.99", cs: "€9.99" },
        period: { en: "one-time", cs: "jednorázově" },
        features: {
          en: [
            "Full 30-day plan",
            "Personal supplement stack",
            "Morning, sleep & stress protocols",
            "PDF export",
            "Lifetime access",
          ],
          cs: [
            "Kompletní 30denní plán",
            "Osobní sestava doplňků",
            "Protokoly pro ráno, spánek i stres",
            "PDF export",
            "Doživotní přístup",
          ],
        },
        cta: { en: "Unlock PRO", cs: "Odemknout PRO" },
      },
      coach: {
        badge: { en: "★ Best value", cs: "★ Nejvýhodnější" },
        name: { en: "COACH", cs: "COACH" },
        price: { en: "€24.99", cs: "€24.99" },
        period: { en: "per month", cs: "měsíčně" },
        features: {
          en: [
            "Everything in PRO",
            "Weekly plan adjustments",
            "New protocols as you progress",
            "Energy tracking dashboard",
            "Priority support",
          ],
          cs: [
            "Vše z PRO",
            "Týdenní úpravy plánu",
            "Nové protokoly podle tvého pokroku",
            "Dashboard pro sledování energie",
            "Prioritní podpora",
          ],
        },
        cta: { en: "Start with Coach", cs: "Začít s Coachem" },
      },
    },
  },
  chart: {
    title: {
      en: "Your 24-hour energy pattern",
      cs: "Tvoje energie během 24 hodin",
    },
    you: { en: "You", cs: "Ty" },
    normal: { en: "Normal", cs: "Průměr" },
    aria: {
      en: "24-hour energy pattern chart",
      cs: "Graf energie během 24 hodin",
    },
    // X-axis time labels, left→right. EN keeps am/pm; CS uses 24h clock.
    axis: {
      en: ["6am", "10am", "2pm", "6pm", "10pm"],
      cs: ["6:00", "10:00", "14:00", "18:00", "22:00"],
    },
  },
  // PDF-export-only section labels not covered by dashboard/chart strings.
  pdf: {
    phenotypeLabel: { en: "Your phenotype", cs: "Tvůj fenotyp" },
    insights: { en: "Key insights", cs: "Klíčová zjištění" },
    keyActions: { en: "Key actions", cs: "Klíčové kroky" },
    disclaimer: {
      en: "Not medical advice. Consult a healthcare professional before changing supplements or routines.",
      cs: "Nejde o lékařskou radu. Před změnou doplňků nebo režimu se poraď s lékařem.",
    },
  },
  dashboard: {
    welcome: { en: "Welcome to your plan", cs: "Vítej ve svém plánu" },
    sub: { en: "Your personal 30-day energy protocol.", cs: "Tvůj osobní 30denní energetický protokol." },
    sections: {
      morning: { en: "Morning Protocol", cs: "Ranní protokol" },
      sleep: { en: "Sleep Protocol", cs: "Spánkový protokol" },
      supplements: { en: "Supplements", cs: "Doplňky" },
      nutrition: { en: "Nutrition", cs: "Strava" },
      stress: { en: "Stress Protocol", cs: "Protokol proti stresu" },
      plan: { en: "30-day plan", cs: "30denní plán" },
    },
    heroStats: {
      crashWindow: { en: "Crash window", cs: "Okno útlumu" },
      peakHours: { en: "Peak hours", cs: "Energetická špička" },
      secondWind: { en: "Second wind", cs: "Druhý dech" },
    },
    noPlan: {
      en: "No plan found. Take the quiz first.",
      cs: "Žádný plán tu ještě není. Nejdřív si vyplň kvíz.",
    },
    startQuiz: { en: "Start quiz", cs: "Spustit kvíz" },
    downloadPdf: { en: "Download PDF", cs: "Stáhnout PDF" },
    week: { en: "Week", cs: "Týden" },
    // V2 PhenotypeDashboard / WeeklyProgram / TodayFocus / SupplementCard chrome.
    // Templated values use {placeholders} resolved via format() at call sites.
    protocolTitle: { en: "Your 30-day protocol", cs: "Tvůj 30denní protokol" },
    dayProgress: {
      en: "Day {d} — Week {w} of 4",
      cs: "Den {d} — Týden {w} ze 4",
    },
    supplementStack: { en: "Your supplement stack", cs: "Tvoje sestava doplňků" },
    supplementMeta: {
      en: "{n} {items} · two retailers each",
      cs: "{n} {items} · u každé dva obchody",
    },
    /** Plural forms for supplementMeta's {items} slot: [one, few, many] — see plural(). */
    supplementNoun: {
      en: ["item", "items", "items"],
      cs: ["položka", "položky", "položek"],
    },
    tapWeek: {
      en: "Tap a week to view its detail",
      cs: "Klepni na týden a uvidíš detail",
    },
    weekDaysMeta: {
      en: "WEEK {n} · DAYS {a}–{b}",
      cs: "TÝDEN {n} · DNY {a}–{b}",
    },
    weekStatus: {
      active: { en: "● Active", cs: "● Aktivní" },
      done: { en: "Done", cs: "Hotovo" },
      upcoming: { en: "Upcoming", cs: "Čeká tě" },
    },
    weekDetail: {
      nutrition: { en: "Nutrition focus", cs: "Zaměření stravy" },
      stress: { en: "Stress practices", cs: "Antistresové praktiky" },
    },
    todayFocus: {
      en: "Today's focus · Day {d}",
      cs: "Dnešní fokus · Den {d}",
    },
    keyActions: { en: "Key actions this week", cs: "Klíčové kroky týdne" },
    startWeek: { en: "Start week {n}", cs: "Od týdne {n}" },
    generating: {
      en: "Generating your full plan…",
      cs: "Generujeme tvůj kompletní plán…",
    },
    generatingSub: {
      en: "Your AI is analyzing 10 dimensions of your energy profile. This usually takes 60-90 seconds — please don't close this tab.",
      cs: "AI analyzuje 10 dimenzí tvého energetického profilu. Obvykle to trvá 60–90 sekund — nezavírej prosím tuhle záložku.",
    },
    answersLost: {
      en: "Your quiz answers are missing. Please retake the quiz to get your plan.",
      cs: "Tvoje odpovědi z kvízu chybí. Vyplň ho prosím znovu a plán ti vytvoříme.",
    },
    genError: {
      en: "Couldn't generate your plan. Please try again.",
      cs: "Plán se nepodařilo vytvořit. Zkus to znovu.",
    },
    retryGen: { en: "Try again", cs: "Zkusit znovu" },
    regenFailed: {
      en: "Couldn't restart generation. Please contact support.",
      cs: "Generování se nepodařilo spustit znovu. Napiš prosím podpoře.",
    },
    forging: {
      en: "Forging your personal plan...",
      cs: "Kujeme tvůj osobní plán...",
    },
    forgingSub: {
      en: "This can take up to 2-3 minutes. Don't close this page.",
      cs: "Může to trvat až 2–3 minuty. Nezavírej tuhle stránku.",
    },
    forgingTimeout: {
      en: "Generation is taking longer than usual. Please refresh or contact support@energyforge.app",
      cs: "Generování trvá déle než obvykle. Obnov stránku, nebo napiš na support@energyforge.app",
    },
    medicalDisclaimer: {
      text: {
        en: "This is not medical advice. Always consult a healthcare professional before starting new supplements, especially if you have medical conditions, take medications, are pregnant, or are under 18.",
        cs: "Tohle není lékařská rada. Před užíváním nových doplňků se vždy poraď s lékařem — hlavně pokud se s něčím léčíš, bereš léky, jsi těhotná nebo ti ještě nebylo 18.",
      },
      learnMore: { en: "Full disclaimer", cs: "Celé znění" },
    },
    supplement: {
      good: { en: "Good", cs: "Základ" },
      premium: { en: "Premium", cs: "Premium" },
      findOnAmazon: { en: "Find on Amazon", cs: "Najít na Amazonu" },
    },
    affiliateDisclosure: {
      en: "As an Amazon Associate, EnergyForge earns from qualifying purchases — at no extra cost to you.",
      cs: "EnergyForge je součástí partnerského programu Amazon a z některých nákupů získává provizi — tebe to nestojí nic navíc.",
    },
  },
  paymentSuccess: {
    title: { en: "Payment Successful!", cs: "Platba proběhla!" },
    subtitle: {
      en: "We've sent a login link to your email.",
      cs: "Poslali jsme ti přihlašovací odkaz na e-mail.",
    },
    body: {
      en: "Click it to access your personalized 30-day plan.",
      cs: "Klikni na něj a otevři svůj 30denní plán na míru.",
    },
    button: { en: "Open Gmail", cs: "Otevřít Gmail" },
    hint: {
      en: "Didn't get the email? Check your spam folder.",
      cs: "Nepřišel e-mail? Mrkni do spamu.",
    },
  },
  welcome: {
    invalidTitle: { en: "Invalid link", cs: "Neplatný odkaz" },
    invalidSub: {
      en: "We can't find your checkout session. Please return home and try again.",
      cs: "Nemůžeme najít tvou platební relaci. Vrať se na hlavní stránku a zkus to znovu.",
    },
    goHome: { en: "Go home", cs: "Na hlavní stránku" },
    stage1Title: {
      en: "✨ Processing your payment…",
      cs: "✨ Zpracováváme platbu…",
    },
    stage1Sub: {
      en: "This usually takes 30 seconds",
      cs: "Obvykle to trvá 30 sekund",
    },
    stage2Title: {
      en: "🪄 Generating your personalized plan…",
      cs: "🪄 Tvoříme tvůj plán na míru…",
    },
    stage2Sub: {
      en: "Crafting your 30-day energy protocol",
      cs: "Ladíme tvůj 30denní energetický protokol",
    },
    stage3Title: { en: "✅ Your plan is ready!", cs: "✅ Tvůj plán je hotový!" },
    stage3Sub: {
      en: "📧 Check your email — your login link is on the way ✨",
      cs: "📧 Zkontroluj e-mail — přihlašovací odkaz je na cestě ✨",
    },
    openGmail: { en: "Open Gmail", cs: "Otevřít Gmail" },
    errorTitle: {
      en: "We hit a snag generating your plan",
      cs: "Při tvorbě plánu se něco zadrhlo",
    },
    errorSub: {
      en: "Don't worry — your payment is safe. Please contact support@energyforge.app",
      cs: "Neboj — tvoje platba je v pořádku. Napiš na support@energyforge.app",
    },
    timeoutTitle: {
      en: "Taking longer than expected",
      cs: "Trvá to déle, než jsme čekali",
    },
    timeoutSub: {
      en: "Check your email — we'll send your login link there. Or contact support@energyforge.app",
      cs: "Zkontroluj e-mail — přihlašovací odkaz pošleme tam. Nebo napiš na support@energyforge.app",
    },
  },
  cookieBanner: {
    title: { en: "Cookies", cs: "Cookies" },
    messageBeforeLink: {
      en: "Besides the essential cookies that run the site and payments, we use analytics (PostHog) and advertising cookies (Meta Pixel, Pinterest) to understand usage and measure our ads. They are switched on only if you accept. Details in our ",
      cs: "Kromě nezbytných cookies pro chod webu a plateb používáme analytické (PostHog) a reklamní cookies (Meta Pixel, Pinterest), abychom rozuměli návštěvnosti a měřili reklamu. Zapnou se jen s tvým souhlasem. Podrobnosti v našich ",
    },
    privacyLinkText: {
      en: "Privacy Policy",
      cs: "Zásadách ochrany osobních údajů",
    },
    messageAfterLink: { en: ".", cs: "." },
    accept: { en: "Accept", cs: "Přijmout" },
    decline: { en: "Decline", cs: "Odmítnout" },
  },
  errors: {
    notFound: {
      title: { en: "Page not found", cs: "Stránka nenalezena" },
      heading: { en: "Page not found", cs: "Stránka nenalezena" },
      message: {
        en: "Looks like this page wandered off. Head back home and try again.",
        cs: "Vypadá to, že se tahle stránka někam zatoulala. Vrať se na hlavní a zkus to znovu.",
      },
      backHome: { en: "Back home", cs: "Zpět na hlavní" },
      takeQuiz: { en: "Take the quiz", cs: "Vyplnit kvíz" },
    },
    serverError: {
      heading: { en: "Something went wrong", cs: "Něco se pokazilo" },
      message: {
        en: "We've been notified and are working on it. Try refreshing, or contact us if it keeps happening.",
        cs: "Už o tom víme a pracujeme na tom. Zkus obnovit stránku, a pokud se to opakuje, napiš nám.",
      },
      tryAgain: { en: "Try again", cs: "Zkusit znovu" },
      contactSupport: { en: "Contact support", cs: "Napsat podpoře" },
    },
  },
  signup: {
    title: { en: "Create your account", cs: "Vytvoř si účet" },
    subtitle: {
      en: "One last step before your personalized plan",
      cs: "Poslední krok před tvým plánem na míru",
    },
    emailLabel: { en: "Email", cs: "E-mail" },
    passwordLabel: {
      en: "Password (min 8 characters)",
      cs: "Heslo (min. 8 znaků)",
    },
    confirmPasswordLabel: {
      en: "Confirm password",
      cs: "Potvrď heslo",
    },
    submitButton: {
      en: "Create account & continue to payment",
      cs: "Vytvořit účet a přejít k platbě",
    },
    submitting: { en: "Creating account…", cs: "Vytváříme účet…" },
    alreadyHaveAccount: {
      en: "Already have an account?",
      cs: "Už máš účet?",
    },
    signInLink: { en: "Sign in", cs: "Přihlásit se" },
    passwordTooShort: {
      en: "Password must be at least 8 characters.",
      cs: "Heslo musí mít aspoň 8 znaků.",
    },
    passwordMismatch: {
      en: "Passwords don't match.",
      cs: "Hesla se neshodují.",
    },
    emailInUse: {
      en: "This email is already registered. Please sign in instead.",
      cs: "Tenhle e-mail už je zaregistrovaný. Přihlas se prosím.",
    },
    genericError: {
      en: "Something went wrong. Please try again.",
      cs: "Něco se pokazilo. Zkus to znovu.",
    },
  },
};

type Mutable<T> = T extends readonly (infer U)[]
  ? Mutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: Mutable<T[K]> }
    : T;

export function pick<En, Cs>(node: { en: En; cs: Cs }, lang: Lang): Mutable<En | Cs> {
  return (lang === "en" ? node.en : node.cs) as Mutable<En | Cs>;
}

/**
 * Interpolate {placeholder} tokens in a localized template string.
 * Keeps templated chrome copy in t.* (one EN/CS pair) instead of scattering
 * .replace() calls across components.
 *
 *   format(pick(t.dashboard.dayProgress, lang), { d: 5, w: 1 })
 *   // "Day 5 — Week 1 of 4"  /  "Den 5 — Týden 1 ze 4"
 */
export function format(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/**
 * Czech-aware plural picker. forms = [one, few, many]:
 * 1 → one, 2–4 → few, 0 and 5+ → many (the Czech pattern).
 * EN entries just repeat the plural form: ["item", "items", "items"].
 *
 *   plural(3, pick(t.dashboard.supplementNoun, lang)) // "položky"
 */
export function plural(n: number, forms: readonly string[]): string {
  const abs = Math.abs(n);
  const idx = abs === 1 ? 0 : abs >= 2 && abs <= 4 ? 1 : 2;
  return forms[idx] ?? forms[forms.length - 1] ?? "";
}
