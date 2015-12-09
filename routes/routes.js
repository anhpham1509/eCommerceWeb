var express = require('express');
var router = express.Router();
var slug = require('slug');
var changeCase = require('change-case');

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

/* Route Home page. */
router.all('/', function (req, res, next) {
    var sqlStr = '\
        SELECT *\
        FROM Categories';

    RunQuery(sqlStr, function (categories) {
        sqlStr = '\
            SELECT Products.*, Categories.CategoryName, Categories.CategorySlug\
            FROM Products\
            INNER JOIN Categories\
            ON Products.CategoryID = Categories.CategoryID\
            WHERE Feature = 1';

        RunQuery(sqlStr, function (products) {
            var contextDict = {
                currentUrl: '/',
                title: 'Home',
                categories: categories,
                featProducts: products,
                customer: req.user
            };

            //isLoggedIn(req, contextDict);
            res.render('index', contextDict);
        });
    });
});

/* Route Category page. */
router.route('/cat/')
    .all(function(req, res, next){
        var sqlStr = '\
        SELECT *\
        FROM Categories';

        RunQuery(sqlStr, function (categories) {
            var contextDict = {
                currentUrl: '/cat',
                title: 'Categories',
                categories: categories,
                customer: req.user
            };

            res.render('categories', contextDict);
        });
    });

/* Route Category Products page. */
router.route('/cat/:catSlug')
    .all(function(req, res, next){
        var sqlStr = '\
        SELECT Products.*, Categories.CategoryName, Categories.CategorySlug\
        FROM Products\
        INNER JOIN Categories\
        ON Products.CategoryID = Categories.CategoryID\
        WHERE Categories.CategorySlug = \'' + req.params.catSlug + '\'';

        RunQuery(sqlStr, function (products) {

            var contextDict = {
                title: products[0].CategoryName,
                products: products,
                customer: req.user
            };

            res.render('categoryProducts', contextDict);
        });
    });

/* Route Product page. */
router.route('/cat/:catSlug/:prodSlug')
    .all(function(req, res, next){
        var sqlStr = '\
        SELECT *\
        FROM Products\
        WHERE ProductSlug = \'' + req.params.prodSlug + '\'';

        RunQuery(sqlStr, function (product) {

            var contextDict = {
                title: product[0].ProductName,
                product: product[0],
                customer: req.user
            };

            res.render('productDetail', contextDict);
        });
    });

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

/* Route Services page. */
router.route('/services/')
    .all(function (req, res, next) {
        var list = ['shipment', 'return policy', 'payment', 'voucher'];
        GenNavList(list, function(navList){
            var contextDict = {
                currentUrl: '/services',
                navList: navList,
                title: 'Services',
                customer: req.user
            };
            res.render('press', contextDict);
        });
    });

/* Route Press page. */
router.route('/press/')
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

router.route('/checkout')
    .get(function(req, res, next){
        //select items in cart
        var contextDict = {
            title: 'Checkout',
            customer: req.user
        };
        res.render('checkout', contextDict);
    });

/* Route Login page.
router.route('/login/')
    .get (function (req, res, next) {
        var contextDict = {
            title: 'Login'
        };
        res.render('login', contextDict);
    });

    .post(function (req, res, next) {
        //read inputs
        //validate inputs
        //redirect to account info page
        var contextDict = {
            title: '',
            signInError: req.flash('loginError')
        };
        res.render('template', contextDict);
    });
*/
/* Route Contact-us page. */
router.route('/contact-us/')
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
