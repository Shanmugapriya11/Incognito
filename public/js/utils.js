function n(n){
	return n > 9 ? "" + n: "0" + n;
}

function display(timeDiff,element,text)  // get seconds
{
    // strip the miliseconds
  timeDiff /= 1000;

  var seconds = Math.round(timeDiff % 60);
  timeDiff = Math.floor(timeDiff / 60);

  var minutes = Math.round(timeDiff % 60);
  timeDiff = Math.floor(timeDiff / 60);

  var hours = Math.round(timeDiff % 24);
  timeDiff = Math.floor(timeDiff / 24);

  var days = timeDiff;
  $(element).text(text + " : " +n(hours) + ":" + n(minutes) + ":" + n(seconds));
  
}
    
function composeQues(data){
  id      = data['id']
  message = data['message'];
  message = message.substr(0, 100);

  $('#top_questions')
  .append('<li class="questions" id="ques_'+id+'">'+message+'...</li>');
         
}

function composeMsg(data,types) {
  id      = data['id']
  sender  = data['sender'];
  type    = data['user_type'];
  message = data['message'];
  time    = data['time'];
  upvote  = data['upvote']
  timestamp = Math.floor(Date.parse(time) / 1000);
           
  maxval = Math.max(id, maxval);
  minval = Math.min(id, minval);
         
  if(type == 'admin'){
    if(username == sender){
      imageNO = userID;
      side = "right";
    }else{
      imageNO = parseInt(sender.substring(5));
      side = "admin";
    }

      // imageNO  = "admin";
      // side = "admin";
  }else {
    if(username == sender){
      imageNO = userID;
      side = "right";
    }else{
      imageNO = parseInt(sender.substring(5));
      side = "left";
    }
  }
      imgsrc = "/images/profile_pictures/noun_project/"+imageNO+".png"
      console.log(types+username+side);

      if(types == "prepend"){          
        if(side=="admin"){
            $('#conversation')
            .prepend('<li class="list" id="list_'+id+'"><div class="main-wrap"><div class="leftsidebar"><img class="smallprofileID" src='+imgsrc+'><span class="username">'+sender+'</span></div><div class="leftcontent-wrap"><div class="bubble bubble--admin">'+message+'<br/><br/><small class="leftcommentDateStamp" data-livestamp='+timestamp+'></small></div><div class="voting" id="check_'+id+'"><img id="likeimg_'+id+'" class="like" src="/images/like.png"/><img id="tolikeimg_'+id+'" class="tolike" src="/images/tolike.png"/><span id="vote_'+id+'" class="vote">'+upvote+'</span></div></div></div><div class="clear"></div><br/></li>')
            .animate({scrollTop: $('#conversation').prop('scrollHeight')}, 0);
          }
          else{
            $('#conversation')
            .prepend('<li class="list" id="list_'+id+'"><div class="main-wrap"><div class="leftsidebar"><img class="smallprofileID" src='+imgsrc+'><span class="username">'+sender+'</span></div><div class="leftcontent-wrap"><div class="bubble">'+message+'<br/><br/><small class="leftcommentDateStamp" data-livestamp='+timestamp+'></small></div><div class="voting" id="check_'+id+'"><img id="likeimg_'+id+'" class="like" src="/images/like.png"/><img id="tolikeimg_'+id+'" class="tolike" src="/images/tolike.png"/><span id="vote_'+id+'" class="vote">'+upvote+'</span></div></div></div><div class="clear"></div><br/></li>')
            .animate({scrollTop: $('#conversation').prop('scrollHeight')}, 0);
          }
        }
        else if(side=="admin"){
            $('#conversation')
            .append('<li class="list" id="list_'+id+'"><div class="main-wrap"><div class="leftsidebar"><img class="smallprofileID" src='+imgsrc+'><span class="username">'+sender+'</span></div><div class="leftcontent-wrap"><div class="bubble bubble--admin">'+message+'<br/><br/><small class="leftcommentDateStamp" data-livestamp='+timestamp+'></small></div><div class="voting" id="check_'+id+'"><img id="likeimg_'+id+'" class="like" src="/images/like.png"/><img id="tolikeimg_'+id+'" class="tolike" src="/images/tolike.png"/><span id="vote_'+id+'" class="vote">'+upvote+'</span></div></div></div><div class="clear"></div><br/></li>')
            .animate({scrollTop: $('#conversation').prop('scrollHeight')}, 0);
        }
        else if(side=="left"){
            $('#conversation')
            .append('<li class="list" id="list_'+id+'"><div class="main-wrap"><div class="leftsidebar"><img class="smallprofileID" src='+imgsrc+'><span class="username">'+sender+'</span></div><div class="leftcontent-wrap"><div class="bubble">'+message+'<br/><br/><small class="leftcommentDateStamp" data-livestamp='+timestamp+'></small></div><div class="voting" id="check_'+id+'"><img id="likeimg_'+id+'" class="like" src="/images/like.png"/><img id="tolikeimg_'+id+'" class="tolike" src="/images/tolike.png"/><span id="vote_'+id+'" class="vote">'+upvote+'</span></div></div></div><div class="clear"></div><br/></li>')
            .animate({scrollTop: $('#conversation').prop('scrollHeight')}, 0);
        }else{
            $('#conversation')
            .append('<li class="list" id="list_'+id+'"><div class="main-wrap"><div class="rightsidebar"><img class="smallprofileID" src='+imgsrc+'><span class="username">'+sender+'</span></div><div class="rightcontent-wrap"><div class="bubble bubble--alt">'+message+'<br/><br/><small class="rightcommentDateStamp" data-livestamp='+timestamp+'></small></div><div class="voting" id="check_'+id+'"><img id="likeimg_'+id+'" class="like" src="/images/like.png"/><img id="tolikeimg_'+id+'" class="tolike" src="/images/tolike.png"/><span id="vote_'+id+'" class="vote">'+upvote+'</span></div></div></div><div class="clear"></div><br/></li>')
            .animate({scrollTop: $('#conversation').prop('scrollHeight')}, 0);   
        }       
            $('.voting').hide();
}
