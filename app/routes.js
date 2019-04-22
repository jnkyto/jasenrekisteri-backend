// All the routes

var User = require('../models/user');

module.exports = function(app, passport) {

    // Home page / Login

    app.get('/', function(req, res) {
        if (req.user) {
            res.redirect('/profile');
        } else {
            res.render('index', {
                message: req.flash('loginMessage'),
                title: 'Asteriski jäsenrekisteri'
            });
        }
    });

    app.post('/', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));

    // Signup

    app.get('/signup', function(req, res) {
        res.render('signup', {
            message: req.flash('signupMessage'),
            title: 'Asteriski jäsenrekisteri - Liity jäseneksi'
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    // Profile

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user: req.user,
            title: 'Asteriski jäsenrekisteri - Jäsentiedot'
        });
    });

    // Edit profile

    app.get('/edit-profile', isLoggedIn, function(req, res) {
        res.render('edit-profile', {
            user: req.user,
            title: 'Asteriski jäsenrekisteri - Muokkaa tietoja'
        });
    });

    // Admin

    app.get('/admin', isAdmin, function(req, res) {
        User.find({}, function(err, users) {
            if (err) {
                console.log(err.stack);
                res.send('Virhe');
            }
            res.render('admin', {
                user: req.user,
                users: users,
                title: 'Asteriski jäsenrekisteri - Hallinta'
            });
        });
    });

    // Logout

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function isAdmin(req, res, next) {

    if (req.isAuthenticated()) {
        if (req.user.admin) {
            return next();
        }
    }

    res.redirect('/');
}
