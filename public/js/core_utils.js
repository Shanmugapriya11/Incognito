CoreUtil = {
    BUBBLES: {
      left:  "bubble",
      right: "bubble bubble--alt",
      admin: "bubble bubble--admin"
    },
    composeMsg: function (data,types) {
        id         = data['id']
        senderID   = data['user_id'];
        senderName = data['user_name'];
        message    = data['message'];
        time       = data['time'];
        upvote     = data['upvote']
        imageNo    = senderID % IMAGES_COUNT;
        imageSrc   = "/images/profile_pictures/random/"+imageNo+".png"
        timestamp  = Math.floor(Date.parse(time) / 1000);

        name = senderName != "anonymous_user" ? senderName : "User "+senderID

        maxval = Math.max(id, maxval);
        minval = Math.min(id, minval);
                
        if(senderName == "anonymous_user"){
            style = side = senderID == userID ? "right" : "left";
            if (style == "right"){
                name = '<span class="userName bold">You<br/></span><span class="own_name">('+name+')</span>';
            }
        }else{
            style = senderID == userID ? "right" : "admin"
            side = style == "right" ? "right" : "left"
        }

        html = '<li class="list" id="list_'+id+'" data-senderid='+senderID+'><div class="main-wrap"><div class="'+side+'sidebar"><img class="smallprofileID" src='+imageSrc+'><span class="username">'+name+'</span></div><div class="'+side+'content-wrap"><div class="'+this.BUBBLES[style]+'">'+message+'<br/><br/><small class="'+side+'commentDateStamp" data-livestamp='+timestamp+'></small></div><div class="voting" id="vote_div_'+id+'"><img id="likeimg_'+id+'" class="like" src="/images/like.svg"/><img id="tolikeimg_'+id+'" class="tolike" src="/images/tolike.svg"/><span data-voteid='+id+' class="vote">'+upvote+'</span></div></div></div><div class="clear"></div><br/></li>'

        $('#conversation')[types](html)
        .animate({scrollTop: $('#conversation').prop('scrollHeight')}, 0);
         
        $('.voting').hide();
    }, 
    composeQues: function (data){
        var id         = data['id']
        var senderID   = data['user_id'];
        var senderName = data['user_name'];
        var message    = data['message'];
        var upvote     = data['upvote'];
        var imageNo    = userID % IMAGES_COUNT;
        var name       = senderName != "anonymous_user" ? senderName : "User "+senderID;

        message = message.substr(0,100);
        upvote  = upvote > 1 ? upvote+' Likes' : upvote+ ' Like'
        $('#top_questions')
        .append('<li class="questions" id="ques_'+id+'">'+message+'...<br/><span class="light-shades">'+name+' - '+upvote+'<span></li><br/>');
    },        
    event_over: function() {
        $("#sendBox").hide();
        if(userName != "anonymous_user"){
            $.get('/generatingPDF',{},function(data){
                $('#admin_end_msg').html('Good Job! <br><br><small class="leftcommentDateStamp" data-livestamp="">Now</small>');
                $("#admin-end-message").dialog({
                    modal: true,
                    draggable: false,
                    resizable: false,
                    show: 'blind',
                    hide: 'blind',
                    width: 600,
                    height: 300,
                    dialogClass: 'ui-dialog-osx',
                    close: function(event, ui) { window.location.href = "/end"; },
                    buttons: {
                        "Save conversation as a .pdf": function() {
                             window.location.href = "/download";
                            },
                        "Close": function() {
                            window.location.href = "/end";
                        }
                    }    
                })
            })
        }else{
            $('#anonymous_end_msg').html('Your voice has been heard <br><br><small class="leftcommentDateStamp" data-livestamp="">Now</small>');
            $("#anonymous-end-message").dialog({
                modal: true,
                draggable: false,
                resizable: false,
                show: 'blind',
                hide: 'blind',
                width: 600,
                height: 300,
                dialogClass: 'ui-dialog-osx',
                close: function(event, ui) { window.location.href = "/end"; }
            });
        }
        $("#conversation").unbind();
    }
}


    
    