const html = require("./helper/html");
const { Form, Input, CheckboxList, Checkbox, RadioList, Radio } = require("./_form");

function NewsletterForm({ theme, frequenzy }) {
    theme = theme || "Brettspiele";
    frequenzy = frequenzy || "oft";

    const themeIntro = html`
        <h2>Thema</h2>
        <p>Wähle mindestens ein Thema aus, das dich interessiert.
        <br />Ansonsten wirst du keine E-Mails erhalten.</p>
    `;

    const frequenzyIntro = html`
        <h2>Häufigkeit</h2>
        <p>Wenn du dich für weniger häufigere E-Mails entscheidest <em>(maximal 8 E-Mails / Jahr)</em>,<br />werden wir dich hauptsächlich über grössere Events informieren.</p>
    `;

    return Form({
        action: "https://gildedernacht.us9.list-manage.com/subscribe/post?u=ac8c826d7db864c54a3c2f001&amp;id=c6bec31754",
        submitLabel: "Abonnieren"
    },
        Input({ label: "Vorname", name: "FNAME" }),
        Input({ label: "Nachname", name: "LNAME" }),
        Input({ label: "E-Mail-Adresse", name: "EMAIL", type: "email" }),
        themeIntro,
        CheckboxList(
            Checkbox({ label: "Brettspiele", name: "group[48105][128]", value: "128", checked: theme === "Brettspiele" }),
            Checkbox({ label: "Rollenspiele", name: "group[48105][256]", value: "256", checked: theme === "Rollenspiele" }),
            Checkbox({ label: "Tabletop", name: "group[48105][512]", value: "512", checked: theme === "Tabletop" }),
        ),
        frequenzyIntro,
        RadioList(
            Radio({ label: "maximal 2 E-Mails / Monat", name: "group[48109]", value: "1024", checked: frequenzy === "oft" }),
            Radio({ label: "maximal 8 E-Mails / Jahr", name: "group[48109]", value: "2048", checked: frequenzy !== "oft" }),
        )
    );
}

module.exports = { NewsletterForm };
