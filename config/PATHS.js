const path = require('path');

// PATHS
const ROOT = path.resolve(__dirname, '../app/');
String.prototype.join = function(target) {
    return path.join(this.toString(), target);
};
module.exports = {
    ROOT: ROOT,
    NODE_MODULES: ROOT.join('../node_modules'),
    LIB: ROOT.join('../lib'),
    BUILD: ROOT.join('build'),
    DIST: ROOT.join('dist'),
    SRC: ROOT.join('src'),
    STATIC: ROOT.join('static')
};

