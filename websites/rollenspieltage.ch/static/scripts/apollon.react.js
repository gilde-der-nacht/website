"use strict";

const e = React.createElement;

// Components

class AddElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
  }

  addElement = (e) => {
    e.preventDefault();
    if (this.state.input.length === 0) {
      return;
    }
    this.props.handleClick(this.state.input);
    this.setState({ input: "" });
  };

  render() {
    return e(
      "label",
      { className: "c-apollon-input-and-button" },
      e("span", {}, this.props.label),
      e("input", {
        type: "text",
        value: this.state.input,
        onChange: (event) => this.setState({ input: event.target.value }),
        onKeyPress: (event) => event.code === "Enter" && this.addElement(event),
      }),
      e(
        "button",
        {
          onClick: this.addElement,
          className: "c-btn",
        },
        this.props.icon ? e("i", { className: this.props.icon }) : "",
        " ",
        this.props.button
      )
    );
  }
}

class NumberInput extends React.Component {
  constructor(props) {
    super(props);
  }

  getLabel = () => {
    return this.props.label + (this.props.required ? " *" : "");
  };

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

class TextArea extends React.Component {
  constructor(props) {
    super(props);
  }

  getLabel = () => {
    return this.props.label + (this.props.required ? " *" : "");
  };

  render() {
    return e(
      "label",
      {},
      this.getLabel(),
      e("textarea", {
        name: this.props.name,
        placeholder: this.props.placeholder,
        required: this.props.required,
        value: this.props.state,
        onChange: this.props.onChange,
      })
    );
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  getLabel = () => {
    return this.props.label + (this.props.required ? " *" : "");
  };

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
        { className: this.props.state ? "active" : "" },
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

  renderCheckmarks = () => {
    return this.props.options.map((option) =>
      e("li", null, e(Checkmark, option))
    );
  };

  render() {
    return e(
      "div",
      { className: this.props.className },
      this.props.title &&
        e(
          this.props.headingLevel ? "h" + this.props.headingLevel : "h3",
          {},
          this.props.title
        ),
      this.props.description && e("p", {}, this.props.description),
      e("ul", null, ...this.renderCheckmarks())
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
        { className: this.props.state ? "active" : "" },
        e("input", {
          type: "radio",
          name: this.props.groupName,
          value: this.props.name,
          checked: this.props.state,
          onChange: this.props.onChange,
        }),
        this.props.icon
          ? e("i", { className: this.props.icon })
          : this.props.label
      )
    );
  }
}

class RadioGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  renderRadios = () => {
    return this.props.options.map((option) =>
      e(Radio, { ...option, groupName: this.props.groupName })
    );
  };

  render() {
    return e(
      React.Fragment,
      {},
      this.props.title && e("h3", {}, this.props.title),
      this.props.description && e("p", {}, this.props.description),
      e(
        "div",
        {
          className:
            "c-apollon-radio-group " +
            (this.props.className ? this.props.className : ""),
          style: this.props.style || {},
        },
        ...this.renderRadios()
      )
    );
  }
}

class GridLabel extends React.Component {
  constructor(props) {
    super(props);
  }

  renderDeleteButton = () => {
    return e(
      "button",
      {
        className: "c-btn delete",
        onClick: this.props.onClick,
      },
      e("i", { className: "fas fa-trash" })
    );
  };

  render() {
    return e(
      React.Fragment,
      {},
      e(
        "h4",
        {},
        this.props.children,
        !this.props.fix && this.renderDeleteButton()
      )
    );
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
  }

  buildOptions = (entry) => {
    const iconMap = {
      yes: "fas fa-plus-square",
      whatever: "fas fa-question-square",
      no: "fas fa-minus-square",
    };
    return this.props.tiers.map((tier) => {
      return {
        icon: iconMap[tier.name],
        name: tier.name,
        state: tier.name === entry.status,
        onChange: this.props.updateStateGrid,
      };
    });
  };

  renderList = () => {
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
          i18n[this.props.type].list[entry.name]
            ? i18n[this.props.type].list[entry.name]
            : entry.label
        ),
        e(RadioGroup, {
          options: this.buildOptions(entry),
          groupName: entry.name,
        })
      );
    });
  };

  renderAddEntry = () => {
    return e(AddElement, {
      name: "newEntry",
      label: this.props.missingEntry,
      icon: "fas fa-plus-square",
      button: i18n[this.props.type].addLabel,
      handleClick: this.props.addEntryToGrid,
    });
  };

  render() {
    return e(
      "div",
      {},
      e("h3", {}, this.props.title),
      e(
        "div",
        {
          className:
            "c-apollon-grid" +
            (this.props.type === "genres" ? " four" : " three"),
        },
        e(
          "div",
          { className: "c-apollon-grid-header" },
          this.props.tiers.map((tier) =>
            e("h4", { key: tier.name }, tier.label)
          )
        ),
        ...this.renderList()
      ),
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
      e("h3", null, i18n.gamemastering.gameroundTitle),
      this.props.state.map((entry) =>
        e(
          "div",
          { key: entry.id, className: "c-apollon-round-entry" },
          e(
            "button",
            {
              className: "c-btn",
              onClick: (e) => {
                e.preventDefault();
                this.props.editGame(entry.id);
              },
            },
            e("i", { className: "fas fa-pen" }),
            " ",
            i18n.gamemastering.editGameround
          ),
          e("h3", {}, entry.title),
          e("p", {}, entry.description),
          e(
            "p",
            {},
            i18n.genres.title +
              ": " +
              entry.genres
                .filter((genre) => genre.checked)
                .map((genre) => genre.label)
                .join(", ")
          ),
          e(
            "p",
            {},
            i18n.gamemastering.duration +
              ": " +
              entry.duration +
              " " +
              i18n.gamemastering.hours +
              (entry.duration === 1 ? "" : "n")
          ),
          e(
            "p",
            {},
            i18n.gamemastering.playerCount +
              ": " +
              entry.playerCount.min +
              (entry.playerCount.max > entry.playerCount.min
                ? " - " + entry.playerCount.max
                : "")
          ),
          entry.playerCount.patrons > 0 &&
            e(
              "p",
              {},
              i18n.gamemastering.patrons.description +
                ": " +
                entry.playerCount.patrons
            )
        )
      )
    );
  }
}

class EditGame extends React.Component {
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
  validateGenres = (genres) => {
    return !genres.reduce(
      (acc, cur) => (cur.checked ? cur.checked : acc),
      false
    );
  };

  validate = () => {
    const errorKeys = [];
    const { title, description, genres, playerCount } = this.props.state;
    if (title.length === 0) {
      errorKeys.push("editMissingTitle");
    }
    if (description.length === 0) {
      errorKeys.push("editMissingDescription");
    }
    if (this.validateGenres(genres)) {
      errorKeys.push("editMissingGenres");
    }
    const { min, max } = playerCount;
    if (min > max) {
      errorKeys.push("editMaxSmallerThanMin");
    }
    return errorKeys;
  };

  render() {
    if (Object.entries(this.props.state).length === 0) {
      return e(
        "button",
        {
          className: "c-apollon-round-entry new-entry",
          onClick: this.props.newEmptyGame,
        },
        e("i", { className: "fas fa-plus-square" }),
        " " + i18n.gamemastering.addAGameround
      );
    }

    return e(
      React.Fragment,
      {},
      e(TextInput, {
        name: "title",
        placeholder: i18n.gamemastering.gameTitle,
        label: i18n.gamemastering.gameTitle,
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
        title: i18n.genres.title,
        headingLevel: 4,
        description: i18n.info.chooseAtLeastOneOption,
        className: "c-apollon-options",
      }),
      e(AddElement, {
        name: "newGenre",
        label: i18n.genres.missingGenre,
        button: i18n.genres.addLabel,
        icon: "fas fa-plus-square",
        handleClick: (name) =>
          this.updateStateNewGame("genres", [
            ...this.props.state.genres,
            { label: name, checked: true },
          ]),
      }),
      e(NumberInput, {
        label: i18n.gamemastering.duration,
        state: this.props.state.duration,
        required: true,
        min: 1,
        max: 12,
        handleChange: (_, value) =>
          this.updateStateNewGame("duration", Number(value)),
      }),
      e("h4", {}, i18n.gamemastering.playerCount),
      e(NumberInput, {
        label: i18n.gamemastering.minimum,
        state: this.props.state.playerCount.min,
        required: true,
        min: 1,
        max: 100,
        handleChange: (_, value) =>
          this.updateStateNewGame("playerCount", {
            ...this.props.state.playerCount,
            min: Number(value),
          }),
      }),
      e(NumberInput, {
        label: i18n.gamemastering.maximum,
        state: this.props.state.playerCount.max,
        required: true,
        min: 1,
        max: 100,
        handleChange: (_, value) =>
          this.updateStateNewGame("playerCount", {
            ...this.props.state.playerCount,
            max: Number(value),
          }),
      }),
      e(NumberInput, {
        label: i18n.gamemastering.patrons.title,
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
      e(ValidationSection, {
        errors: this.validate(),
      }),
      e(
        "div",
        { className: "c-apollon-horizontal" },
        e(
          "button",
          {
            className: "c-btn",
            onClick: this.props.deleteGame,
          },
          e("i", { className: "fas fa-trash" }),
          " ",
          i18n.gamemastering.deleteGameround
        ),
        e(
          "button",
          {
            className: "c-btn",
            disabled: this.validate().length > 0,
            styles: "margin-left: 10px",
            onClick: this.props.addGame,
          },
          e("i", { className: "fas fa-save" }),
          " ",
          i18n.gamemastering.saveGameround
        )
      )
    );
  }
}

// Sections

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
        title: i18n.languages.title,
        description: i18n.info.chooseAtLeastOneOption,
        className: "c-apollon-options",
        options: [
          {
            label: i18n.languages.de,
            name: "german",
            state: this.props.state.german,
            onChange: this.updateStateIntroLanguage,
          },
          {
            label: i18n.languages.en,
            name: "english",
            state: this.props.state.english,
            onChange: this.updateStateIntroLanguage,
          },
        ],
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

  renderTimeSlots = (day) => {
    const entries = this.props.state[day];
    return e(CheckmarkGroup, {
      options: Object.keys(entries).map((key) => {
        const e = entries[key];
        return {
          label:
            key +
            " " +
            String.fromCharCode(8211) +
            " " +
            (Number(key) + 1) +
            " " +
            i18n.time.hour,
          name: key,
          state: e,
          onChange: (event) => this.updateStateIntroTime(day, event),
        };
      }),
    });
  };

  render() {
    return e(
      "div",
      { className: "c-apollon-timetable" },
      e(
        "div",
        {},
        e("h3", {}, i18n.weekdays.saturday),
        this.renderTimeSlots("saturday")
      ),
      e(
        "div",
        {},
        e("h3", {}, i18n.weekdays.sunday),
        this.renderTimeSlots("sunday")
      )
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
      e("h2", null, i18n.phases.intro),
      e(TextInput, {
        name: "name",
        placeholder: i18n.fields.name,
        label: i18n.fields.name,
        required: true,
        state: this.props.state.name,
        handleChange: this.updateStateIntro,
      }),
      e(TextInput, {
        name: "email",
        placeholder: i18n.fields.mail,
        label: i18n.fields.mail,
        required: true,
        state: this.props.state.email,
        handleChange: this.updateStateIntro,
      }),
      e(IntroLanguageSection, {
        updateStateIntro: this.updateStateIntro,
        state: this.props.state.languages,
      }),
      e("h3", {}, i18n.time.title),
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
      e("h2", {}, i18n.phases.gaming),
      e(CheckmarkGroup, {
        options: [
          {
            label: i18n.gaming.participate,
            name: i18n.gaming.participate,
            state: this.props.state.role,
            onChange: (e) => this.updateStatePlayer("role", e.target.checked),
          },
        ],
        className: "c-apollon-checkmark-group",
      }),
      e(
        "div",
        { className: this.props.state.role ? "" : "disabled" },
        e(RadioGroup, {
          options: [
            {
              label: i18n.gaming.gameroundTypes.short,
              name: "short",
              state: "short" === this.props.state.gameroundTypes,
              onChange: (event) =>
                this.updateStatePlayer("gameroundTypes", event.target.value),
            },
            {
              label: i18n.gaming.gameroundTypes.whatever,
              name: "whatever",
              state: "whatever" === this.props.state.gameroundTypes,
              onChange: (event) =>
                this.updateStatePlayer("gameroundTypes", event.target.value),
            },
            {
              label: i18n.gaming.gameroundTypes.long,
              name: "long",
              state: "long" === this.props.state.gameroundTypes,
              onChange: (event) =>
                this.updateStatePlayer("gameroundTypes", event.target.value),
            },
          ],
          groupName: "gameroundTypes",
          title: i18n.gaming.gameroundTypes.title,
          className: "c-apollon-horizontal",
        }),
        e(Grid, {
          tiers: [
            {
              label: i18n.genres.preferences.yes,
              name: "yes",
            },
            {
              label: i18n.genres.preferences.whatever,
              name: "whatever",
            },
            {
              label: i18n.genres.preferences.no,
              name: "no",
            },
          ],
          state: this.props.state.genres,
          type: "genres",
          title: i18n.genres.title,
          missingEntry: i18n.genres.missingGenre,
          updateStateGrid: (event) => this.updateStateGrid("genres", event),
          addEntryToGrid: (name) => this.addEntryToGrid("genres", name),
          deleteEntryFromGrid: (name) =>
            this.deleteEntryFromGrid("genres", name),
        }),
        this.props.state.workshops.length === 0
          ? ""
          : e(Grid, {
              tiers: [
                {
                  label: i18n.workshops.preferences.yes,
                  name: "yes",
                },
                {
                  label: i18n.workshops.preferences.no,
                  name: "no",
                },
              ],
              state: this.props.state.workshops,
              type: "workshops",
              title: i18n.workshops.title,
              missingEntry: i18n.workshops.missingWorkshop,
              updateStateGrid: (event) =>
                this.updateStateGrid("workshops", event),
              addEntryToGrid: (name) => this.addEntryToGrid("workshops", name),
              deleteEntryFromGrid: (name) =>
                this.deleteEntryFromGrid("workshops", name),
            }),
        e(RadioGroup, {
          title: i18n.gaming.companions.title,
          description: i18n.gaming.companions.description,
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
          className: "c-apollon-horizontal",
          style: { marginBottom: "1rem" },
        }),
        this.props.state.companions.count > 0 &&
          e(TextInput, {
            label: i18n.gaming.companions.names,
            handleChange: (_, value) =>
              this.updateStatePlayer("companions", {
                ...this.props.state.companions,
                names: value,
              }),
          })
      )
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

  addGame = (e) => {
    e.preventDefault();
    this.updateStateGamemaster("games", [
      ...this.props.state.games,
      this.props.state.gameInEdit,
    ]);
    setTimeout(() => {
      this.updateStateGamemaster("gameInEdit", {});
    }, 0);
  };

  deleteGame = () => {
    this.updateStateGamemaster("gameInEdit", {});
  };

  newEmptyGame = () => {
    this.updateStateGamemaster("gameInEdit", {
      id: Math.round(Math.random() * 10000),
      title: "",
      description: "",
      genres: [
        {
          label: i18n.genres.list.fantasy,
          checked: false,
        },
        {
          label: i18n.genres.list.scifi,
          checked: false,
        },
        {
          label: i18n.genres.list.horror,
          checked: false,
        },
        {
          label: i18n.genres.list.crime,
          checked: false,
        },
        {
          label: i18n.genres.list.modern,
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

  editGame = (id) => {
    const game = this.props.state.games.find((game) => game.id === id);

    this.updateStateGamemaster("gameInEdit", { ...game });

    setTimeout(() => {
      this.updateStateGamemaster(
        "games",
        this.props.state.games.filter((game) => game.id !== id)
      );
    }, 0);
  };

  render() {
    return e(
      "fieldset",
      {},
      e("h2", {}, i18n.phases.gamemastering),
      e(CheckmarkGroup, {
        options: [
          {
            label: i18n.gamemastering.participate,
            name: i18n.gamemastering.participate,
            state: this.props.state.role,
            onChange: (e) =>
              this.updateStateGamemaster("role", e.target.checked),
          },
        ],
        className: "c-apollon-checkmark-group",
      }),
      e(
        "div",
        {
          className: this.props.state.role ? "" : "disabled",
        },
        e(CheckmarkGroup, {
          options: [
            {
              label: i18n.gamemastering.buddy.option,
              name: "buddy",
              state: this.props.state.buddy,
              onChange: (event) =>
                this.updateStateGamemaster(
                  event.target.name,
                  event.target.checked
                ),
            },
          ],
          title: i18n.gamemastering.buddy.title,
          description: i18n.gamemastering.buddy.description,
          className: "c-apollon-checkmark-group",
        }),
        e(GamemasterGames, {
          state: this.props.state.games,
          editGame: this.editGame,
        }),
        e(EditGame, {
          state: this.props.state.gameInEdit,
          addGame: this.addGame,
          deleteGame: this.deleteGame,
          newEmptyGame: this.newEmptyGame,
          updateStateGamemaster: this.updateStateGamemaster,
        })
      )
    );
  }
}

class OutroSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateOutro = (key, value) => {
    this.props.updateState("outro", {
      ...this.props.state,
      [key]: value,
    });
  };

  render() {
    return e(
      "fieldset",
      {},
      e("h2", null, i18n.phases.outro),
      e(CheckmarkGroup, {
        title: i18n.helping.title,
        description: i18n.helping.description,
        className: "c-apollon-options",
        options: this.props.state.helping.map((help) => {
          return {
            label: i18n.helping.tasks[help.name],
            name: help.name,
            state: help.status,
            onChange: (e) => {
              this.updateStateOutro(
                "helping",
                this.props.state.helping.map((help) => {
                  if (e.target.name === help.name) {
                    return { ...help, status: e.target.checked };
                  }
                  return help;
                })
              );
            },
          };
        }),
      }),
      e(TextArea, {
        label: i18n.questions,
        state: this.props.state.questions,
        onChange: (e) => {
          this.updateStateOutro("questions", e.target.value);
        },
      })
    );
  }
}
class StepSection extends React.Component {
  constructor(props) {
    super(props);
    this.steps = [
      {
        step: 1,
        name: i18n.phases.intro,
      },
      {
        step: 2,
        name: i18n.phases.gaming,
      },
      {
        step: 3,
        name: i18n.phases.gamemastering,
      },
      {
        step: 4,
        name: i18n.phases.outro,
      },
    ];
  }

  updateStateStep = (e, step) => {
    e.preventDefault();
    if (step >= 1 && step <= this.steps.length) {
      this.props.updateState("step", step);
    }
  };

  render() {
    return e(
      "ul",
      { className: "c-apollon-steps" },
      this.steps.map((step) =>
        e(
          "li",
          {
            className: this.props.state === step.step ? "active" : "",
            key: step.step,
          },
          e(
            "button",
            { onClick: (e) => this.updateStateStep(e, step.step) },
            e("small", null, step.step),
            e("br"),
            step.name
          )
        )
      )
    );
  }
}

class FooterSection extends React.Component {
  constructor(props) {
    super(props);
  }

  updateStateStep = (e, step) => {
    e.preventDefault();
    if (step >= 1 && step <= 4) {
      this.props.updateState("step", step);
    }
  };

  render() {
    return e(
      "ul",
      { className: "c-apollon-footer" },
      e(
        "li",
        {
          className: this.props.state === 1 ? "disabled" : "",
        },
        this.props.state > 1
          ? e(
              "button",
              { onClick: (e) => this.updateStateStep(e, this.props.state - 1) },
              "« " + i18n.phases.back
            )
          : ""
      ),
      e("li", {}, this.props.state + " / 4"),
      e(
        "li",
        {},
        this.props.state === 4
          ? e(
              "button",
              {
                className: "c-btn",
                disabled: this.props.errors.length > 0,
              },
              i18n.phases.submit
            )
          : e(
              "button",
              { onClick: (e) => this.updateStateStep(e, this.props.state + 1) },
              i18n.phases.next + " »"
            )
      )
    );
  }
}

class ValidationSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.errors.map((errorKey) => {
      return e(
        "p",
        { className: "c-apollon-error-message", key: errorKey },
        i18n.errors[errorKey]
      );
    });
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
        languages: {
          german: true,
          english: false,
        },
        time: {
          saturday: {
            10: false,
            11: false,
            12: false,
            13: false,
            14: false,
            15: false,
            16: false,
            17: false,
            18: false,
            19: false,
            20: false,
            21: false,
            22: false,
            23: false,
          },
          sunday: {
            10: false,
            11: false,
            12: false,
            13: false,
            14: false,
            15: false,
            16: false,
            17: false,
            18: false,
            19: false,
            20: false,
          },
        },
      },
      player: {
        role: true,
        gameroundTypes: "whatever",
        genres: [
          {
            name: "fantasy",
            status: "whatever",
            fix: true,
          },
          {
            name: "scifi",
            status: "whatever",
            fix: true,
          },
          {
            name: "horror",
            status: "whatever",
            fix: true,
          },
          {
            name: "crime",
            status: "whatever",
            fix: true,
          },
          {
            name: "modern",
            status: "whatever",
            fix: true,
          },
        ],
        workshops: [
          {
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
        role: false,
        buddy: false,
        games: [],
        gameInEdit: {},
      },
      outro: {
        helping: [
          {
            name: "logistics",
            status: false,
          },
          {
            name: "finance",
            status: false,
          },
          {
            name: "kitchen",
            status: false,
          },
        ],
        questions: "",
      },
      step: 1,
    };
  }

  validateTime = ({ saturday, sunday }) => {
    const sat = Object.values(saturday).reduce((acc, cur) => {
      return cur ? cur : acc;
    }, false);
    const sun = Object.values(sunday).reduce((acc, cur) => {
      return cur ? cur : acc;
    }, false);
    return !sat && !sun;
  };

  validate = () => {
    const errorKeys = [];
    const { name, email, languages, time } = this.state.intro;
    if (name.length === 0) {
      errorKeys.push("missingName");
    }
    if (email.length === 0) {
      errorKeys.push("missingEmail");
    }
    if (languages.english === false && languages.german === false) {
      errorKeys.push("noLanguageSelected");
    }
    if (this.validateTime(time)) {
      errorKeys.push("noTimeSelected");
    }
    return errorKeys;
  };

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
      e(StepSection, {
        state: this.state.step,
        updateState: this.updateState,
      }),
      this.state.step === 1 &&
        e(IntroSection, {
          state: this.state.intro,
          updateState: this.updateState,
        }),
      this.state.step === 2 &&
        e(PlayerSection, {
          state: this.state.player,
          updateState: this.updateState,
        }),
      this.state.step === 3 &&
        e(GamemasterSection, {
          state: this.state.gamemaster,
          updateState: this.updateState,
        }),
      this.state.step === 4 &&
        e(OutroSection, {
          state: this.state.outro,
          updateState: this.updateState,
        }),
      this.state.step === 4 &&
        e(ValidationSection, {
          errors: this.validate(),
        }),
      e(FooterSection, {
        state: this.state.step,
        updateState: this.updateState,
        errors: this.validate(),
      }),
      e("code", null, JSON.stringify(this.state, null, 2))
    );
  }
}

const domContainer = document.querySelector(".react");
ReactDOM.render(e(Form), domContainer);
