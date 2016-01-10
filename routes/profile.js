var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt-nodejs');

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
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            if (req.user.Admin == 1) {
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

        res.render('profile/profile', {
            title: req.user.FullName,
            customer: req.user
        });
    });

router.route('/:username/edit')
    .get(isLoggedIn, function (req, res) {
        res.render('profile/editProfile', {
            title: req.user.FullName,
            customer: req.user
        });
    })

    .post(isLoggedIn, function (req, res) {
        var form = req.body;
        if (bcrypt.compareSync(form.password, req.user.Password)) {
            var updateQuery = '\
                UPDATE Users\
                SET Fullname = \'' + form.fullName + '\', \
                    Email = \'' + form.email + '\', \
                    StreetAddress = \'' + form.streetAddress + '\', \
                    PostCode = \'' + form.postcode + '\', \
                    City = \'' + form.city + '\', \
                    Country = \'' + form.country + '\', \
                    Phone = \'' + form.phone + '\' \
                WHERE UserID = ' + req.user.UserID;

            RunQuery(updateQuery, function (result) {
                res.redirect('/usr/' + req.user.Username);
            });
        }
        else {
            //password wrong
        }
    });

router.route('/:username/change-password')
    .get(isLoggedIn, function (req, res) {
        res.render('profile/changePassword', {
            title: req.user.FullName,
            customer: req.user
        });

    })

    .post(isLoggedIn, function (req, res) {
        var form = req.body;
        if (form.newPassword == form.repeatPassword) {
            if (bcrypt.compareSync(form.currentPassword, req.user.Password)) {
                var passwordHash = bcrypt.hashSync(form.newPassword, null, null);
                var updateQuery = '\
                UPDATE Users\
                SET Password = \'' + passwordHash + '\' \
                WHERE UserID = ' + req.user.UserID;

                RunQuery(updateQuery, function (result) {
                    res.redirect('/usr/' + req.user.Username);

                });
            }
            else {
                //password wrong
            }
        }
        else {
            //passwords are not matched
        }
    });

router.route('/:username/orders')
    .get(isLoggedIn, function (req, res) {

        var selectQuery = '\
            SELECT *\
            FROM Orders\
            WHERE UserID = ' + req.user.UserID;

        RunQuery(selectQuery, function (orders) {
            res.render('profile/orders', {
                title: req.user.FullName,
                customer: req.user,
                orders: orders
            });
        });
    });

router.route('/:username/orders/:id')
    .get(isLoggedIn, function (req, res) {
        //get order info
        var selectQuery = '\
            SELECT *\
            FROM Orders\
            WHERE OrderID = ' + req.params.id;

        RunQuery(selectQuery, function (order) {
            //get delivery info
            selectQuery = '\
                SELECT *\
                FROM Addresses\
                WHERE AddressID = ' + order[0].AddressID;

            RunQuery(selectQuery, function (address) {
                //get order info
                selectQuery = '\
                    SELECT *\
                    FROM `Order Details`\
                    INNER JOIN (\
                        SELECT Products.*, Categories.CategorySlug\
                        FROM Products\
                        INNER JOIN Categories\
                        ON Products.CategoryID = Categories.CategoryID\
                    ) `Table`\
                    ON `Order Details`.ProductID = `Table`.ProductID\
                    WHERE OrderID = ' + order[0].OrderID;

                RunQuery(selectQuery, function (products) {
                    //get order info

                    var contextDict = {
                        title: req.user.FullName,
                        customer: req.user,
                        order: order[0],
                        address: address[0],
                        products: products
                    };

                    res.render('profile/viewOrder', contextDict);
                });
            });
        });
    });

router.route('/:username/addresses')
    .get(isLoggedIn, function (req, res) {

        var selectQuery = '\
            SELECT *\
            FROM Addresses\
            WHERE UserID = ' + req.user.UserID;

        RunQuery(selectQuery, function (addresses) {
            res.render('profile/addresses', {
                title: req.user.FullName,
                customer: req.user,
                addresses: addresses
            });
        });
    });

router.route('/:username/addresses/:id/edit')
    .get(isLoggedIn, function (req, res) {

        var selectQuery = '\
            SELECT *\
            FROM Addresses\
            WHERE AddressID = ' + req.params.id;

        RunQuery(selectQuery, function (address) {
            res.render('profile/editAddress', {
                title: req.user.FullName,
                customer: req.user,
                address: address[0]
            });
        });
    })

    .post(isLoggedIn, function (req, res) {
        var form = req.body;

        var updateQuery = '\
                UPDATE Addresses\
                SET Fullname = \'' + form.fullName + '\', \
                    StreetAddress = \'' + form.streetAddress + '\', \
                    PostCode = \'' + form.postcode + '\', \
                    City = \'' + form.city + '\', \
                    Country = \'' + form.country + '\', \
                    Phone = \'' + form.phone + '\' \
                WHERE AddressID = ' + req.params.id;

        RunQuery(updateQuery, function (result) {
            res.redirect('/usr/' + req.user.Username + '/addresses/');
        });
    });

router.route('/:username/addresses/:id/delete')
    .post(isLoggedIn, function (req, res, next) {

        var sqlStr = '\
            DELETE FROM Addresses\
            WHERE AddressID = ' + req.params.id;

        RunQuery(sqlStr, function (result) {
            res.redirect('/usr/' + req.user.Username + '/addresses/');
        });
    });

router.route('/:username/addresses/add')
    .get(isLoggedIn, function (req, res) {
        res.render('profile/addAddress', {
            title: req.user.FullName,
            customer: req.user
        });
    })

    .post(isLoggedIn, function (req, res) {
        var form = req.body;

        var insertQuery = '\
                INSERT INTO Addresses\
                VALUES (null, ' + req.user.UserID + ', \
                    \'' + form.fullName + '\', \
                    \'' + form.streetAddress + '\', \
                    \'' + form.postcode + '\', \
                    \'' + form.city + '\', \
                    \'' + form.country + '\', \
                    \'' + form.phone + '\')';

        RunQuery(insertQuery, function (result) {
            res.redirect('/usr/' + req.user.Username + '/addresses/');
        });
    });

module.exports = router;