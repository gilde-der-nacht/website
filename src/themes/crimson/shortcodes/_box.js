const html = require("./helper/html");

function Box(content, { type, link, linkLabel }) {
    const linkHtml = (link && linkLabel && html`<a href="${link}" class="button button-small button-${type}"><i class="fa-duotone fa-arrow-turn-down-right event-icon"></i> ${linkLabel}</a>`) || "";
    return html`
    <div class="box-${type}">
        <span>${content}</span>
        ${linkHtml}
    </div>
    `;
}

module.exports = { Box };
