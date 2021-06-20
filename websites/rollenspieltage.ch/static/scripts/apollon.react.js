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
        onChange: (e) => this.setState({ input: e.target.value }),
        onKeyPress: (e) => e.code === "Enter" && this.addElement(),
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
    return this.props.label + (this.props.required ? " *" : "");
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
        onChange: (e) => this.props.handleChange(e.target.name, e.target.value),
      })
    );
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  getLabel() {
    return this.props.label + (this.props.required ? " *" : "");
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
        onChange: (e) => this.props.handleChange(e.target.name, e.target.value),
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
      button: "->",
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

// Sections

class IntroRoleSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateIntroRole = (e) => {
    this.props.updateStateIntro("role", {
      ...this.props.state,
      [e.target.name]: e.target.checked,
    });
  };

  renderSlider() {
    if (this.props.state.player && this.props.state.gameMaster) {
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
            onChange: (e) =>
              this.props.updateStateIntro("role", {
                ...this.props.state,
                roleBalance: Number(e.target.value),
              }),
          }),
          "Spielleiten"
        )
      );
    }
  }

  render() {
    return e(
      "div",
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
            label: "Spielleiter:in ",
            name: "gameMaster",
            state: this.props.state.gameMaster,
            onChange: this.updateStateIntroRole,
          },
        ],
        title: "Anmeldung als",
        description: "treffe bitte mindestens eine Auswahl",
      }),
      this.renderSlider()
    );
  }
}

class IntroLanguageSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateIntroLanguage = (e) => {
    this.props.updateStateIntro("languages", {
      ...this.props.state,
      [e.target.name]: e.target.checked,
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
        description: "treffe bitte mindestens eine Auswahl",
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
          label: key + " Uhr",
          name: key,
          state: e,
          onChange: (e) => this.updateStateIntroTime(day, e),
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
            onChange: (e) =>
              this.updateStatePlayer("gameroundTypes", e.target.value),
          },
          {
            label: "lange aber wenige Spielrunden",
            name: "long",
            state: "long" === this.props.state.gameroundTypes,
            onChange: (e) =>
              this.updateStatePlayer("gameroundTypes", e.target.value),
          },
          {
            label: "egal",
            name: "whatever",
            state: "whatever" === this.props.state.gameroundTypes,
            onChange: (e) =>
              this.updateStatePlayer("gameroundTypes", e.target.value),
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
        updateStateGrid: (e) => this.updateStateGrid("genres", e),
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
        updateStateGrid: (e) => this.updateStateGrid("workshops", e),
        addEntryToGrid: (name) => this.addEntryToGrid("workshops", name),
        deleteEntryFromGrid: (name) =>
          this.deleteEntryFromGrid("workshops", name),
      }),
      e(NumberInput, {
        label: "Beigleitpersonen",
        description:
          "Du kannst bis zu zwei Freunde hier hinzufügen, damit ihr gemeinsam spielen könnt. Ist eure Gruppe grösser, bitten wir euch in mehreren Gruppen aufzuteilen, da es für uns schwierig ist, Platz für so grosse Gruppen zu finden.",
        state: this.props.state.companions.count,
        min: 0,
        max: 2,
        handleChange: (_, value) =>
          this.updateStatePlayer("companions", {
            ...this.props.state.companions,
            count: value,
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

// Global

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intro: {
        name: "",
        email: "",
        role: { player: true, gameMaster: true, roleBalance: 2 },
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
      e("p", null, JSON.stringify(this.state, null, 4))
    );
  }
}

const domContainer = document.querySelector(".react");
ReactDOM.render(e(Form), domContainer);
