const fs = require('fs');
const dirArr = [
  './src',
  './src/style',
  './src/style/common',
  './src/js',
  './src/js/common',
  './src/img',
  './src/img/icon',
  './src/img/temp'
];

(function() {
  dirArr.forEach(function(item) {
    if (!fs.existsSync(item))
      fs.mkdirSync(item);
    else
      console.log(item + ' 目录已经创建！')
  });
  fs.open(".gitignore", "w", function(err, fd) {
    const buf = new Buffer(`/.sass-cache/\n.DS_Store\nnode_modules\n.svn\n*.ini\n*.tmp\n*.doc\n*.dll\n*.txt\n*.exe\n*.bat\n*.log\n*.psd\n*.ai`);
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
  });
}());

