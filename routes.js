var passport = require('passport'),
    flash    = require('connect-flash'),
    helpers  = require('./utils');

require('./config/passport')(passport); // pass passport for configuration

module.exports=function(app) {  

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session
    

    app.get('/', function (req, res) {
        res.render('index',{startTime: startTime, endTime: endTime });
    });
    
    app.get('/start',function(req, res) {
        res.render('start',{startTime: startTime, endTime: endTime });
    });

    app.get('/end', function (req, res) {
        res.render('end',{startTime: startTime, endTime: endTime });
    });

    app.get('/chat', function (req, res) {
        ++noOfUsers;
        name = req.user ? req.user.name : "anonymous_user";
        console.log(req.session.userID);
        req.session.userID = req.session.userID ? req.session.userID : ++uniqueIDs;
        res.render('chat',{ userName: name, userID: req.session.userID, startTime: startTime, endTime: endTime });
    });

    app.get('/question', function (req, res) {
        res.sendfile(__dirname + '/views/question.html');
    });

    app.get('/generatingPDF',function(req, res){
        helpers.generatingPDF();
        res.status(200).end();
    });

    app.get('/download', function(req, res){  
        res.setHeader('content-type','application/pdf');
        res.download('output.pdf');  
    });

    // route for home page
    app.get('/admin/login', function(req, res) {
        res.sendfile(__dirname + '/views/login.html');
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/',
            failureRedirect : '/error'
        })
    );

    app.get('/error', function(req, res) {
        res.sendfile(__dirname + '/views/error.html');
    });

    app.get('/ping', function(req, res) {
        res.send('pong');
    });

    app.get('*', function(req, res) {
        res.redirect('/error');
    });
}

