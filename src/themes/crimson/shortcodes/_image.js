const Image = require("@11ty/eleventy-img");
const html = require("./helper/html");

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


async function ImageShortcode({ src, alt = "" }) {
    console.log({ page: this });
    const metadata = await Image(src, {
        widths: [300, 600],
        formats: ['webp', 'jpeg'],
        outputDir: "./_site/" + "gildedernacht.ch" + "/images",
        urlPath: "/images/"
    });

    const id = metadata.jpeg[0].filename.substring(0, 10);
    return html`
        <figure aria-labelledby="caption-${id}">
            <picture>
                ${sources(metadata, "100vw").join("\n")}
                ${fallbackImage(metadata, alt)}
            </picture>
            <figcaption id="caption-${id}">${alt}</figcaption>
        </figure>
      `;
}

module.exports = { ImageShortcode };
