var socketio = require('socket.io'),
    io, clients = {};
var msg_details = "";

module.exports = {
        startSocketServer: function (app) {
            io = socketio.listen(app);
            io.sockets.on('connection', function (socket) {

            socket.on('send_chat', function (data) {
                qCount++;
                msg_details = { id: qCount, user_id: socket.userID , user_name: socket.userName, message: data, time: new Date(), upvote: 0};
                db.insert(msg_details);
                io.sockets.emit('update_chat',JSON.stringify(msg_details));

            });

            socket.on('send_new_user', function(data){
                socket.userID   = data['userID']
                socket.userName = data['userName'];

                db.load_first(function(result) {
                    socket.emit('update_old_chat',result); 
                });
                io.sockets.emit('update_users', noOfUsers);
            });

            socket.on('load_previous', function(last_id){
                db.load_previous(last_id, function(result) {
                    socket.emit('update_old_chat',result); 
                })
            });

            socket.on('send_top_questions', function(){
                db.top_questions(function(result) {
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
                noOfUsers = noOfUsers < 0 ? 0 : noOfUsers;
                io.sockets.emit('update_users', noOfUsers);
            });

        });
    }
};