"use strict";

const i18n = {
  language: "en",
  general: {
    delete: "Delete",
    introDescription:
      "We will do our best to put together a program that is as exciting as possible and tailored to you. To help us do this, please let us know your preferences via this registration form.",
    helpNeeded:
      "Do not hesitate to contact us directly if you have any questions.",
  },
  phases: {
    intro: "Getting started",
    gaming: "Player",
    gamemastering: "Game Master",
    outro: "Conclusion",
    back: "Back",
    next: "Next",
    submit: "Submit registration",
    update: "Submit updated registration",
  },
  languages: {
    title: "Language",
    en: "English",
    de: "German",
  },
  fields: {
    title: "Contact information",
    name: { label: "Name" },
    mail: {
      label: "Email",
      info: "We will only use your email for the Luzerner Rollenspieltage 2021.",
    },
  },
  weekdays: {
    saturday: "Saturday, 28.8.21",
    sunday: "Sunday, 29.8.21",
  },
  time: {
    description:
      "Please select the hours you would like to participate in the event.",
    title: "Time slots",
    hour: "",
  },
  genres: {
    title: "Genres",
    description:
      "Are you missing a specific role-playing game? We made a conscious decision this year not to offer any specific game rounds. We want to cater to those who are new to the hobby and those who are brave and want to try something out.",
    missingGenre: "Are you missing a genre?",
    preferences: {
      yes: "gladly",
      whatever: "doesn't matter",
      no: "rather not",
    },
    list: {
      fantasy: "Fantasy",
      scifi: "Sci-Fi",
      horror: "Horror",
      crime: "Crime",
      modern: "Modern",
      cyberpunk: "Cyberpunk",
      steampunk: "Steampunk",
      western: "Western",
      history: "Historical",
    },
    addLabel: "add",
  },
  workshops: {
    title: "Workshops / discussion rounds",
    missingWorkshop:
      "Are you interested in a workshop / discussion topic not listed here?",
    preferences: {
      yes: "yes",
      no: "no",
    },
    list: {
      worldbuilding: {
        title: "World-building with Roleplaying Games",
        description:
          "Inventing your own language? Your own kingdom? City? Or a history for everything mentioned? We look at different roleplaying games, which help us to achieve this.",
      },
      whereToBegin: {
        title: "Where should I begin?",
        description:
          "You like to play a roleplaying game with your friends? But countless number of books, videos and podcasts don't make your life easier? We talk together about the basics of many roleplaying games, invent our own tiny roleplaying game, which we immediately try to play. At the end, let us compare this with other, quite often played games.",
      },
      gmWorkshop: {
        title: "GM Workshop",
        description:
          "You took the role of the GM, but don't know exactly how to proceed? We talk together what can be prepared, what tools exist but also about the most difficult point, that despite all preparations, you still have to be quite flexible at the table. Whatever question you have, together we will find an answer.",
      },
    },
    addLabel: "add",
  },
  gaming: {
    description:
      "You don't need any previous experience for any of our game rounds. You don't need to prepare anything and you don't need to bring anything except a little bit of excitement.",
    participate: "Yes, I would like to participate as a player.",
    gameroundTypes: {
      title: "Types of game rounds",
      description:
        "We are interested in whether you would prefer to test many role-playing games in short rounds at the Luzerner Rollenspieltage or whether you would like to focus on a few, but longer rounds.",
      short: "short game rounds",
      whatever: "doesn't matter",
      long: "long game rounds",
    },
    companions: {
      title: "Registration for groups",
      description:
        "You can add up to two friends here so you can play together. If your group is larger, we ask that you split into several groups, as it is difficult for us to find space for larger groups.",
      names: "Optionally, you may list the names of your friends here.",
    },
  },
  gamemastering: {
    participate: "Yes, I would like to participate as a game master.",
    addAGameround: "add a new game round",
    deleteGameround: "delete game round",
    saveGameround: "save game round",
    editGameround: "edit game round",
    gameTitle: "Title",
    duration: "Duration (in hours)",
    hours: "Hour",
    minimum: "Minimum",
    maximum: "Maximum",
    playerCount: "Player count",
    gameroundTitle: "Game rounds",
    description: "Description",
    patrons: {
      title: "Patrons",
      description:
        "Here you have the possibility to reserve seats in your round for friends who accompany you.",
    },
    buddy: {
      title: "Buddy-system",
      description:
        "You have never run a roleplay before or would like support for another reason? We will gladly provide you with a buddy who will support you before and at the event.",
      option: "Yes, I would like to have support.",
    },
  },
  info: {
    chooseAtLeastOneOption: "please make at least one selection",
  },
  helping: {
    title: "Call for volunteers",
    description:
      "We could not run the Rollenspieltage all by ourselves. You can support us in these areas.",
    tasks: {
      logistics: "Set up / Clean up",
      finance: "Cash desk (buffet or flea market)",
      kitchen: "Kitchen",
    },
  },
  terms: {
    title: "Possible requirements of the FOPH",
    description: "",
    mask: "No, I will not participate if masks are mandatory at the game table.",
    testing:
      "No, I will not participate if entry is allowed only with a vaccination certificate or negative test result.",
  },
  questions: {
    title: "Any questions?",
    contact: "to the contact form",
    contactUrl: "/en/contact",
    chat: "to the live chat",
    chatUrl: "/en/livechat",
    description: "Or leave your questions here.",
  },
  errors: {
    missingName: 'Please fill in the "Name" field (step 1).',
    missingEmail: 'Please fill in the "Email" field (step 1).',
    noLanguageSelected: "Please select at least one language (step 1).",
    noTimeSelected: "Please select at least one time slot (step 1).",
    editMissingTitle: 'Please fill in the "Title" field.',
    editMissingDescription: 'Please fill in the "Description" field.',
    editMissingGenres: "Please select at least one genre.",
    editMaxSmallerThanMin:
      'The "Minimum" number of players must be equal to or less than the "Maximum" number of players.',
    editPatronsCountTooBig:
      'You cannot reserve all seats for friends ("Patrons" must be less than "Maximum").',
    editLinkNotValid:
      "The current link is incorrect. Please contact us directly via the contact form.",
  },
  success: {
    description:
      "Thank you for your registration. You can still edit your registration here. Save the current page if you want to use it later. You should also have received an email from us as confirmation.",
  },
};
