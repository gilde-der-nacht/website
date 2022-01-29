const html = require("./helper/html");

function Form({ uid, action, submitLabel, language }, ...content) {
    language = language || "de";
    action = typeof uid === "undefined" ? action : "https://api.gildedernacht.ch/form/" + uid;
    submitLabel = typeof submitLabel === "undefined" ? (language === "de" ? "Absenden" : "Submit") : submitLabel;

    return html`
        <form action="${action}" method="POST">
            ${content.join("")}
            <button type="submit" class="button-accent">${submitLabel}</button>
        </form>
  `;
}

function Input({ label, name, type, required }) {
    required = typeof required === "undefined" ? true : required;

    return html`
        <label>${label}
            <input type="${type ? type : 'text'}" name="${name}" placeholder="${label}" ${required ? "required" : ""}/>
        </label>
    `;
}

function Textarea({ label, name, required }) {
    required = typeof required === "undefined" ? true : required;

    return html`
        <label>${label}
            <textarea type="text" name="${name}" placeholder="${label}" ${required ? "required" : ""}></textarea>
        </label>
    `;
}

function CheckboxList(...content) {
    return html`<ul role="list" class="checkbox-list">${content.join("")}</ul>`;
}

function Checkbox({ label, name, value, checked }) {
    return html`
        <li>
            <label class="input-checkbox">
                <input type="checkbox" value="${value}" name="${name}" ${checked ? "checked" : ""}>
                ${label}
            </label>
        </li>
    `;
}

function RadioList(...content) {
    return html`<ul role="list" class="radio-list">${content.join("")}</ul>`;
}

function Radio({ label, name, value, checked }) {
    return html`
        <li>
            <label class="input-radio">
                <input type="radio" value="${value}" name="${name}" ${checked ? "checked" : ""}>
                ${label}
            </label>
        </li>
    `;
}

module.exports = { Form, Input, Textarea, CheckboxList, Checkbox, RadioList, Radio };
