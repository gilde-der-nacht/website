function markdownTableContainerPlugin(md, params) {
    params = Object.assign({
        element: "div",
        class: "table-container"
    }, params);

    function createTokenOpen() {
        return {
            type: params.element + "_open",
            tag: params.element,
            attrs: [["class", params.class]],
            nesting: 1
        }
    }

    function createTokenClose() {
        return {
            type: params.element + "_close",
            tag: params.element,
            nesting: -1
        }
    }

    md.core.ruler.push("table-container", function tableContainer({ tokens }) {
        const TABLE_OPEN_TYPE = "table_open";
        const TABLE_CLOSE_TYPE = "table_close";
        let pointer = 0;
        let searchType = TABLE_OPEN_TYPE;

        while (pointer < tokens.length) {
            const foundIndex = tokens.slice(pointer).findIndex(({ type }) => type === searchType);
            if (foundIndex === -1) {
                break;
            }
            pointer = pointer + foundIndex;
            if (searchType === TABLE_OPEN_TYPE) {
                tokens.splice(pointer, 0, createTokenOpen());
                searchType = TABLE_CLOSE_TYPE;
            } else {
                tokens.splice(pointer + 1, 0, createTokenClose());
                searchType = TABLE_OPEN_TYPE;
            }
        }
    });
}

module.exports = markdownTableContainerPlugin;
