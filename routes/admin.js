var express = require('express');
var router = express.Router();

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

router.route('/products')
    .get(isAdmin, function (req, res, next) {
        var sqlStr = '\
                    SELECT *\
                    FROM Products';

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