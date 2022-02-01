const path = require('path');
const Image = require("@11ty/eleventy-img");
const html = require('../shortcodes/helper/html');

function fallbackImage(metadata, alt) {
    const lowsrc = metadata.jpeg[0];
    const highsrc = metadata.jpeg[metadata.jpeg.length - 1];
    return html`
        <img
            src="${lowsrc.url}"
            width="${highsrc.width}"
            height="${highsrc.height}"
            alt="${alt}"
            loading="lazy"
            decoding="async"/>
    `;
}

function sources(metadata, sizes) {
    return Object.values(metadata).map(imageFormat => {
        return html`
            <source
                type="${imageFormat[0].sourceType}"
                srcset="${imageFormat.map(entry => entry.srcset).join(", ")}"
                sizes="${sizes}">
        `;
    });
}

function generateHtml({ metadata, alt }) {
    const id = metadata.jpeg[0].filename.substring(0, 10);
    return html`
    <figure aria-labelledby="caption-${id}">
        <picture>
            ${sources(metadata, "100vw").join("\n")}
            ${fallbackImage(metadata, alt)}
        </picture>
        ${alt.length > 0 ? html`<figcaption id="caption-${id}">${alt}</figcaption>` : ""}
    </figure>
  `;
}

function generateImages({ src, outputDir }) {
    const options = {
        widths: [600],
        formats: ["avif", "jpeg"],
        outputDir: outputDir,
        urlPath: path.join("/", outputDir.split(path.sep).slice(2).join(path.sep))
    };
    Image(src, options);
    return Image.statsSync(src, options);
}

function markdownImagePlugin(md, params) {
    const oldRenderer = md.renderer.rules.image;
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
        var token = tokens[idx];
        const srcAttr = token.attrs[token.attrIndex("src")][1];
        const alt = token.content;
        const { inputPath, outputPath } = env.page;
        if (alt === undefined || alt.length === 0) {
            throw new Error(`Missing \`alt\` on responsive image \`${srcAttr}\`!`);
        }
        if (/^http/.test(srcAttr)) {
            return oldRenderer(tokens, idx, options, env, self);
        }
        const src = path.join(path.dirname(inputPath), srcAttr);
        const outputDir = path.join(path.dirname(outputPath), path.dirname(srcAttr));
        const metadata = generateImages({ src, outputDir })
        return generateHtml({ metadata, alt });
    }
}

module.exports = { markdownImagePlugin };
