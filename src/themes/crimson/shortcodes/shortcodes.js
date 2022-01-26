const markdownLib = require("../plugins/markdown");
const html = require("./helper/html");
const { EventList, EventFilters } = require("./_event");
const { Form, Input, Textarea } = require("./_form");

function TableContainer(content) {
    return html`<div class="table-container">${markdownLib.render(content)}</div>`;
}

module.exports = { TableContainer, Form, Input, Textarea, EventList, EventFilters };
