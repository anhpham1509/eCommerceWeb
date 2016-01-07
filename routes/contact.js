var express = require('express');
var router = express.Router();

// database module
var database = require('../config/database');
var RunQuery = database.RunQuery;

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
        var name = req.body.fullName.replace(/[^\w\s]/gi, '');
        var email = req.body.email;
        var subject = req.body.subject.replace(/[^\w\s]/gi, '');
        var message = req.body.contactMessage.replace(/[^\w\s]/gi, '');

        if (req.user){
            name = req.user.FullName;
            email = req.user.Email;
        }

        var insertQuery = 'INSERT INTO Messages\
            VALUES(null, \''+
            name + '\', \'' +
            email + '\', \'' +
            subject + '\', \'' +
            message + '\')';

        RunQuery(insertQuery, function(result){
            var content = 'Message have been submitted. \
                We will contact you as soon as possible. \
                Thank you so much for your attention!';
            var contextDict = {
                title: 'Contact us',
                content: content,
                customer: req.user
            };
            res.render('contact', contextDict);
        });
    });

module.exports = router;