var express      = require('express')
var app          = express();
var port         = 80;

var server       = require('http').createServer(app);
var io           = require('socket.io').listen(server);

var redis        = require("redis");
var redis_client = redis.createClient();

var bodyParser   = require('body-parser');
var connection   = require('express-myconnection'); 
var PDF          = require('pdfkit');           
var fs           = require('fs');
var dateFormat   = require('dateformat');

var passport     = require('passport');
var flash        = require('connect-flash');
var db           = require('./config/message');

var uniqueID = 0;
var noOfUsers = 0;
var qCount = 0;


  app.use(express.json());
  app.use(express.urlencoded());
  app.use(require('connect-multiparty')())
  app.use(express.logger('dev')); // log every request to the console
  app.use(express.cookieParser()); // read cookies (needed for auth)
  app.use(bodyParser.urlencoded({ extended: true }));
  
// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.

app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views

//app.set('views', __dirname + '/views');

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

  //app.set('view engine', 'ejs'); // set up ejs for templating
  app.use("/", express.static(__dirname + '/public'));
  app.use(express.session({
    cookie: {
      path    : '/',
      httpOnly: false,
      maxAge  : 24*60*60*1000
    },
    secret: '1234567890QWERT'
  }));

  // required for passport
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

  require('./config/passport')(passport); // pass passport for configuration

    console.log("Listening on port " + port);
    server.listen(port);
    redis_client.del('chat_app_messages')

    db.truncate_table(function() {
      console.log("Truncated Table");
    });

    app.get('/', function (req, res) {
      res.sendfile(__dirname + '/views/index.html');
    });
    

    app.get('/chat', function (req, res) {
      ++noOfUsers;
      ++uniqueID;

      if(req.user) {
          name = req.user.name;
          type = "admin";
       }   
       else{
          name = "user_"+uniqueID;
          type = "user";
       }
       res.render('chat', { username: name, userID: uniqueID, usertype: type });
    });

    app.get('/question', function (req, res) {
      res.sendfile(__dirname + '/views/question.html');
    });

    app.get('/generatingPDF',function(req, res){
      generatingPDF();
      res.setHeader('content-type','application/pdf');
      res.download('output.pdf');
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
    }));

    app.get('/error', function(req, res) {
        res.sendfile(__dirname + '/views/error.html');
    });
    
    app.get('/end',function(req, res) {
      var startTime = new Date('08/15/2015  9:00:00 AM');
      var endTime   = new Date('08/15/2015  9:00:00 PM');
      var currentTime = new Date();

      if (currentTime > endTime)          
        res.render('end', { timestamp: Math.floor(Date.parse(endTime) / 1000)})
      else 
        res.redirect('/')
    });

    app.get('*', function(req, res) {
        res.redirect('/error');
    });

var usernames = [];
var conversation = [];
var chat_messages = "";
var chat_questions = [];
var time;
var username;
var usertype;

io.sockets.on('connection', function (socket) {
  
  time = new Date();

  socket.on('send_chat', function (data) {
    qCount++;
    username = socket.username;
    usertype = socket.usertype;
    chat_messages = { id: qCount, sender: username , user_type: usertype, message: data, time: time, upvote: 0};
    //redis_client.hset('chat_app_messages', qCount, JSON.stringify(chat_messages));
    db.insert(chat_messages);
    io.sockets.emit('update_chat',JSON.stringify(chat_messages));

  });

  socket.on('send_new_user', function(data){
    socket.username = data['name'];
    socket.usertype = data['type']
    
    db.load_first(function(result) {
        console.log(result);
        socket.emit('update_old_chat',result); 

    });
    io.sockets.emit('update_users', noOfUsers);
  });

  socket.on('load_previous', function(last_id){
    console.log("loading previous !!!! " + last_id);
    db.load_previous(last_id, function(result) {
        console.log(result);
        socket.emit('update_old_chat',result); 
    })
   });

    socket.on('send_top_questions', function(){
    db.top_questions(function(result) {
        console.log(result);
        socket.emit('update_top_questions',result); 
    });

  });

  socket.on('send_update_vote',function(question_id){
    db.update_vote(question_id);
    io.sockets.emit('update_vote',question_id);
  });

  socket.on('send_remove_vote',function(question_id){
    db.remove_vote(question_id);
    io.sockets.emit('remove_vote',question_id);
  });

  socket.on('disconnect', function(){
    --noOfUsers;
    io.sockets.emit('updateusers', noOfUsers);
    //socket.broadcast.emit('updatechat', ' Server ', 'server', socket.username + ' has disconnected.',time);
  });

});

function generatingPDF(){
  doc = new PDF();                        
  doc.pipe(fs.createWriteStream('output.pdf'));  //creating a write stream 
  
  doc.fontSize(15)
     .text("---------------------------------------------------------------------------------")
     .fontSize(25)
     .text('Women @ Freshdesk')
     .fontSize(15)
     .text("---------------------------------------------------------------------------------");
  
  db.all_messages(function(result) {
      if(result){
        for(i=0;i<result.length;i++) {
          doc.fontSize(15).text(result[i]['sender']+ " : ");
          doc.fontSize(18).text(result[i]['message'], {paragraphGap: 10,indent: 20,align: 'justify',});
        }
      }       
      doc.end(); 
  });
};

