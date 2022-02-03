const { md } = require("../plugins/markdown");
const html = require("./helper/html");

function Slider(content) {
    return html`<div class="slider">${md.render(content, this)}</div>`;
}

module.exports = { Slider };
