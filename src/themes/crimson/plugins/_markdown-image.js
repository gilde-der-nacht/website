const path = require('path');
const Image = require("@11ty/eleventy-img");

function generateImages({ src, outputDir, alt }) {
    console.log({ src, outputDir });
    const options = {
        widths: [600],
        formats: ["avif", "jpeg"],
        outputDir: outputDir
    };
    Image(src, options);
    const metadata = Image.statsSync(src, options);

    // let imageAttributes = {
    //   alt,
    //   sizes: "100vw",
    //   loading: "lazy",
    //   decoding: "async",
    // };
    // return Image.generateHTML(metadata, imageAttributes);
}

function markdownImagePlugin(md, params) {
    const before = md.renderer.rules.image;
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
        var token = tokens[idx];
        const srcAttr = token.attrs[token.attrIndex("src")][1];
        const alt = token.content;
        const { inputPath, outputPath } = env.page;
        const src = path.join(path.dirname(inputPath), srcAttr);
        const outputDir = path.join(path.dirname(outputPath), path.dirname(srcAttr));
        generateImages({ src, outputDir, alt })
        return before(tokens, idx, options, env, self);
    }
}

module.exports = { markdownImagePlugin };
