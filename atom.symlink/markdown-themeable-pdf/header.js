/**
 * Your markdown-themeable-pdf custom header.
 * After you have made any changes you need to reload or restart atom.
 *
 * The default file can be found in the folder ~/.atom/packages/markdown-themeable-pdf/templates
 *
 * @param Object For example: {fileInfo: base: "Demo.md", dir: ".../markdown-themeable-pdf/tests", ext: ".md", name: "Demo"}, root: "/", exportType: "pdf", destFileBase: "Demo.pdf", destFile: "......./markdown-themeable-pdf/tests/Demo.pdf"}
 * @returns Object {{height: string, contents: string}}
 */
module.exports = function (info) {
    return {
        height: '2cm',
        contents: '<div style="text-align: right;"><strong>' + info.fileInfo.base + '</strong> to <strong>' + info.destFileBase + '</strong> by <span style="color: #EC4634; font-size: 120%; text-transform: uppercase;">markdown-themeable-pdf</span></div>'
    };
};
