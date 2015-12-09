var express = require('express');
var router = express.Router();

router.route('/')
    .get(function(req, res, next){
        //select items in cart
        var contextDict = {
            title: 'Admin',
            customer: req.user
        };
        res.render('admin', contextDict);
    });

module.exports = router;