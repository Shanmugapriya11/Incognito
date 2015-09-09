Initializer = (function () {
    var _IG = {
        format: function(n){
            return n > 9 ? "" + n: "0" + n;
        }, 
        displayTime: function (timeDiff,element,text) {
            timeDiff /= 1000;

            var seconds = Math.round(timeDiff % 60);
            timeDiff = Math.floor(timeDiff / 60);

            var minutes = Math.round(timeDiff % 60);
            timeDiff = Math.floor(timeDiff / 60);

            var hours = Math.round(timeDiff % 24);
            timeDiff = Math.floor(timeDiff / 24);

            var days = timeDiff;
            $(element).text(text + this.format(hours) + ":" + this.format(minutes) + ":" + this.format(seconds));
        }, 
        elapsedisplay: function () {
            var current = new Date();
            var timeDiff = current - startTime;
            
            _IG.displayTime(timeDiff,".elapsetime","Elapsed Time : ");
            setTimeout(this.elapsedisplay, 1000);
        },
        remainingdisplay: function () {
            var current = new Date();
            var timeDiff = endTime - current;
            
            _IG.displayTime(timeDiff,".remainingtime","Remaining Time : ");
            setTimeout(this.remainingdisplay, 1000);
        }, 
        initialize: function() {
            $('.voting').hide();
            $('.like').hide();
            $('#data').focus();        
            $('.smallSizeImg').attr('src', imageSrc);
            $('#user_name').append(userName);

            $("#dialog-message").dialog({
                modal: true,
                draggable: false,
                resizable: false,
                show: 'blind',
                hide: 'blind',
                width: 500,
                height: 350,
                dialogClass: 'ui-dialog-osx',
                buttons: {
                    "Got it!": function() {
                        $(this).dialog("close");
                    },
                    // "Disagree": function() {
                    //     window.location.href = "/";
                    // }
                }
            });
        },
        bindEvents: function () {
            //attach the "wheel" event if it is supported, otherwise "mousewheel" event is used
            $("html").on(("onwheel" in document.createElement("div") ? "wheel" : "mousewheel"), function (e) {
                var evt = e.originalEvent || e;

                //this is what really matters
                var deltaY = evt.deltaY || (-1 / 40 * evt.wheelDelta), //wheel || mousewheel
                    scrollTop = $(this).scrollTop() || $("body").scrollTop(), //fix safari
                    scrollText = "";

                if (deltaY < 0) {
                    if (minval != 1 && minval > 0 && minval != Number.MAX_VALUE && unlock){
                        unlock = false;
                        socket.emit('load_previous',minval);
                        minval = minval - 5;
                    }
                    else if(minval < 0 || minval == 1) {
                        $("html").off("onwheel" in document.createElement("div") ? "wheel" : "mousewheel") 
                    }
                }
            });
        
            $('#datasend').click( function() {
                var message = $('#data').val();
                if(message.length != 0){
                    $('#data').val('');
                    socket.emit('send_chat',message);
                }
                $('#data').focus();
            });

            $('#ac-2').click( function(){
                socket.emit('send_top_questions');
            });

            $("#conversation")
            .on('mouseenter','.list',function () {
                var num = this.id.match(/\d+/)[0];
                $("#vote_div_" + num).show();    
                var senderID = jQuery(this).data('senderid');
                if (senderID == userID){
                    $("#tolikeimg_" + num).css('cursor','not-allowed');
                }
            })
            .on('mouseleave','.list',function() {
                var num = this.id.match(/\d+/)[0];
                $("#vote_div_" + num).hide();
            })
            .on('click','.like',function () {
                var num = this.id.match(/\d+/)[0];
                $("#tolikeimg_" + num).show();
                $("#likeimg_" + num).hide();
                socket.emit('send_remove_vote',num);

            })  
            .on('click','.tolike',function (event) {
                var num = this.id.match(/\d+/)[0];
                var senderID = $(this).closest('.list').data('senderid');
                if (senderID == userID){
                    return false;
                }else{
                    $("#likeimg_" + num).show();
                    $("#tolikeimg_" + num).hide();
                    socket.emit('send_update_vote',num);   
                }
            });

            $("#top_questions")
            .on('click','.questions',function (e) {
                var num = this.id.match(/\d+/)[0];
                var container = $('#conversation'),scrollTo = $('#list_'+num);
                container.animate({
                    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                });
                $("#list_"+num).fadeOut(1000).fadeIn(1000);
            });
        },
        // initializeTimeout: function(){
        //     setTimeout(this.elapsedisplay, 1000);
        //     setTimeout(this.remainingdisplay,1000);

        //     setInterval(function(){ 
        //         socket.emit('send_top_questions',minval);
        //     }, 300000);

        //     setTimeout(function() {
        //         $("#sendBox").hide();
        //     },timediff);
            
        //     setTimeout(function() {
        //         $.get('/generatingPDF',{},function(data){
        //             if(userName != "anonymous_user"){
        //                 $("#footer").append("<div id='sessionEnd'>This Session has ended!</br/><input type='button' onclick=window.location.href='/download' value='Export Transcript'/></div>");
        //             }else{
        //                 $("#footer").append("<div id='sessionEnd'>This Session has ended!</br/></div>");
        //             }

        //             $("#conversation").unbind();
        //         })
        //     },timediff);
        // }
    };
    return {
        init: function () {
            _IG.initialize();
            //_IG.initializeTimeout();
            _IG.bindEvents();
        }
    };  
})();

    
    