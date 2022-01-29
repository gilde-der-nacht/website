const markdownIt = require("markdown-it");
const markdownTableContainerPlugin = require("./_markdown-table-container");
const anchor = require("markdown-it-anchor");
const toc = require("markdown-it-toc-done-right");
const slugify = require('slugify');

const customSlugify = (str) => slugify(str, {
    lower: true,
    strict: true,
    locale: 'de'
});

const md = markdownIt({
    html: true,
    typographer: true,
    quotes: "«»‹›",
    linkify: true,
}).use(markdownTableContainerPlugin, {
    element: "div",
    class: "table-container"
}).use(anchor, {
    permalink: anchor.permalink.headerLink(),
    slugify: customSlugify
}).use(toc, {
    level: 2,
    slugify: customSlugify
});
module.exports = { md };
