var express = require('express');
var router = express.Router();

var slug = require('slug');

// database module
var database = require('../config/database');
var RunQuery = database.RunQuery;

function isAdmin(req, res, next) {

    if (req.isAuthenticated()) {
        if (req.user.Admin == 1) {
            return next();
        }
        else {
            res.redirect('/usr/' + req.user.Username);
        }
    }

    res.redirect('/');
}

router.route('/')
    .get(isAdmin, function (req, res, next) {

        var contextDict = {
            title: 'Admin',
            customer: req.user
        };
        res.render('admin/admin', contextDict);
    });

router.route('/cat')
    .get(isAdmin, function (req, res, next) {

        var sqlStr = '\
        SELECT *\
        FROM Categories';

        RunQuery(sqlStr, function (categories) {
            var contextDict = {
                title: 'Admin - Categories',
                categories: categories,
                customer: req.user
            };

            res.render('admin/categories', contextDict);
        });
    });

router.route('/cat/:id/edit')
    .get(isAdmin, function (req, res, next) {

        var sqlStr = '\
        SELECT *\
        FROM Categories\
        WHERE CategoryID = ' + req.params.id;

        RunQuery(sqlStr, function (category) {
            var contextDict = {
                title: 'Admin - Edit Category',
                category: category[0],
                customer: req.user
            };

            res.render('admin/editCat', contextDict);
        });
    })

    .post(isAdmin, function(req, res, next){
        var sqlStr = '\
        UPDATE Categories\
        SET CategoryName = \'' + req.body.name + '\', \
            Description = \'' + req.body.description + '\', \
            CategorySlug = \'' + slug(req.body.name) + '\' ' +
            /*Image = name.png\*/
        'WHERE CategoryID = ' + req.params.id;

        RunQuery(sqlStr, function (category) {
            res.redirect('/admin/cat');
        });
    });

router.route('/cat/:id/delete')
    .post(isAdmin, function(req, res, next){
        var sqlStr = '\
            SELECT *\
            FROM Products\
            WHERE CategoryID = ' + req.params.id;
        RunQuery(sqlStr, function(products){
            if (products == null){
                sqlStr = '\
                    DELETE FROM Categories\
                    WHERE CategoryID = ' + req.params.id;

                RunQuery(sqlStr, function (result) {
                    res.redirect('/admin/cat');
                });
            }
            else{
                // tell that cat is not empty
            }
        });


    });

router.route('/cat/add')
    .get(isAdmin, function(req, res, next){
        var contextDict = {
            title: 'Admin - Add Category',
            customer: req.user
        };

        res.render('admin/addCat', contextDict);
    })

    .post(isAdmin, function(req, res, next){
        var sqlStr = '\
        INSERT INTO Categories\
        VALUES (null, \'' + req.body.name + '\', \
            \'' + req.body.description + '\', \
            \'' + slug(req.body.name) + '\', \
            \'' + slug(req.body.name) + '.png\')'
                /*Image = name.png\*/
            ;

        RunQuery(sqlStr, function (category) {
            res.redirect('/admin/cat');
        });
    });
router.route('/products')
    .get(isAdmin, function (req, res, next) {
        var sqlStr = '\
                    SELECT Products.*, Categories.CategoryName\
                    FROM Products\
                    INNER JOIN Categories\
                    ON Products.CategoryID = Categories.CategoryID';

        RunQuery(sqlStr, function (products) {

            var contextDict = {
                title: 'Admin - Products',
                products: products,
                customer: req.user
            };

            res.render('admin/products', contextDict);
        });
    });

router.route('/orders')
    .get(function(req, res){

        var selectQuery = '\
            SELECT *\
            FROM Orders';

        RunQuery(selectQuery, function (orders) {

            var contextDict = {
                title: 'Admin - Orders',
                customer: req.user,
                orders: orders
            };

            res.render('admin/orders', contextDict);
        });
    });

router.route('/customers')
    .get(function(req, res){

        var selectQuery = '\
            SELECT *\
            FROM Users';

        RunQuery(selectQuery, function (customers) {

            var contextDict = {
                title: 'Admin - Customers',
                customer: req.user,
                customers: customers
            };

            res.render('admin/customers', contextDict);
        });
    });

module.exports = router;