const path = require('path');
const fs = require('fs');
const files = {
    js: {},
    tpl: []
}
const cwd = path.join(__dirname, '../app/src');
const REGS = {
    JS: /\.js$/,
    HTML: /\.(html)$/,
    PUG: /\.(pug)$/
}

function readdir(p, deep = false) {
    fs.readdirSync(p).forEach(function(sPath) {
        const fileName = path.join(p, sPath);
        if (fs.lstatSync(fileName).isDirectory() && sPath != '') {
            if (deep) readdir(fileName, deep);
        } else {
            //if (!/(^(_|grunt|gulp|webpack)|\.map$)/.test(sPath)) {
            const name = path.relative(cwd, fileName);
            if (REGS.JS.test(name)) {
                files.js[path.basename(name, '.js')] = fileName;
            }
            if (REGS.HTML.test(name)) {
                files.tpl.push(path.basename(fileName));
            }
            if (REGS.PUG.test(name)) {
                files.tpl.push(path.basename(fileName));
            }
            //}
        }
    })
};
readdir(cwd, true);
module.exports = {
    entry: files.js,
    template: files.tpl
}
