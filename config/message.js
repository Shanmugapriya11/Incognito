var pool = require('./database');

var insert_user = function(user){

pool.getConnection(function(err, connection){
  connection.query('INSERT INTO users SET ?', user, function(err, result){
    if(err) {
      throw err;
    }
  });
  connection.release();
})
};

var find_user = function(user){

pool.getConnection(function(err, connection){
  connection.query('SELECT * FROM users WHERE ', user, function(err, result){
    if(err) {
      throw err;
    }
  });
  connection.release();
})
};


var all_messages = function(callback){

pool.getConnection(function(err, connection){
  connection.query("select * from message",  function(err, rows){
    if(err) {
      throw err;
    }else{
      callback(rows);
    }
  });
  connection.release();
})
};

var insert_messages = function(msg){

pool.getConnection(function(err, connection){
  connection.query('INSERT INTO message SET ?', msg, function(err, result){
    if(err) {
      throw err;
    }
  });
  connection.release();
})
};


var update_vote = function(question_id){

pool.getConnection(function(err, connection){
  connection.query('UPDATE message SET upvote = upvote + 1 WHERE id = ?', question_id, function(err, result){
    if(err) {
      throw err;
    }
  });
  connection.release();
})
};

var remove_vote = function(question_id){
console.log(question_id + "question_id");
pool.getConnection(function(err, connection){
  connection.query('UPDATE message SET upvote = upvote - 1 WHERE id = ?', question_id, function(err, result){
    if(err) {
      throw err;
    }
  });
  connection.release();
})
};

var load_first = function(callback){

pool.getConnection(function(err, connection){
  connection.query("SELECT * FROM message ORDER BY id DESC LIMIT 10",  function(err, rows){
    if(err) {
      throw err;
    }else{
      callback(rows);
    }
  
  });
  connection.release();
})
};

var load_previous = function(last_id , callback){

pool.getConnection(function(err, connection){
  connection.query("SELECT * FROM message WHERE id < ? ORDER BY id DESC LIMIT 10", last_id, function(err, rows){
    if(err) {
      throw err;
    }else{
      callback(rows);
    }
  });
  connection.release();
})
};

var top_questions = function(callback){

pool.getConnection(function(err, connection){
  connection.query("SELECT * FROM message WHERE upvote > 0 ORDER BY upvote DESC LIMIT 3", function(err, rows){
    if(err) {
      throw err;
    }else{
      callback(rows);
    }
  });
  connection.release();
})
};

var truncate_table = function(callback){

pool.getConnection(function(err, connection){
  connection.query("TRUNCATE TABLE message", function(err, rows){
    if(err) {
      throw err;
    }else{
      callback();
    }
  });
  connection.release();
})
};

exports.all_messages   = all_messages
exports.insert         = insert_messages
exports.update_vote    = update_vote
exports.remove_vote    = remove_vote
exports.load_first     = load_first
exports.load_previous  = load_previous
exports.top_questions  = top_questions
exports.truncate_table = truncate_table
