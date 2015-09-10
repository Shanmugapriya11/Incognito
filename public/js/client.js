var URL    = window.location.protocol + "//" + window.location.host;
var socket = io.connect(URL);

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
            .append(' <p>Do vote the questions!<p>');      
        }    
    });
