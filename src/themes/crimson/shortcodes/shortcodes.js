function TableContainer(content) {
    return `<div class="table-container">${content}</div>`;
}

function Form(content, { uid }) {
    return `
<form action="https://api.gildedernacht.ch/form/${uid}"
method="POST">${content}<button type="submit" class="button-accent">Absenden</button></form>
  `;
}

function Input({ label, name, type }) {
    return `
<label>${label}
    <input type="${type ? type : 'text'}" name="${name}" placeholder="${label}" required></input>
</label>
    `;
}

function Textarea({ label, name }) {
    return `
<label>${label}
    <textarea type="text" name="${name}" placeholder="${label}" required></textarea>
</label>
    `;
}

module.exports = { TableContainer, Form, Input, Textarea };
