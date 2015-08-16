var socketio = require('socket.io'),
        io, clients = {};

var chat_messages = "";
var time;
var username;
var usertype;

module.exports = {

        startSocketServer: function (app) {
                io = socketio.listen(app);

                // // configure
                // io.configure('development', function () {
                //         //io.set('transports', ['websocket', 'xhr-polling']);
                //         //io.enable('log');
                // });

                // io.configure('production', function () {
                //         io.enable('browser client minification');  // send minified client
                //         io.enable('browser client etag');          // apply etag caching logic based on version number
                //         io.set('log level', 1);                    // reduce logging
                //         io.set('transports', [                     // enable all transports (optional if you want flashsocket)
                //             'websocket'
                //           , 'flashsocket'
                //           , 'htmlfile'
                //           , 'xhr-polling'
                //           , 'jsonp-polling'
                //         ]);
                // });


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
                    });

                });

        }
};