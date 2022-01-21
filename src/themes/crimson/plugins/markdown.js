const markdownIt = require("markdown-it");
const { default: anchor } = require("markdown-it-anchor");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTocDoneRight = require("markdown-it-toc-done-right");
const slugify = require('slugify');

const markdownLib = markdownIt({
    html: true,
    typographer: true,
    quotes: "«»‹›",
    linkify: true,
}).use(markdownItAnchor, {
    permalink: anchor.permalink.headerLink(),
    slugify: (str) => slugify(str, {
        lower: true,
        strict: true,
        locale: 'de'
    })
}).use(markdownItTocDoneRight);
module.exports = markdownLib;
