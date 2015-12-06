var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var slugify = require('slugify');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aStore'
});


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
                featProducts: products
            };

            res.render('index', contextDict);
        });
    });
});

/* Route Category page. */
router.route('/categories/')
    .all(function(req, res, next){
        var sqlStr = '\
        SELECT *\
        FROM Categories';

        RunQuery(sqlStr, function (categories) {
            var contextDict = {
                currentUrl: '/categories',
                title: 'Categories',
                categories: categories
            };

            res.render('categories', contextDict);
        });
    });

/* Route Category Products page. */
router.route('/categories/:catSlug')
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
                products: products
            };

            res.render('categoryProducts', contextDict);
        });
    });

/* Route Product page. */
router.route('/categories/:catSlug/:prodSlug')
    .all(function(req, res, next){
        var sqlStr = '\
        SELECT *\
        FROM Products\
        WHERE ProductSlug = \'' + req.params.prodSlug + '\'';

        RunQuery(sqlStr, function (product) {

            var contextDict = {
                title: product[0].ProductName,
                product: product[0]
            };

            res.render('productDetail', contextDict);
        });
    });

/* Route Services page. */
router.route('/services/')
    .all(function (req, res, next) {
        var contextDict = {
            currentUrl: '/services',
            navList: ['Shipment', 'Return Policy', 'Payment', 'Voucher'],
            title: 'Services'
        };
        res.render('press', contextDict);
    });

/* Route Press page. */
router.route('/press/')
    .all(function (req, res, next) {
        var navList = [{name: 'Careers', link: slugify(name)},{},{},{}];
        var contextDict = {
            currentUrl: '/press',
            navList: [, 'Partners', 'Privacy Terms', 'About aStore'],
            title: 'Press'
        };
        res.render('press', contextDict);
    });


/* Route Login page. */
router.route('/login/')
    .get (function (req, res, next) {
        var contextDict = {
            title: 'Login'
        };
        res.render('login', contextDict);
    })

    .post(function (req, res, next) {
        //read inputs
        //validate inputs
        //redirect to account info page
        var contextDict = {
            title: '',
            signInError: req.flash('loginError')
        };
        res.render('template', contextDict);
    })

    .put(function (req, res, next) {
        //read inputs
        //validate inputs
        //insert into database
        //redirect to register success
        var contextDict = {
            title: '',
            signUpError: req.flash('signUpError')
        };
        res.render('template', contextDict);
    });

/* Route Contact-us page. */
router.route('/contact-us/')
    .get(function (req, res, next) {
        var contextDict = {
            currentUrl: '/contact-us',
            title: 'Contact us'
        };
        res.render('contact', contextDict);
    })

    .post(function(req, res, next){
        //read inputs
        //validate inputs
        //insert into database
        //redirect to contact success
        var contextDict = {
            title: ''
        };
        res.render('template', contextDict);
    });

module.exports = router;
