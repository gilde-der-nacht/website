const html = require("./helper/html");

function Form(content, { uid }) {
    return html`
        <form action="https://api.gildedernacht.ch/form/${uid}" method="POST">
            ${content}
            <button type="submit" class="button-accent">Absenden</button>
        </form>
  `;
}

function Input({ label, name, type }) {
    return html`
        <label>${label}
            <input type="${type ? type : 'text'}" name="${name}" placeholder="${label}" required/>
        </label>
    `;
}

function Textarea({ label, name }) {
    return html`
        <label>${label}
            <textarea type="text" name="${name}" placeholder="${label}" required></textarea>
        </label>
    `;
}

module.exports = { Form, Input, Textarea };
