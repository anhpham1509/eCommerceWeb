/*var express = require('express');
 var router = express.Router();
 var passport = require('../app').passport;

 router.route('/sign-in')
 .get(function (req, res) {
 var contextDict = {
 title: 'Sign In',
 navList: [{name: 'hello', link: 'bye'}],
 signInError: req.flash('signInError')
 };
 res.render('sign-in', contextDict);
 })

 .post(passport.authenticate('sign-in', {
 successRedirect: '/', // redirect to the secure profile section
 failureRedirect: '/users/sign-in', // redirect back to the signup page if there is an error
 failureFlash: true // allow flash messages
 }));

 router.route('/sign-up')
 .get(function (req, res) {
 var contextDict = {
 title: 'Sign Up',
 navList: [{name: 'hello', link: 'bye'}],
 signUpError: req.flash('signUpError')
 };
 res.render('sign-up', contextDict);
 })

 .post(passport.authenticate('sign-up', {
 successRedirect: './sign-in', // redirect to the secure profile section
 failureRedirect: './sign-up', // redirect back to the signup page if there is an error
 failureFlash: true // allow flash messages
 }));

 router.route('/sign-out')
 .get(function (req, res) {
 req.logout();
 res.redirect('/');
 });

 module.exports = router;
 */

module.exports = function (app, passport) {

    app.get('/sign-in', function (req, res) {
        // render the page and pass in any flash data if it exists
        if (req.session.inCheckOut){
            var checkOutNoti = 'You need to sign in to check out!\
                Please sign up if you do not have one!'
        }
        var contextDict = {
            navList: [{name: 'Sign in', link: '/sign-in'}, {name: 'Sign up', link: '/sign-up'}],
            title: 'Sign In',
            signInError: req.flash('signInError'),
            checkOutNoti: checkOutNoti
        };
        res.render('sign-in', contextDict);
    });

    app.post('/sign-in', passport.authenticate('sign-in', {
        successRedirect: '/usr/', // redirect to the secure profile section
        failureRedirect: '/sign-in', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/sign-up', function (req, res) {
        // render the page and pass in any flash data if it exists
        if (req.session.inCheckOut){
            var checkOutNoti = 'You need to sign in to check out!\
                Please sign up if you do not have one!'
        }

        var contextDict = {
            navList: [{name: 'Sign in', link: '/sign-in'}, {name: 'Sign up', link: '/sign-up'}],
            title: 'Sign Up',
            signUpError: req.flash('signUpError'),
            checkOutNoti: checkOutNoti
        };

        res.render('sign-up', contextDict);
    });

    // process the signup form
    app.post('/sign-up', passport.authenticate('sign-up', {
        successRedirect: '/sign-in', // redirect to the secure profile section
        failureRedirect: '/sign-up', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/sign-out', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

};