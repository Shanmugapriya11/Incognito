var express      = require('express'),
	app          = express(),
	port         = 80,
	server       = require('http').createServer(app),
	sockets      = require('./sockets'),
	routes       = require('./routes'),
	helpers      = require('./utils'),
    bodyParser   = require('body-parser'),
	connection   = require('express-myconnection');
    
    global.db    = require('./config/message');
    global.PDF   = require('pdfkit');       
    global.fs    = require('fs');

    global.uniqueIDs = 0;
    global.noOfUsers = 0;
    global.qCount    = 0;
    global.startTime = new Date('10 Mar, 2016 11:00:00 GMT');
    global.endTime   = new Date('10 Mar, 2016 18:30:00 GMT');

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(require('connect-multiparty')())
    app.use(express.cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser.urlencoded({ extended: true }));
    app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');
    app.use("/", express.static(__dirname + '/public'));
    app.use(express.session({
        cookie: {
        path    : '/',
        httpOnly: false,
        maxAge  : 24*60*60*1000
    },
        secret: '1234567890QWERT'
    }));

    sockets.startSocketServer(server);
    routes(app);
    db.last_ids(function(data) {
        qCount    = data[0]['id'];
        uniqueIDs = data[0]['user_id'];
    });

    // db.truncate_table(function() {
    //     console.log("Truncated Table");
    // });

    console.log("Listening on port " + port);
    server.listen(port);
