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

            name = senderName != "anonymous_user" ? senderName : "user_"+senderID

            maxval = Math.max(id, maxval);
            minval = Math.min(id, minval);
                 
            if(senderName == "anonymous_user"){
                style = side = senderID == userID ? "right" : "left"
            }else{
                style = senderID == userID ? "right" : "admin"
                side = style == "right" ? "right" : "left"
            }

            html = '<li class="list" id="list_'+id+'" data-senderid='+senderID+'><div class="main-wrap"><div class="'+side+'sidebar"><img class="smallprofileID" src='+imageSrc+'><span class="username">'+name+'</span></div><div class="'+side+'content-wrap"><div class="'+this.BUBBLES[style]+'">'+message+'<br/><br/><small class="'+side+'commentDateStamp" data-livestamp='+timestamp+'></small></div><div class="voting" id="vote_div_'+id+'"><img id="likeimg_'+id+'" class="like" src="/images/like.png"/><img id="tolikeimg_'+id+'" class="tolike" src="/images/tolike.png"/><span data-voteid='+id+' class="vote">'+upvote+'</span></div></div></div><div class="clear"></div><br/></li>'

            $('#conversation')[types](html)
            .animate({scrollTop: $('#conversation').prop('scrollHeight')}, 0);
             
            $('.voting').hide();
        }, 
        composeQues: function (data){
            var id      = data['id']
            var message = data['message'];
            var userID  = data['user_id'];
            var imageNo = userID % IMAGES_COUNT;

            message = message.substr(0,100);
            $('#top_questions')
            .append('<li class="questions" id="ques_'+id+'"><div class="main-wrap"><div class="leftimg"><img class="smallprofileID" src="/images/profile_pictures/random/'+imageNo+'.png"/></div><div class="righttext"> '+message+'...</div></div></li><br />');
        }
};

    
    