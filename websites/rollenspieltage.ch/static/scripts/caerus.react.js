"use strict";

const e = React.createElement;

const SERVER = "https://api.gildedernacht.ch";

const RESOURCE_UID =
    "0772921bf66ee83a536f464068d8a97137719a26e6fa16354b75b38c4dc75424";


class ProgramDay extends React.Component {
    constructor(props) {
        super(props);
    }

    getAggregate = () => {
        const list = [];
        Object.entries(this.props.state).forEach(([hour, details]) => {
            const lastEntry = list.length ? list[list.length - 1] : { details: { game_id: undefined } };

            if (hour === "12" && this.props.title === "Samstag, 28. August 2021") {
                list.push({ hour, details: { title: "Mittagessen (Kiosk verfügbar)" }, duration: 1 })
            } else if (hour === "12") {
                list.push({ hour, details: { title: "Mittagessen (warme Küche mit Menü verfügbar)" }, duration: 1 })
            } else if (hour === "19") {
                list.push({ hour, details: { title: "Abendessen (warme Küche mit Menü verfügbar)" }, duration: 1 })
            } else if (details === null) {
                if (lastEntry.details === null) {
                    lastEntry.duration += 1;
                } else {
                    list.push({ hour, details, duration: 1 });
                }
            } else {
                if (lastEntry.details === null) {
                    list.push({ hour, details, duration: 1 });
                } else if (lastEntry.details.game_id === details.game_id) {
                    lastEntry.duration += 1;
                } else {
                    list.push({ hour, details, duration: 1 });
                }
            }
        });
        return list;
    }

    render() {

        return e(React.Fragment, null,
            e("h3", null, this.props.title),
            e("ul", { className: "c-caerus-list" },
                this.getAggregate().map(({ hour, details, duration }) => {
                    if (details === null) {
                        return e("li", { key: hour, className: "c-caerus-entry c-caerus-free c-caerus-duration-" + duration },
                            e("span", null, hour + " Uhr",
                                duration > 1 && e("br"),
                                duration > 1 && e("em", null, "bis"),
                                duration > 1 && e("br"),
                                duration > 1 && e("em", null, (Number(hour) + duration) + " Uhr")
                            ),
                            e("span", null, "Frei"),
                        )
                    }

                    if (details.title === "Mittagspause" || details.title === "Znachtpause") {
                        return e("li", { key: hour, className: "c-caerus-entry c-caerus-eat c-caerus-duration-" + duration },
                            e("span", null, hour + " Uhr"),
                            e("span", null, details.title)
                        );
                    }

                    return e("li", { key: hour, className: "c-caerus-entry c-caerus-program-entry c-caerus-duration-" + duration },
                        e("span", null, hour + " Uhr",
                            duration > 1 && e("br"),
                            duration > 1 && e("em", null, "bis"),
                            duration > 1 && e("br"),
                            duration > 1 && e("em", null, (Number(hour) + duration) + " Uhr")
                        ),
                        e("span", null,
                            details.title + " [#" + details.game_id + "]",
                            details.is_organiser && e("span", null, "(Leitung)"),
                            details.is_organiser && e("span", null, details.attendees_str),
                        ),
                    );
                })
            )
        );
    }
}

class Program extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    loadPrevState = async () => {
        const olymp = new Olymp({ server: SERVER });
        return await olymp
            .getRegistration(RESOURCE_UID, this.state.secret)
            .then((data) => data.privateBody);
    };

    componentDidMount = async () => {
        const params = await new URLSearchParams(window.location.search);
        this.setState({ secret: params.get("secret") });

        try {
            const prevState = await this.loadPrevState();
            this.setState(prevState);
        } catch (e) {
            console.error(e);
        }
    }

    getProgramAt = (day) => {
        if (!this.state.calendar) {
            return;
        }
        const days = {
            saturday: {},
            sunday: {},
        }
        Object.entries(this.state.calendar).forEach(([time, details]) => {
            const [day, clock] = time.split(" ");
            const [hour, _] = clock.split(":");
            days[day][hour] = details;
        });

        return days[day]
    }

    availableAt = (day) => {
        if (!this.state.calendar) {
            return;
        }
        return !!Object.values(this.getProgramAt(day)).length
    }

    render() {
        return e(
            React.Fragment, null,
            e("h2", null, "Für ",
                e("span", { className: "c-caerus-name" }, this.state.name),
                this.state.companion_count > 0 && e("br"),
                this.state.companion_count > 0 && e("span", null, "und ", e("span", { className: "c-caerus-friend-list" }, this.state.companion_names.join(" und "))),
            ),
            this.availableAt("saturday") && e(ProgramDay, { state: this.getProgramAt("saturday"), title: "Samstag, 28. August 2021" }),
            this.availableAt("sunday") && e(ProgramDay, { state: this.getProgramAt("sunday"), title: "Sonntag, 29. August 2021" }),
            this.state.helping && this.state.helping.length > 0 && e("h4", null, "Helfereinteilung"),
            this.state.helping && this.state.helping.length > 0 && "Die finale Helfereinteilung wurde noch nicht gemacht. Du wirst demnächst kontaktiert deswegen.",
            // e("hr"),
            // e("pre", null, JSON.stringify(this.state, null, 2))
        );
    }
}

const domContainer = document.querySelector(".react");
ReactDOM.render(e(Program), domContainer);
