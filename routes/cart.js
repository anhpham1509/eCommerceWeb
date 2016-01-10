var express = require('express');
var router = express.Router();

// database module
var database = require('../config/database');
var RunQuery = database.RunQuery;

router.route('/')
    .all(function (req, res, next) {
        var summary = req.session.summary;
        var cartSummary;

        if (summary)
            cartSummary = {
                subTotal: summary.subTotal.toFixed(2),
                discount: summary.discount.toFixed(2),
                shipCost: summary.shipCost.toFixed(2),
                total: summary.total.toFixed(2)
            };

        var cart = req.session.cart;
        var showCart = [];

        for (var item in cart) {
            var aItem = cart[item];
            if (cart[item].quantity > 0) {
                showCart.push({
                    Image: aItem.Image,
                    ProductSlug: aItem.ProductSlug,
                    CategorySlug: aItem.CategorySlug,
                    ProductID: aItem.ProductID,
                    ProductName: aItem.ProductName,
                    Description: aItem.Description,
                    ProductPrice: aItem.ProductPrice,
                    quantity: aItem.quantity,
                    productTotal: aItem.productTotal.toFixed(2)
                });
            }
        }

        req.session.showCart = showCart;
        req.session.cartSummary = cartSummary;

        var contextDict = {
            title: 'Cart',
            customer: req.user,
            cart: showCart,
            summary: cartSummary
        };
        res.render('cart', contextDict);
    });

router.route('/:id/update')
    .post(function (req, res, next) {
        var cart = req.session.cart;
        var newQuantity = parseInt(req.body[req.params.id]);

        for (var item in cart) {
            if (cart[item].ProductID == req.params.id) {
                var diff = newQuantity - cart[item].quantity;

                if (diff != 0) {
                    var summary = req.session.summary;

                    summary.totalQuantity += diff;
                    summary.subTotal = summary.subTotal + cart[item].ProductPrice * diff;
                    summary.total = summary.total + cart[item].ProductPrice * diff;
                    cart[item].productTotal = cart[item].productTotal + cart[item].ProductPrice * diff;
                    cart[item].quantity = newQuantity;
                }
            }

        }

        res.redirect('/cart');
    });

router.route('/:id/delete')
    .post(function (req, res, next) {
        var cart = req.session.cart;
        var summary = req.session.summary;

        summary.totalQuantity -= cart[req.params.id].quantity;
        cart[req.params.id].quantity = 0;
        summary.subTotal = summary.subTotal - cart[req.params.id].productTotal;
        summary.total = summary.total - cart[req.params.id].productTotal;
        cart[req.params.id].productTotal = 0;

        res.redirect('/cart');
    });

router.route('/:id/add')
    .post(function (req, res, next) {
        req.session.cart = req.session.cart || {};
        var cart = req.session.cart;

        req.session.summary = req.session.summary || {
                totalQuantity: 0,
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

        RunQuery(selectQuery, function (rows) {
            var plusPrice = 0.00;
            var inputQuantity = parseInt(req.body.quantity);

            if (cart[req.params.id]) {
                if (inputQuantity) {
                    cart[req.params.id].quantity += inputQuantity;
                    plusPrice = cart[req.params.id].ProductPrice * inputQuantity;
                    cart[req.params.id].productTotal += plusPrice;
                    summary.subTotal += plusPrice;
                    summary.totalQuantity += inputQuantity;
                }
                else {
                    cart[req.params.id].quantity++;
                    plusPrice = cart[req.params.id].ProductPrice;
                    cart[req.params.id].productTotal += plusPrice;
                    summary.subTotal += plusPrice;
                    summary.totalQuantity++;
                }
            }
            else {
                cart[req.params.id] = rows[0];

                if (req.body.quantity) {
                    cart[req.params.id].quantity = inputQuantity;
                    plusPrice = cart[req.params.id].ProductPrice * inputQuantity;
                    cart[req.params.id].productTotal = plusPrice;
                    summary.subTotal += plusPrice;
                    summary.totalQuantity += inputQuantity;
                }
                else {
                    rows[0].quantity = 1;
                    plusPrice = cart[req.params.id].ProductPrice;
                    cart[req.params.id].productTotal = plusPrice;
                    summary.subTotal += plusPrice;
                    summary.totalQuantity++;
                }
            }

            summary.total = summary.subTotal - summary.discount + summary.shipCost;

            res.redirect('/cart');
        });
    });


module.exports = router;