import { Lang } from "@/types/card";

export interface I18nStrings {
  auspiciousShloka: string;
  theWeddingOf: string;
  weds: string;
  scrollToUnfold: string;
  theInvitation: string;
  defaultInviteMessage: string;
  togetherWithFamilies: string;
  requestHonour: string;
  theCouple: string;
  meetHappyCouple: string;
  theGroom: string;
  theBride: string;
  sonOf: string;
  daughterOf: string;
  theCelebrations: string;
  weddingItinerary: string;
  itinerarySubtitle: (count: number) => string;
  onwards: string;
  saveTheDate: string;
  countingDown: string;
  countdownSubtitle: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  celebrationsBegun: string;
  cherishedMoments: string;
  ourGallery: string;
  gallerySubtitle: string;
  theVenue: string;
  findYourWay: string;
  getDirections: string;
  addToCalendar: string;
  getInTouch: string;
  contactTheFamily: string;
  whatsApp: string;
  call: string;
  email: string;
  awaitingYourPresence: string;
  craftedWithLove: string;
  madeWith: string;
  tapToLightDiya: string;
  shubhAarambh: string;
  share: string;
  linkCopied: string;
  birthdayCelebration: string;
  isTurning: string;
  partyDetails: string;
  partySchedule: string;
  tapToOpenGift: string;
  surpriseUnfolded: string;
  rsvpPrompt: string;
  yesAttending: string;
  noCannotAttend: string;
  hostedBy: string;
  shubhMuhurat: string;
  sacredRituals: string;
  humAapkaIntezaarKarenge: string;
  awaitingPresenceWarmly: string;
  tapToLightKalash: string;
  divineBlessingsAwaited: string;
  familyCelebration: string;
  youreInvited: string;
  birthdayCelebrationOf: string;
  tapToLightCandle: string;
  letsCelebrate: string;
  turns: string;
  thenAndNow: string;
  theBirthdayRole: string;
  then: string;
  now: string;
  little: string;
  atAge: string;
  whereStoryBegan: string;
  stillTheHeart: string;
  partyEssentials: string;
  theDetails: string;
  partyEssentialsSub: string;
  date: string;
  time: string;
  dressCode: string;
  theEvening: string;
  orderOfCelebration: string;
  orderOfCelebrationSub: string;
  willYouJoinUs: string;
  rsvpPleaseLetUsKnow: string;
  soWeCanPlan: string;
  yesIllBeThere: string;
  cantMakeIt: string;
  seeYouAtParty: string;
  questionsReachOut: string;
  grihaPravesh: string;
  tapToBeginPooja: string;
  withBlessingsOfAlmighty: string;
  withLove: string;
  aNewBeginning: string;
  fromOldHomeToNew: string;
  ourNewHomeTitle: string;
  puranaGhar: string;
  nayaGhar: string;
  oldHome: string;
  newHome: string;
  whereMemoriesBegan: string;
  whereNewOnesMade: string;
  ceremonyEssentials: string;
  attire: string;
  poojaSchedule: string;
  theCeremony: string;
  sacredRitualsSub: string;
  glimpses: string;
  peekAtPlace: string;
  wellBeThere: string;
  awaitingBlessings: string;
  shubhamBhavatu: string;
  kindlyConfirmBy: string;
  soWeCanArrangeCare: string;
  forQueriesContact: string;
}

export const translations: Record<Lang, I18nStrings> = {
  en: {
    auspiciousShloka: "॥ श्री गणेशाय नमः ॥",
    theWeddingOf: "The Wedding Of",
    weds: "WEDS",
    scrollToUnfold: "Scroll to unfold ⌄",
    theInvitation: "The Invitation",
    defaultInviteMessage:
      "With the divine blessings of the Almighty and our beloved elders, we request the honour of your presence as we begin our forever.",
    togetherWithFamilies: "Together with their families",
    requestHonour: "request the honour of your presence",
    theCouple: "The Couple",
    meetHappyCouple: "Meet the Happy Couple",
    theGroom: "THE GROOM",
    theBride: "THE BRIDE",
    sonOf: "Son of",
    daughterOf: "Daughter of",
    theCelebrations: "The Celebrations",
    weddingItinerary: "Wedding Itinerary",
    itinerarySubtitle: (count: number) =>
      `${count} beautiful moments woven into one celebration — we’d be honoured to have you at any, or all of them.`,
    onwards: "onwards",
    saveTheDate: "Save the Date",
    countingDown: "Counting Down",
    countdownSubtitle:
      "Every second brings us closer to the most beautiful day of our lives — and we can’t wait to celebrate it with you.",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
    seconds: "SECONDS",
    celebrationsBegun: "The celebrations have begun! 🎉",
    cherishedMoments: "Cherished Moments",
    ourGallery: "Our Gallery",
    gallerySubtitle:
      "A few frames from our journey — with many more memories waiting to be made, together with you.",
    theVenue: "The Venue",
    findYourWay: "Find Your Way",
    getDirections: "Get Directions",
    addToCalendar: "Add to Calendar",
    getInTouch: "Get in Touch",
    contactTheFamily: "Contact the Family",
    whatsApp: "WhatsApp",
    call: "Call",
    email: "Email",
    awaitingYourPresence: "Awaiting your presence",
    craftedWithLove: "Crafted with love",
    madeWith: "Made with निमंत्रण Utsav",
    tapToLightDiya: "Tap to light the diya",
    shubhAarambh: "शुभ आरम्भ",
    share: "Share",
    linkCopied: "Invitation link copied to clipboard!",
    birthdayCelebration: "Birthday Celebration",
    isTurning: "IS TURNING",
    partyDetails: "Party Details",
    partySchedule: "Party Schedule & Fun",
    tapToOpenGift: "Tap the gift box to pop & open! 🎁",
    surpriseUnfolded: "Happy Birthday! 🎉",
    rsvpPrompt: "Will you join the celebration? Please let us know!",
    yesAttending: "Attending with Joy! 🎉",
    noCannotAttend: "Regretfully Decline",
    hostedBy: "Hosted with love by",
    shubhMuhurat: "Shubh Muhurat",
    sacredRituals: "Sacred Ceremonies & Schedule",
    humAapkaIntezaarKarenge: "हम आपका इंतज़ार करेंगे • Hum Aapka Intezaar Karenge",
    awaitingPresenceWarmly:
      "We warmly await your gracious presence and heartfelt blessings to illuminate our new beginnings.",
    tapToLightKalash: "Tap the Kalash to light the auspicious Diya",
    divineBlessingsAwaited: "With Divine Grace & Elders' Blessings",
    familyCelebration: "Auspicious Family Celebration",
    youreInvited: "You’re invited",
    birthdayCelebrationOf: "Birthday celebration of",
    tapToLightCandle: "Tap to light the candle",
    letsCelebrate: "Let’s celebrate!",
    turns: "TURNS",
    thenAndNow: "Then & Now",
    theBirthdayRole: "The Birthday",
    then: "THEN",
    now: "NOW",
    little: "Little",
    atAge: "at",
    whereStoryBegan: "Where the story began",
    stillTheHeart: "Still the heart of every party",
    partyEssentials: "Party Essentials",
    theDetails: "The Details",
    partyEssentialsSub: "Everything you need to know, at a glance.",
    date: "Date",
    time: "Time",
    dressCode: "Dress Code",
    theEvening: "The Evening",
    orderOfCelebration: "Order of Celebration",
    orderOfCelebrationSub: "A little glimpse of how the night will unfold.",
    willYouJoinUs: "Will You Join Us?",
    rsvpPleaseLetUsKnow: "Please let us know by",
    soWeCanPlan: "so we can plan every little detail for you.",
    yesIllBeThere: "✓ Yes, I’ll be there",
    cantMakeIt: "Can’t make it",
    seeYouAtParty: "See you at the party!",
    questionsReachOut: "Questions? Reach out to",
    grihaPravesh: "Griha Pravesh",
    tapToBeginPooja: "Tap to begin the pooja",
    withBlessingsOfAlmighty: "With the blessings of the Almighty",
    withLove: "With love,",
    aNewBeginning: "A New Beginning",
    fromOldHomeToNew: "From Our Old Home to",
    ourNewHomeTitle: "Our New Home",
    puranaGhar: "PURANA GHAR",
    nayaGhar: "NAYA GHAR",
    oldHome: "Old Home",
    newHome: "New Home",
    whereMemoriesBegan: "Where our memories began",
    whereNewOnesMade: "Where new ones will be made",
    ceremonyEssentials: "Ceremony Essentials",
    attire: "Attire",
    poojaSchedule: "Pooja Schedule",
    theCeremony: "The Ceremony",
    sacredRitualsSub: "The sacred rituals of the day, in order.",
    glimpses: "Glimpses",
    peekAtPlace: "A peek at the place we’re about to fill with love.",
    wellBeThere: "✓ We’ll be there",
    awaitingBlessings: "Awaiting your blessings",
    shubhamBhavatu: "॥ शुभम् भवतु ॥",
    kindlyConfirmBy: "Kindly confirm by",
    soWeCanArrangeCare: "so we can arrange everything with care for you and your family.",
    forQueriesContact: "For any queries, please contact",
  },
  hi: {
    auspiciousShloka: "॥ श्री गणेशाय नमः ॥",
    theWeddingOf: "शुभ विवाह",
    weds: "संग",
    scrollToUnfold: "आमंत्रण देखने के लिए नीचे स्क्रॉल करें ⌄",
    theInvitation: "निमंत्रण पत्र",
    defaultInviteMessage:
      "ईश्वर एवं पूज्य बुजुर्गों के आशीर्वाद से, हमारे जीवन के इस मांगलिक अवसर पर आपकी गरिमामयी उपस्थिति सादर प्रार्थनीय है।",
    togetherWithFamilies: "परिवार सहित सादर निमंत्रित",
    requestHonour: "आपकी उपस्थिति एवं स्नेहिल आशीर्वाद की कामना करते हैं",
    theCouple: "वर एवं वधू",
    meetHappyCouple: "वर एवं वधू परिचय",
    theGroom: "वर",
    theBride: "वधू",
    sonOf: "सुपुत्र",
    daughterOf: "सुपुत्री",
    theCelebrations: "मांगलिक कार्यक्रम",
    weddingItinerary: "विवाह कार्यक्रम",
    itinerarySubtitle: (count: number) =>
      `${count} पावन उत्सवों की सुंदर श्रृंखला — आप सभी कार्यक्रमों में सादर आमंत्रित हैं।`,
    onwards: "से",
    saveTheDate: "मांगलिक तिथि",
    countingDown: "शुभ लग्न की प्रतीक्षा",
    countdownSubtitle:
      "हर पल हमें इस पावन अवसर के समीप ला रहा है, आपके साथ इस उत्सव को मनाने की प्रतीक्षा है।",
    days: "दिन",
    hours: "घंटे",
    minutes: "मिनट",
    seconds: "सेकंड",
    celebrationsBegun: "शुभ उत्सव आरम्भ हो चुका है! 🎉",
    cherishedMoments: "सुखद स्मृतियाँ",
    ourGallery: "चित्र वीथिका",
    gallerySubtitle:
      "जीवन की कुछ अनमोल झलकियाँ — और नए पलों को आपके साथ साझा करने की उमंग।",
    theVenue: "स्थान एवं पता",
    findYourWay: "स्थान मार्ग",
    getDirections: "गूगल मैप्स दिशा-निर्देश",
    addToCalendar: "कैलेंडर में जोड़ें",
    getInTouch: "संपर्क सूत्र",
    contactTheFamily: "परिवार से संपर्क करें",
    whatsApp: "व्हाट्सएप",
    call: "कॉल करें",
    email: "ईमेल",
    awaitingYourPresence: "दर्शनाभिलाषी",
    craftedWithLove: "सप्रेम निर्मित",
    madeWith: "निमंत्रण Utsav द्वारा निर्मित",
    tapToLightDiya: "दीपक प्रज्वलित करने के लिए स्पर्श करें",
    shubhAarambh: "शुभ आरम्भ",
    share: "शेयर करें",
    linkCopied: "निमंत्रण लिंक कॉपी हो गया!",
    birthdayCelebration: "जन्मदिन उत्सव",
    isTurning: "वर्ष के हो रहे हैं",
    partyDetails: "पार्टी विवरण",
    partySchedule: "उत्सव एवं मनोरंजन कार्यक्रम",
    tapToOpenGift: "उपहार खोलने के लिए स्पर्श करें! 🎁",
    surpriseUnfolded: "जन्मदिन की हार्दिक शुभकामनाएँ! 🎉",
    rsvpPrompt: "क्या आप इस उत्सव में पधारेंगे? कृपया सूचित करें!",
    yesAttending: "अवश्य पधारेंगे! 🎉",
    noCannotAttend: "उपस्थित होने में असमर्थ",
    hostedBy: "स्नेहिल आयोजक",
    shubhMuhurat: "शुभ मुहूर्त",
    sacredRituals: "मांगलिक अनुष्ठान एवं कार्यक्रम",
    humAapkaIntezaarKarenge: "हम आपका सप्रेम इंतज़ार करेंगे",
    awaitingPresenceWarmly:
      "आपकी गरिमामयी उपस्थिति एवं स्नेहिल आशीर्वाद हमारे इस पावन अवसर को और भी मंगलमय बनाएगा।",
    tapToLightKalash: "शुभ कलश एवं दीप प्रज्वलित करने के लिए स्पर्श करें",
    divineBlessingsAwaited: "ईश्वर की असीम अनुकंपा एवं पूज्य बुजुर्गों के आशीर्वाद से",
    familyCelebration: "मांगलिक गृह उत्सव",
    youreInvited: "आप सादर आमंत्रित हैं",
    birthdayCelebrationOf: "जन्मदिन का पावन उत्सव",
    tapToLightCandle: "मोमबत्ती प्रज्वलित करने के लिए स्पर्श करें",
    letsCelebrate: "आइए उत्सव मनाएं!",
    turns: "के हो रहे हैं",
    thenAndNow: "तब और अब",
    theBirthdayRole: "जन्मदिन उत्सव",
    then: "तब",
    now: "अब",
    little: "नन्हे / नन्ही",
    atAge: "उम्र",
    whereStoryBegan: "जहाँ से कहानी शुरू हुई",
    stillTheHeart: "आज भी हर महफ़िल की शान",
    partyEssentials: "पार्टी विवरण",
    theDetails: "महत्वपूर्ण विवरण",
    partyEssentialsSub: "समारोह से जुड़ी मुख्य जानकारियाँ।",
    date: "तिथि",
    time: "समय",
    dressCode: "वेशभूषा",
    theEvening: "संध्या कार्यक्रम",
    orderOfCelebration: "उत्सव का क्रम",
    orderOfCelebrationSub: "शाम के आयोजनों की एक सुंदर झलक।",
    willYouJoinUs: "क्या आप पधारेंगे?",
    rsvpPleaseLetUsKnow: "कृपया हमें सूचित करें",
    soWeCanPlan: "ताकि हम आपके स्वागत की समुचित व्यवस्था कर सकें।",
    yesIllBeThere: "✓ हाँ, हम ज़रूर शामिल होंगे",
    cantMakeIt: "उपस्थित होने में असमर्थ",
    seeYouAtParty: "उत्सव में मिलते हैं!",
    questionsReachOut: "कोई प्रश्न? संपर्क करें",
    grihaPravesh: "गृह प्रवेश",
    tapToBeginPooja: "पूजा आरम्भ करने के लिए स्पर्श करें",
    withBlessingsOfAlmighty: "ईश्वर की असीम अनुकंपा एवं पूज्य बुजुर्गों के आशीर्वाद से",
    withLove: "सप्रेम,",
    aNewBeginning: "एक नई शुरुआत",
    fromOldHomeToNew: "हमारे पुराने घर से",
    ourNewHomeTitle: "हमारे नए घर तक",
    puranaGhar: "पुराना घर",
    nayaGhar: "नया घर",
    oldHome: "पुराना घर",
    newHome: "नया घर",
    whereMemoriesBegan: "जहाँ हमारी स्मृतियों की शुरुआत हुई",
    whereNewOnesMade: "जहाँ नए सपने और स्मृतियाँ सजेंगी",
    ceremonyEssentials: "समारोह विवरण",
    attire: "वेशभूषा",
    poojaSchedule: "पूजा कार्यक्रम",
    theCeremony: "मांगलिक अनुष्ठान",
    sacredRitualsSub: "दिन के पावन अनुष्ठान एवं कार्यक्रम, क्रमवार।",
    glimpses: "झलकियाँ",
    peekAtPlace: "उस पावन आशियाने की झलक, जिसे हम प्रेम से सजाने जा रहे हैं।",
    wellBeThere: "✓ हम ज़रूर शामिल होंगे",
    awaitingBlessings: "स्नेहिल आशीर्वाद के आकांक्षी",
    shubhamBhavatu: "॥ शुभम् भवतु ॥",
    kindlyConfirmBy: "कृपया हमें सूचित करें",
    soWeCanArrangeCare: "ताकि हम आपके और आपके परिवार के स्वागत की समुचित व्यवस्था कर सकें।",
    forQueriesContact: "किसी भी जानकारी के लिए संपर्क करें",
  },
};

export function getI18n(lang: Lang = "en"): I18nStrings {
  return translations[lang] || translations.en;
}
