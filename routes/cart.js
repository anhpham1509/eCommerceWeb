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
            throw (err);
        }
        conn.query(sql, function (err, rows, fields) {
            if (err) {
                throw (err);
            }
            conn.release();
            callback(rows);
        });
    });
}

router.route('/')
    .all(function(req, res, next){
        var contextDict = {
            title: 'Cart',
            customer: req.user,
            cart: req.session.cart,
            summary: req.session.summary
        };
        res.render('cart', contextDict);
    });

router.route('/:id')
    .post(function(req, res, next){
        req.session.cart = req.session.cart || {};
        var cart = req.session.cart;

        req.session.summary = req.session.summary || {
                subTotal: 0.00,
                discount: 0.00,
                shipCost: 0.00,
                total: 0.00
            };
        var summary = req.session.summary;

        var selectQuery = '\
            SELECT Products.*, Categories.CategorySlug\
            FROM Products\
            INNER JOIN Categories\
            ON Products.CategoryID = Categories.CategoryID\
            WHERE ProductID = ' + req.params.id;

        RunQuery(selectQuery, function(rows){
            var plusPrice = 0.00;
            summary.subTotal = parseFloat(summary.subTotal);
            summary.discount = parseFloat(summary.discount);
            summary.shipCost = parseFloat(summary.shipCost);
            summary.total = parseFloat(summary.total);

            if (cart[req.params.id]){
                cart[req.params.id].productTotal = parseFloat(cart[req.params.id].productTotal);
                if (req.body.quantity){
                    cart[req.params.id].quantity += parseInt(req.body.quantity);
                    plusPrice = parseFloat(cart[req.params.id].ProductPrice) * parseInt(req.body.quantity);
                    cart[req.params.id].productTotal += plusPrice;
                    summary.subTotal += plusPrice;
                }
                else{
                    cart[req.params.id].quantity++;
                    plusPrice = parseFloat(cart[req.params.id].ProductPrice);
                    cart[req.params.id].productTotal += plusPrice;
                    summary.subTotal += plusPrice;
                }
            }
            else{
                cart[req.params.id] = rows[0];

                if (req.body.quantity){
                    cart[req.params.id].quantity = parseInt(req.body.quantity);
                    plusPrice = parseFloat(cart[req.params.id].ProductPrice) * parseInt(req.body.quantity);
                    cart[req.params.id].productTotal = plusPrice;
                    summary.subTotal += plusPrice;
                }
                else{
                    rows[0].quantity = 1;
                    plusPrice = parseFloat(cart[req.params.id].ProductPrice);
                    cart[req.params.id].productTotal = plusPrice;
                    summary.subTotal += plusPrice;
                }
            }

            cart[req.params.id].productTotal = cart[req.params.id].productTotal.toFixed(2);

            summary.total = summary.subTotal - summary.discount + summary.shipCost;

            summary.subTotal = summary.subTotal.toFixed(2);
            summary.discount = summary.discount.toFixed(2);
            summary.shipCost = summary.shipCost.toFixed(2);
            summary.total = summary.total.toFixed(2);

            res.redirect('/cart');
        });
    });


module.exports = router;