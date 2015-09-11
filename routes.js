var passport = require('passport'),
    flash    = require('connect-flash'),
    helpers  = require('./utils');

require('./config/passport')(passport); // pass passport for configuration

module.exports=function(app) {  
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

    app.get('/', function (req, res) {
        var currentTime = new Date();
        if (currentTime < startTime)
            res.render('start', { timestamp: Math.floor(Date.parse(startTime) / 1000)});
        else
            res.sendfile(__dirname + '/views/index.html');
    });

    app.get('/chat', function (req, res) {
        ++noOfUsers;
        ++uniqueIDs;
        var currentTime = new Date();
        name = req.user ? req.user.name : "anonymous_user";
        if (currentTime > endTime)          
            res.render('end', { timestamp: Math.floor(Date.parse(endTime) / 1000)});
        else 
            res.render('chat',{ userName: name, userID: uniqueIDs, startTime: startTime, endTime: endTime });
    });

    app.get('/question', function (req, res) {
        res.sendfile(__dirname + '/views/question.html');
    });

    app.get('/generatingPDF',function(req, res){
        //helpers.generatingPDF();
        doc = new PDF();                        
        doc.pipe(fs.createWriteStream('output.pdf'));  //creating a write stream 

        doc.font('Times-Roman')
        .fontSize(15)
        .text("------------------------------------------------------------------------------------------")
        .fontSize(12)
        .text('Women @ Freshdesk', {paragraphGap: 10,indent: 10,align: 'center',})
        .fontSize(15)
        .text("------------------------------------------------------------------------------------------");

        db.all_messages(function(result) {
            if(result){
                for(i=0;i<result.length;i++) {
                    user_name = result[i]['user_name'] != 'anonymous_user' ? result[i]['user_name'] : 'User '+result[i]['id']
                    doc.fontSize(12).text(user_name + " : ");
                    doc.fontSize(10).text(result[i]['message'], {paragraphGap: 3,indent: 5,align: 'justify',});
                    doc.fontSize(12).text("\n");
                }
            }       
            doc.end(); 
        });
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

    app.get('/end',function(req, res) {
        var currentTime = new Date();
        if (currentTime > endTime)          
            res.render('end', { timestamp: Math.floor(Date.parse(endTime) / 1000)});
        else 
            res.redirect('/');
    });

    app.get('*', function(req, res) {
        res.redirect('/error');
    });
}

