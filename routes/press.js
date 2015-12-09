var express = require('express');
var router = express.Router();

var changeCase = require('change-case');
var slug = require('slug');

function GenNavList(list, callback) {
    var result = [];
    for (var i=0; i<list.length; i++) {
        result.push({
            name: changeCase.titleCase(list[i]),
            link: slug(list[i])
        });
    }
    callback(result);
}

/* Route Press page. */
router.route('/')
    .all(function (req, res, next) {
        var list = ['careers', 'partners', 'privacy terms', 'about us'];
        GenNavList(list, function(navList){
            var contextDict = {
                currentUrl: '/press',
                navList: navList,
                title: 'Press',
                customer: req.user
            };
            res.render('press', contextDict);
        });
    });

module.exports = router;