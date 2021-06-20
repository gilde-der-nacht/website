"use strict";

const e = React.createElement;

// Components

class AddElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
  }

  addElement() {
    this.props.handleClick(this.state.input);
  }

  render() {
    return e(
      "label",
      {},
      this.props.label,
      e("input", {
        type: "text",
        value: this.state.input,
        onChange: (event) => this.setState({ input: event.target.value }),
        onKeyPress: (event) => event.code === "Enter" && this.addElement(),
      }),
      e(
        "button",
        {
          type: "button",
          onClick: this.addElement,
        },
        this.props.button
      )
    );
  }
}

class NumberInput extends React.Component {
  constructor(props) {
    super(props);
  }

  getLabel() {
    return this.props.label + (this.props.required ? "*" : "");
  }

  render() {
    return e(
      "label",
      {},
      this.getLabel(),
      this.props.description && e("small", {}, this.props.description),
      e("input", {
        name: this.props.name,
        type: "number",
        required: this.props.required,
        value: this.props.state,
        min: this.props.min,
        max: this.props.max,
        onChange: (event) =>
          this.props.handleChange(event.target.name, event.target.value),
      })
    );
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  getLabel() {
    return this.props.label + (this.props.required ? "*" : "");
  }

  render() {
    return e(
      "label",
      {},
      this.getLabel(),
      e("input", {
        name: this.props.name,
        type: "text",
        placeholder: this.props.placeholder,
        required: this.props.required,
        value: this.props.state,
        onChange: (event) =>
          this.props.handleChange(event.target.name, event.target.value),
      })
    );
  }
}

class Checkmark extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
      "p",
      {},
      e(
        "label",
        {},
        e("input", {
          type: "checkbox",
          name: this.props.name,
          checked: this.props.state,
          onChange: this.props.onChange,
        }),
        this.props.label
      )
    );
  }
}

class CheckmarkGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  renderCheckmarks() {
    return this.props.options.map((option) => e(Checkmark, option));
  }

  render() {
    return e(
      React.Fragment,
      {},
      this.props.title && e("h2", {}, this.props.title),
      this.props.description && e("p", {}, this.props.description),
      ...this.renderCheckmarks()
    );
  }
}

class Radio extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
      "p",
      {},
      e(
        "label",
        {},
        e("input", {
          type: "radio",
          name: this.props.groupName,
          value: this.props.name,
          checked: this.props.state,
          onChange: this.props.onChange,
        }),
        this.props.label
      )
    );
  }
}

class RadioGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  renderRadios() {
    return this.props.options.map((option) =>
      e(Radio, { ...option, groupName: this.props.groupName })
    );
  }

  render() {
    return e(
      React.Fragment,
      {},
      this.props.title && e("h2", {}, this.props.title),
      this.props.description && e("p", {}, this.props.description),
      ...this.renderRadios()
    );
  }
}

class GridLabel extends React.Component {
  constructor(props) {
    super(props);
  }

  renderDeleteButton() {
    return e("button", { type: "button", onClick: this.props.onClick }, "x");
  }

  render() {
    return e(
      React.Fragment,
      {},
      e("h3", {}, this.props.children),
      !this.props.fix && this.renderDeleteButton()
    );
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
  }

  buildOptions(entry) {
    return this.props.tiers.map((tier) => {
      return {
        label: tier.label,
        name: tier.name,
        state: tier.name === entry.status,
        onChange: this.props.updateStateGrid,
      };
    });
  }

  renderList() {
    return this.props.state.map((entry) => {
      return e(
        React.Fragment,
        { key: entry.name },
        e(
          GridLabel,
          {
            fix: entry.fix,
            onClick: () => this.props.deleteEntryFromGrid(entry.name),
          },
          entry.label
        ),
        e(RadioGroup, {
          options: this.buildOptions(entry),
          groupName: entry.name,
        })
      );
    });
  }

  renderAddEntry() {
    return e(AddElement, {
      name: "newEntry",
      label: this.props.missingEntry,
      button: "+",
      handleClick: this.props.addEntryToGrid,
    });
  }

  render() {
    return e(
      "div",
      {},
      e("h2", {}, this.props.title),
      ...this.renderList(),
      this.renderAddEntry()
    );
  }
}

class GamemasterGames extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
      React.Fragment,
      {},
      this.props.state.map((entry) => entry.title)
    );
  }
}

class NewGame extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateNewGame = (key, value) => {
    this.props.updateStateGamemaster("gameInEdit", {
      ...this.props.state,
      [key]: value,
    });
  };

  updateGenre = (e) => {
    this.updateStateNewGame(
      "genres",
      this.props.state.genres.map((genre) => {
        if (e.target.name === genre.label) {
          return { ...genre, checked: e.target.checked };
        }
        return genre;
      })
    );
  };

  render() {
    if (Object.entries(this.props.state).length === 0) {
      return e(
        "button",
        { type: "button", onClick: this.props.newEmptyGame },
        "+ füge eine neue Spielrunde hinzu"
      );
    }

    return e(
      React.Fragment,
      {},
      e("p", {}, "ID: " + this.props.state.id),
      e(TextInput, {
        name: "title",
        placeholder: "Titel",
        label: "Titel",
        required: true,
        state: this.props.state.title,
        handleChange: this.updateStateNewGame,
      }),
      e(TextInput, {
        name: "description",
        placeholder: "Beschreibung",
        label: "Beschreibung",
        required: true,
        state: this.props.state.description,
        handleChange: this.updateStateNewGame,
      }),
      e(CheckmarkGroup, {
        options: this.props.state.genres.map((genre) => {
          return {
            label: genre.label,
            name: genre.label,
            state: genre.checked,
            onChange: this.updateGenre,
          };
        }),
        title: "Genres",
        description: "triff bitte mindestens eine Auswahl",
      }),
      e(AddElement, {
        name: "newGenre",
        label: "Vermisst du ein Genre?",
        button: "+",
        handleClick: (name) =>
          this.updateStateNewGame("genres", [
            ...this.props.state.genres,
            { label: name, checked: true },
          ]),
      }),
      e(NumberInput, {
        label: "Dauer",
        state: this.props.state.duration,
        required: true,
        min: 1,
        max: 12,
        handleChange: (_, value) =>
          this.updateStateNewGame("duration", Number(value)),
      }),
      e("h3", {}, "Anzahl Spieler:innen"),
      e(NumberInput, {
        label: "Minimum",
        state: this.props.state.playerCount.min,
        required: true,
        min: 0,
        max: 100,
        handleChange: (_, value) =>
          this.updateStateNewGame("playerCount", {
            ...this.props.state.playerCount,
            min: Number(value),
          }),
      }),
      e(NumberInput, {
        label: "Maximum",
        state: this.props.state.playerCount.max,
        required: true,
        min: 0,
        max: 100,
        handleChange: (_, value) =>
          this.updateStateNewGame("playerCount", {
            ...this.props.state.playerCount,
            max: Number(value),
          }),
      }),
      e(NumberInput, {
        label: "Stammspieler",
        state: this.props.state.playerCount.patrons,
        required: true,
        min: 0,
        max: 100,
        handleChange: (_, value) =>
          this.updateStateNewGame("playerCount", {
            ...this.props.state.playerCount,
            patrons: Number(value),
          }),
      }),
      e(
        "button",
        { type: "button", onClick: this.props.addGame },
        "Spielrunde speichern"
      )
    );
  }
}

// Sections

class IntroRoleSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateIntroRole = (event) => {
    this.props.updateStateIntro("role", {
      ...this.props.state,
      [event.target.name]: event.target.checked,
    });
  };

  renderSlider() {
    if (this.props.state.player && this.props.state.gamemaster) {
      return e(
        "p",
        {},
        e("strong", {}, "Wähle deine Balance"),
        e(
          "label",
          {},
          "Spielen",
          e("input", {
            type: "range",
            name: "balance",
            min: 1,
            max: 3,
            value: this.props.roleBalance,
            onChange: (event) =>
              this.props.updateStateIntro("role", {
                ...this.props.state,
                roleBalance: Number(event.target.value),
              }),
          }),
          "Spielleiten"
        )
      );
    }
  }

  render() {
    return e(
      React.Fragment,
      {},
      e(CheckmarkGroup, {
        options: [
          {
            label: "Spieler:in",
            name: "player",
            state: this.props.state.player,
            onChange: this.updateStateIntroRole,
          },
          {
            label: "Spielleiter:in",
            name: "gamemaster",
            state: this.props.state.gamemaster,
            onChange: this.updateStateIntroRole,
          },
        ],
        title: "Anmeldung als",
        description: "triff bitte mindestens eine Auswahl",
      }),
      this.renderSlider()
    );
  }
}

class IntroLanguageSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateIntroLanguage = (event) => {
    this.props.updateStateIntro("languages", {
      ...this.props.state,
      [event.target.name]: event.target.checked,
    });
  };

  render() {
    return e(
      React.Fragment,
      {},
      e(CheckmarkGroup, {
        options: [
          {
            label: "Deutsch",
            name: "german",
            state: this.props.state.german,
            onChange: this.updateStateIntroLanguage,
          },
          {
            label: "Englisch",
            name: "english",
            state: this.props.state.english,
            onChange: this.updateStateIntroLanguage,
          },
        ],
        title: "Sprache",
        description: "triff bitte mindestens eine Auswahl",
      })
    );
  }
}

class IntroTimeSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateIntroTime = (day, e) => {
    this.props.updateStateIntro("time", {
      ...this.props.state,
      [day]: {
        ...this.props.state[day],
        [e.target.name]: e.target.checked,
      },
    });
  };

  renderTimeSlots(day) {
    const entries = this.props.state[day];
    return e(CheckmarkGroup, {
      options: Object.keys(entries).map((key) => {
        const e = entries[key];
        return {
          label: key + "Uhr",
          name: key,
          state: e,
          onChange: (event) => this.updateStateIntroTime(day, event),
        };
      }),
    });
  }

  render() {
    return e(
      "div",
      {},
      e("h3", {}, "Samstag"),
      this.renderTimeSlots("saturday"),
      e("h3", {}, "Sonntag"),
      this.renderTimeSlots("sunday")
    );
  }
}

class IntroSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateIntro = (key, value) => {
    this.props.updateState("intro", {
      ...this.props.state,
      [key]: value,
    });
  };

  render() {
    return e(
      "fieldset",
      {},
      e(TextInput, {
        name: "name",
        placeholder: "Name",
        label: "Name",
        required: true,
        state: this.props.state.name,
        handleChange: this.updateStateIntro,
      }),
      e(TextInput, {
        name: "email",
        placeholder: "E-Mail",
        label: "E-Mail",
        required: true,
        state: this.props.state.email,
        handleChange: this.updateStateIntro,
      }),
      e(IntroRoleSection, {
        updateStateIntro: this.updateStateIntro,
        state: this.props.state.role,
      }),
      e(IntroLanguageSection, {
        updateStateIntro: this.updateStateIntro,
        state: this.props.state.languages,
      }),
      e("h2", {}, "Zeitfenster"),
      e(IntroTimeSection, {
        updateStateIntro: this.updateStateIntro,
        state: this.props.state.time,
      })
    );
  }
}

class PlayerSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStatePlayer = (key, value) => {
    this.props.updateState("player", {
      ...this.props.state,
      [key]: value,
    });
  };

  updateStateGrid = (type, e) => {
    this.updateStatePlayer(
      type,
      this.props.state[type].map((entry) => {
        if (e.target.name === entry.name) {
          return { ...entry, status: e.target.value };
        }
        return entry;
      })
    );
  };

  addEntryToGrid = (type, name) => {
    this.updateStatePlayer(type, [
      ...this.props.state[type],
      {
        label: name,
        name: name + Math.round(Math.random() * 10000),
        status: "whatever",
        fix: false,
      },
    ]);
  };

  deleteEntryFromGrid = (type, name) => {
    this.updateStatePlayer(type, [
      ...this.props.state[type].filter((entry) => entry.name !== name),
    ]);
  };

  render() {
    return e(
      "fieldset",
      {},
      e("legend", {}, "Spieler:in"),
      e(RadioGroup, {
        options: [
          {
            label: "kurze aber viele Spielrunden",
            name: "short",
            state: "short" === this.props.state.gameroundTypes,
            onChange: (event) =>
              this.updateStatePlayer("gameroundTypes", event.target.value),
          },
          {
            label: "lange aber wenige Spielrunden",
            name: "long",
            state: "long" === this.props.state.gameroundTypes,
            onChange: (event) =>
              this.updateStatePlayer("gameroundTypes", event.target.value),
          },
          {
            label: "egal",
            name: "whatever",
            state: "whatever" === this.props.state.gameroundTypes,
            onChange: (event) =>
              this.updateStatePlayer("gameroundTypes", event.target.value),
          },
        ],
        groupName: "gameroundTypes",
        title: "Arten von Spielrunden",
      }),
      e(Grid, {
        tiers: [
          {
            label: "gerne",
            name: "yes",
          },
          {
            label: "egal",
            name: "whatever",
          },
          {
            label: "lieber nicht",
            name: "no",
          },
        ],
        state: this.props.state.genres,
        title: "Genres",
        missingEntry: "Vermisst du ein Genre?",
        updateStateGrid: (event) => this.updateStateGrid("genres", event),
        addEntryToGrid: (name) => this.addEntryToGrid("genres", name),
        deleteEntryFromGrid: (name) => this.deleteEntryFromGrid("genres", name),
      }),
      e(Grid, {
        tiers: [
          {
            label: "gerne",
            name: "yes",
          },
          {
            label: "nein Danke",
            name: "no",
          },
        ],
        state: this.props.state.workshops,
        title: "Workshops/Diskussionsrunden",
        missingEntry:
          "Hast du Interesse an einem hier nicht aufgeführten Workshop/Diskussionsrunde?",
        updateStateGrid: (event) => this.updateStateGrid("workshops", event),
        addEntryToGrid: (name) => this.addEntryToGrid("workshops", name),
        deleteEntryFromGrid: (name) =>
          this.deleteEntryFromGrid("workshops", name),
      }),
      e(RadioGroup, {
        title: "Begleitpersonen",
        description:
          "Du kannst bis zu zwei Freunde hier hinzufügen, damit ihr gemeinsam spielen könnt. Ist eure Gruppe grösser, bitten wir euch in mehreren Gruppen aufzuteilen, da es für uns schwierig ist, Platz für so grosse Gruppen zu finden.",
        groupName: "companions",
        options: [0, 1, 2].map((option) => {
          return {
            label: option,
            name: option,
            state: option === this.props.state.companions.count,
            onChange: (event) =>
              this.updateStatePlayer("companions", {
                ...this.props.state.companions,
                count: Number(event.target.value),
              }),
          };
        }),
      }),
      this.props.state.companions.count > 0 &&
        e(TextInput, {
          label:
            "Optional darfst du uns die Namen deiner Freunde hier aufführen.",
          handleChange: (_, value) =>
            this.updateStatePlayer("companions", {
              ...this.props.state.companions,
              names: value,
            }),
        })
    );
  }
}

class GamemasterSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateGamemaster = (key, value) => {
    this.props.updateState("gamemaster", {
      ...this.props.state,
      [key]: value,
    });
  };

  addGame = () => {
    this.updateStateGamemaster("games", [
      ...this.props.state.games,
      this.props.state.gameInEdit,
    ]);
    setTimeout(() => {
      this.updateStateGamemaster("gameInEdit", {});
    }, 0);
  };

  newEmptyGame = () => {
    this.updateStateGamemaster("gameInEdit", {
      id: Math.round(Math.random() * 10000),
      title: "",
      description: "",
      genres: [
        {
          label: "Fantasy",
          checked: false,
        },
        {
          label: "Sci-Fi",
          checked: false,
        },
      ],
      duration: 2,
      playerCount: {
        min: 1,
        max: 6,
        patrons: 0,
      },
    });
  };

  render() {
    return e(
      "fieldset",
      {},
      e("legend", {}, "Spielleiter:in"),
      e(CheckmarkGroup, {
        options: [
          {
            label: "Ja, ich möchte gerne Unterstützung.",
            name: "buddy",
            state: this.props.state.buddy,
            onChange: (event) =>
              this.updateStateGamemaster(
                event.target.name,
                event.target.checked
              ),
          },
        ],
        title: "Buddy-System",
        description:
          "Du hast noch nie ein Rollenspiel geleitet oder möchtest aus einem anderen Grund Unterstützung? Gerne stellen wir dir einen Buddy zur Seite, der dich vor und am Event unterstützt.",
      }),
      e(GamemasterGames, {
        state: this.props.state.games,
      }),
      e(NewGame, {
        state: this.props.state.gameInEdit,
        addGame: this.addGame,
        newEmptyGame: this.newEmptyGame,
        updateStateGamemaster: this.updateStateGamemaster,
      })
    );
  }
}

class OutroSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e("fieldset", {});
  }
}

// Global

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intro: {
        name: "",
        email: "",
        role: { player: false, gamemaster: true, roleBalance: 2 },
        languages: {
          german: true,
          english: false,
        },
        time: {
          saturday: {
            10: false,
            11: false,
          },
          sunday: {
            10: false,
            11: false,
          },
        },
      },
      player: {
        gameroundTypes: "whatever",
        genres: [
          {
            label: "Fantasy",
            name: "fantasy",
            status: "whatever",
            fix: true,
          },
          {
            label: "Sci-Fi",
            name: "scifi",
            status: "whatever",
            fix: true,
          },
        ],
        workshops: [
          {
            label: "Spielleiter Workshop",
            name: "spielleiterworkshop",
            status: "no",
            fix: true,
          },
        ],
        companions: {
          count: 0,
          names: "",
        },
      },
      gamemaster: {
        buddy: false,
        games: [],
        gameInEdit: {},
      },
    };
  }

  updateState = (name, newState) => {
    this.setState({ [name]: newState });
  };

  render() {
    return e(
      "form",
      {
        action:
          "https://api.gildedernacht.ch/form/38f8295ff8bebc869daa5d83466af523c9a1491a19302a2e7dfc0f2ec1692bdf",
        method: "POST",
      },
      e(IntroSection, {
        state: this.state.intro,
        updateState: this.updateState,
      }),
      this.state.intro.role.player &&
        e(PlayerSection, {
          state: this.state.player,
          updateState: this.updateState,
        }),
      this.state.intro.role.gamemaster &&
        e(GamemasterSection, {
          state: this.state.gamemaster,
          updateState: this.updateState,
        }),
      e(OutroSection, {
        state: this.state.outro,
        updateState: this.updateState,
      }),
      e("p", null, JSON.stringify(this.state, null, 2))
    );
  }
}

const domContainer = document.querySelector(".react");
ReactDOM.render(e(Form), domContainer);
