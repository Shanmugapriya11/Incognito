var pool = require('./database');


var save = function(user){

pool.getConnection(function(err, connection){
  connection.query('INSERT INTO users SET ?', user, function(err, result){
    if(err) {
      throw err;
    }else{
      callback(err,result);
    }
  });
  connection.release();
})
};

var findOne = function(user,callback){

pool.getConnection(function(err, connection){
  connection.query('SELECT * FROM users WHERE id = ? ', user, function(err, result){
    if(err) {
      throw err;
    }else{
      callback(err, result);
    }
  });
  connection.release();
})
};

exports.save    = save
exports.findOne = findOne 