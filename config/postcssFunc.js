const postcssFunc = {
    calculatesn: function(css) {
        css.walkRules(function(rule) {
            rule.walkDecls(function(decl, i) {
                decl.value = decl.value.replace(/(\d*\.?\d+)pm/ig, function(str) {
                    return (parseFloat(str) / 2) + 'px';
                });
                decl.value = decl.value.replace(/(\d*\.?\d+)rm/ig, function(str) {
                    return (parseFloat(str) / 64) + 'rem';
                })
            })
        });
    },
    postcssMedia: function(css) {
        css.walkRules(function(rule) {
            rule.walkDecls(function(decl, i) {
                if (rule.parent.params != 'undefined') {
                    var mv = rule.parent.params;
                    var mtv = {
                        'iphone4': 'screen and (device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)',
                        'iphone45': 'screen and (device-width: 320px) and (-webkit-device-pixel-ratio: 2)',
                        'iphone5': 'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
                        'iphone6': 'only screen and (min-device-width: 375px) and (max-device-width: 667px) and (orientation: portrait)',
                        'iphone6p': 'only screen and (min-device-width: 414px) and (max-device-width: 736px) and (orientation: portrait)',
                        'landscape': 'screen and (orientation: landscape)'
                    }
                    switch (mv) {
                        case '(iphone4)':
                            return rule.parent.params = mtv.iphone4;
                            break;
                        case '(iphone5)':
                            return rule.parent.params = mtv.iphone5;
                            break;
                        case '(iphone45)':
                            return rule.parent.params = mtv.iphone45;
                            break;
                        case '(iphone6)':
                            return rule.parent.params = mtv.iphone6;
                            break;
                        case '(iphone6p)':
                            return rule.parent.params = mtv.iphone6p;
                            break;
                        case '(landscape)':
                            return rule.parent.params = mtv.iphone4;
                            break;
                        case 'default':
                            break;
                    }
                }
            });
        });
    }
}
module.exports = postcssFunc;
    
