const html = require("./helper/html");

function FormShortcode(content, obj) {
    return Form(obj, content);
}

function Form({ uid, action, submitLabel, language = "de" }, ...content) {
    action = typeof uid === "undefined" ? action : "https://api.gildedernacht.ch/form/" + uid;
    submitLabel = typeof submitLabel === "undefined" ? (language === "de" ? "Absenden" : "Submit") : submitLabel;

    return html`
        <form action="${action}" method="POST" ${typeof uid !== "undefined" ? 'id="form-' + uid.substring(0, 4) + '"' : ''}">
            ${content.join("")}
            <button type="submit" class="button-accent">${submitLabel}</button>
        </form>
  `;
}

function Input({ label, name, type, required = true, isHoneypot = false }) {
    return html`
        <label ${isHoneypot ? 'class="honey"' : ''}>${label}
            <input type="${type ? type : 'text'}" name="${name}" placeholder="${label}" ${required ? "required" : ""}/>
        </label>
    `;
}

function HiddenInput({ name, value }) {
    return html`<input type="hidden" name="${name}" value="${value}"/>`;
}

function Textarea({ label, name, required = true }) {
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

module.exports = { Form, FormShortcode, Input, Textarea, CheckboxList, Checkbox, RadioList, Radio, HiddenInput };
