const { md } = require("../plugins/markdown");
const html = require("./helper/html");

function ImageText(content, opts) {
  return html`<div class="image-text ${opts?.kind ?? ''}">${md.render(content, this)}</div>`;
}


function ImageTextLeft(content) {
  return html`<div class="image-text-left content">${md.render(content, this)}</div>`;
}


function ImageTextRight(content) {
  return html`<div class="image-text-right content">${md.render(content, this)}</div>`;
}

module.exports = { ImageText, ImageTextLeft, ImageTextRight };
