const { md } = require("../plugins/markdown");
const html = require("./helper/html");

function Slider(content, opts) {
    const { size } = Object.assign({}, { size: "default" }, opts)
    return html`<div class="slider slider-${size}">${md.render(content, this)}</div>`;
}

module.exports = { Slider };
