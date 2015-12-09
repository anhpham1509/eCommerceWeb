var express = require('express');
var router = express.Router();

/* Route Contact-us page. */
router.route('/')
    .get(function (req, res, next) {
        var contextDict = {
            currentUrl: '/contact-us',
            title: 'Contact us',
            customer: req.user
        };
        res.render('contact', contextDict);
    })

    .post(function(req, res, next){
        var name = req.body.fullName;
        var email = req.body.email;
        var subject = req.body.subject;
        var message = req.body.contactMessage;

        var insertQuery = 'INSERT INTO Messages\
            VALUES(null, '+
            req.body.fullName + ', \'' +
            req.body.email + '\', \'' +
            req.body.subject + '\', \'' +
            req.body.contactMessage + '\')';

        RunQuery(insertQuery, function(result){
            var content = 'Message have been submitted. \
                We will contact you as soon as possible. \
                Thank you so much for your attention!';
            var contextDict = {
                title: 'Contact us',
                content: content
            };
            res.render('contact', contextDict);
        });
    });

module.exports = router;