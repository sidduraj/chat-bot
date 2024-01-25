 
  export enum LANGUAGE {
    ENGLISH = "en",
    // HINDI = "hi",
    // MARATHI = "mr",
    // TAMIL = "ta",
    // TELUGU = "te",
    // BENGALI = "bn",
    // KANNADA = "kn",
    // MALAYALAM = "ml",
  }
  
  // List used for drop down
  export const LANGUAGES: Record<LANGUAGE, string> = {
    [LANGUAGE.ENGLISH]: "EN",
    // [LANGUAGE.HINDI]: "हिन्दी",
    // [LANGUAGE.MARATHI]: "मराठी",
    // [LANGUAGE.KANNADA]: "ಕನ್ನಡ",
    // [LANGUAGE.TELUGU]: "తెలుగు",
    // [LANGUAGE.TELUGU]: "TE",
    // [LANGUAGE.TAMIL]: "தமிழ்",
    // [LANGUAGE.BENGALI]: "বাংলা",
  };
  
  export const ROUTES = {
    HOME: "/",
    WELCOME: "/welcome",
    REGISTER: "/register",
    SURVEY: "/survey",
    THANK_YOU: "/thank-you",
    FEEDBACK: "/feedback",
    TANDC: "/tandc",
    PRIVACY: "/privacy-policy",
    CONTACT_US: "/contact",
    COMPLETED: "/completed",
    HTR: "/how-to-redeem",
    FAQ: "/faq",
    NOT_ALLOWED: "/not-allowed",
  };
  
