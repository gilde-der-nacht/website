const html = require("./helper/html");

function ButtonLink({ link, label }) {
    return html`
        <a href="${link}" class="button button-small button-special">
            <i class="fa-duotone fa-arrow-turn-down-right event-icon"></i>
            ${label}
        </a>
    `;
}

module.exports = { ButtonLink };
