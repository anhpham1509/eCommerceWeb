var express = require('express');
var router = express.Router();


// database module
var mysql = require('mysql');
var database = require('../config/database');

// init database
var pool = mysql.createPool(database.config);

//Fetch data
function RunQuery(sql, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            ShowErrors(err);
        }
        conn.query(sql, function (err, rows, fields) {
            if (err) {
                ShowErrors(err);
            }
            conn.release();
            callback(rows);
        });
    });
}

//Throw errors
function ShowErrors(err) {
    throw err;
}

router.route('/')
    .get(function(req, res, next){
        if (req.isAuthenticated()){
             res.redirect('checkout/delivery/')
        }
        else {
            //Ask if customer has an account or not
                // if yes => show sign-in form
                // if no
                    // ask if register or order as guest

            //select items in cart
            var contextDict = {
                title: 'Checkout - Customer Information',
                customer: req.user
            };
            res.render('checkout/checkout', contextDict);
        }
    });

router.route('/delivery')
    .get(function(req, res, next){
        req.session.delivery = {};

        // show addresses
        var selectQuery = '\
            SELECT *\
            FROM Addresses\
            WHERE UserID = ' + req.user.UserID + ';';

        RunQuery(selectQuery, function(rows){
            req.session.delivery = rows;
            console.log(req.session.delivery);

            var contextDict = {
                title: 'Checkout - Delivery Address',
                addresses: rows,
                customer: req.user
            };
            res.render('checkout/delivery', contextDict);
        });
        // if choose from exist address => redirect
        // if create new add
            // 1. Open form
            // 2. Save data
            // 3. Redirect
    });

router.route('/delivery/new')
    .post(function(req, res, next){
        var fullName = req.body.fullName;
        var email = req.body.email;
        var address = req.body.streetAddress;
        var postcode = req.body.postcode;
        var city = req.body.city;
        var country = req.body.country;
        var phone = req.body.phone;

        // add address
        var insertQuery = '\
            INSERT INTO Addresses\
            VALUES(null, ' +
            req.user.UserID + ', \'' +
            fullName + '\', \'' +
            address + '\', \'' +
            postcode + '\', \'' +
            city + '\', \'' +
            country + '\', \'' +
            phone + '\', ' + '0)';

        RunQuery(insertQuery, function(rows){
            req.session.delivery = {
                FullName: fullName,
                Email: email,
                StreetAddress: address,
                PostCode: postcode,
                City: city,
                Country: country,
                Phone: phone
            };
            console.log(req.session.delivery);

            res.redirect('/checkout/review');
        });
    });

router.route('/delivery/:id')
    .post(function(req, res, next){
        var selectQuery = '\
            SELECT *\
            FROM Addresses\
            WHERE AddressID = ' + req.params.id + ';';

        RunQuery(selectQuery, function(rows){
            req.session.delivery = rows[0];
            console.log(req.session.delivery);
            res.redirect('/checkout/review');
        });
    });

router.route('/review')
    .get(function(req, res, next){
        //show current cart
        //Order
        var contextDict = {
            title: 'Checkout - Review Order',
            cart: req.session.cart,
            summary:req.session.summary,
            delivery: req.session.delivery,
            customer: req.user
        };
        res.render('checkout/review', contextDict);
    });

router.route('/order')
    .get(function(req, res, next){
        //show current cart
        //Order
        var contextDict = {
            title: 'Checkout - Order',
            customer: req.user
        };
        res.render('checkout/order', contextDict);
    });

module.exports = router;