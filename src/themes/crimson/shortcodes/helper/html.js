function html(strings, ...expr) {
    return strings
        .reduce((acc, curr, i) => acc + expr[i - 1] + curr)
        .replace(/\n\s*/g, " ");
}

module.exports = html;
