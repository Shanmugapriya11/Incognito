var URL    = window.location.protocol + "//" + window.location.host;
var max_socket_reconnects = 6;
var socket = io.connect(URL);
var connected = false;
const RETRY_INTERVAL = 10000;
var timeout;

    var retryConnectOnFailure = function(retryInMilliseconds) {
        setTimeout(function() {
          if (!connected) {
            $.get('/ping', function(data) {
              connected = true;
              window.location.href = unescape(window.location.pathname);
            });
            retryConnectOnFailure(retryInMilliseconds);
          }
        }, retryInMilliseconds);
    };
    
    var reConnect = function(){
        $("#sendBox").hide();
        connected = false;
        console.log('disconnected');
        alert("<b>Disconnected! Trying to automatically to reconnect in " + RETRY_INTERVAL/1000 + " seconds.</b>");
        retryConnectOnFailure(RETRY_INTERVAL);
    };

    socket.on('connect', function() {
        connected = true;
        clearTimeout(timeout);
        $("#sendBox").show();
        console.log("connected");
    });

    socket.on('update_chat', function (data) {
        data = JSON.parse(data);
        Helper.composeMsg(data,"append");   
    });

    socket.on('update_old_chat', function (data) {
        $.each(data,function( intIndex, objValue ){
            Helper.composeMsg(objValue,"prepend");
        })      
        unlock = true;
    });

    socket.on('update_users', function(data) {
        console.log(data);
        $('#count').empty();
        $('#count').append('<span class="light-shades">No. of Participants:</span> ' + data);
    });

    socket.on('update_vote', function(question_id) {
        value = parseInt($('span[data-voteID="'+question_id+'"').text());
        $('span[data-voteid="'+question_id+'"').text(value + 1);
    });


    socket.on('remove_vote', function(question_id) {
        value = parseInt($('span[data-voteID="'+question_id+'"').text());
        $('span[data-voteid="'+question_id+'"').text(value - 1);
     });   

    socket.on('update_top_questions', function (data) {
        $('#top_questions').empty();
        if(data.length){
            $.each(data,function( intIndex, objValue ){
                Helper.composeQues(objValue);
            })
        }else {
            $('#top_questions')
            .append('<p style="cursor:none">The 3 posts with most likes get featured here!<p>');      
        }    
    });
    
    socket.on('event_over', function(){
        $("#sendBox").hide();
        Helper.event_over();
    });
    
    socket.on('disconnect', function(){
        reConnect();
    });

    socket.on('connect_failed', function () {
        reConnect();
    });
