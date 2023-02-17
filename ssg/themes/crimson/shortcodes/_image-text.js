const { md } = require("../plugins/markdown");
const html = require("./helper/html");

function ImageText(content) {
  return html`<div class="image-text">${md.render(content, this)}</div>`;
}


function ImageTextLeft(content) {
  return html`<div class="image-text-left content">${md.render(content, this)}</div>`;
}


function ImageTextRight(content) {
  return html`<div class="image-text-right content">${md.render(content, this)}</div>`;
}

module.exports = { ImageText, ImageTextLeft, ImageTextRight };
