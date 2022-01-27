const html = require("./helper/html");

function NewsletterForm({ theme, frequenzy }) {
    theme = theme || "Brettspiele";
    frequenzy = frequenzy || "oft";
    return html`
<section>
    <form action="https://gildedernacht.us9.list-manage.com/subscribe/post?u=ac8c826d7db864c54a3c2f001&amp;id=c6bec31754" method="post">
        <h1>Erinnerungs-Newsletter</h1>

        <label>E-Mail-Adresse<input type="email" value="" name="EMAIL" placeholder="E-Mail-Adresse" required=""></label>
        <label>Vorname<input type="text" value="" name="FNAME" placeholder="Vorname" required=""></label>
        <label>Nachname<input type="text" value="" name="LNAME" placeholder="Nachname" required=""></label>

        <h2>Thema</h2>
        <p>Wähle mindestens ein Thema aus, das dich interessiert. Ansonsten wirst du keine E-Mails erhalten.</p>
        <ul role="list" class="checkbox-list">
            <li>
                <label class="input-checkbox">
                    <input type="checkbox" value="128" name="group[48105][128]" ${theme === "Brettspiele" && "checked"}>
                    Brettspiele
                </label>
            </li>
            <li>
                <label class="input-checkbox">
                    <input type="checkbox" value="256" name="group[48105][256]" ${theme === "Rollenspiele" && "checked"}>
                    Rollenspiele
                </label>
            </li>
            <li>
                <label class="input-checkbox">
                    <input type="checkbox" value="512" name="group[48105][512]" ${theme === "Tabletop" && "checked"}>
                    Tabletop
                </label>
            </li>
        </ul>

        <h2>Häufigkeit</h2>
        <p>Wenn du dich für weniger häufige E-Mails entscheidest, werden wir dich hauptsächlich über grössere Events informieren.</p>
        <ul role="list" class="radio-list">
            <li>
                <label class="input-radio">
                    <input type="radio" value="1024" name="group[48109]" ${frequenzy === "oft" && "checked"}>
                    max. 2/Monat
                </label>
            </li>
            <li>
                <label class="input-radio">
                    <input type="radio" value="2048" name="group[48109]" ${frequenzy !== "oft" && checked}>
                    max. 8/Jahr
                </label>
            </li>
        </ul>

        <button type="submit" class="button-accent">Abonnieren</button>
    </form>
</section>
    `;
}

module.exports = { NewsletterForm };
