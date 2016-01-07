var express = require('express');
var router = express.Router();

// database module
var database = require('../config/database');
var RunQuery = database.RunQuery;

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

router.route('/')
    .get(function(req, res){
        if (req.isAuthenticated()){
            if (req.user.Admin == 1){
                res.redirect('/admin');
            }
            else {
                res.redirect('/usr/' + req.user.Username);
            }
        }
        res.redirect('/');
    });

router.route('/:username')
    .get(isLoggedIn, function (req, res) {
        var user = req.user;
        var userName = user.Username;

        var selectQuery = '\
            SELECT *\
            FROM Addresses\
            WHERE (UserID = ' + req.user.UserID + ') AND (`Default` = 1)';
        console.log(selectQuery);

        RunQuery(selectQuery, function (info) {
            res.render('profile/profile', {
                title: req.user.FullName,
                customer: user,
                info: info[0]
            });
        });
    });

router.route('/:username/orders')
    .get(function(req, res){
        var user = req.user;
        var userName = user.Username;

        var selectQuery = '\
            SELECT *\
            FROM Orders\
            WHERE UserID = ' + req.user.UserID;
        console.log(selectQuery);

        RunQuery(selectQuery, function (orders) {
            res.render('profile/orders', {
                title: req.user.FullName,
                customer: user,
                orders: orders
            });
        });
    });

router.route('/:username/addresses')
    .get(function(req, res){
        var user = req.user;
        var userName = user.Username;

        var selectQuery = '\
            SELECT *\
            FROM Addresses\
            WHERE UserID = ' + req.user.UserID;
        console.log(selectQuery);

        RunQuery(selectQuery, function (addresses) {
            res.render('profile/addresses', {
                title: req.user.FullName,
                customer: user,
                addresses: addresses
            });
        });
    });

module.exports = router;