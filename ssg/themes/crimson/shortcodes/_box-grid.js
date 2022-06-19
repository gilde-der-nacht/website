const { md } = require("../plugins/markdown");
const html = require("./helper/html");

function BoxGrid(content) {
    return html`
    <div class="box-grid">
        ${md.render(content)}
    </div>
    `;
}

module.exports = { BoxGrid };
