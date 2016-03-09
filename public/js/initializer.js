Initializer = (function () {
    var _IG = {
        format: function(n){
            return n > 9 ? "" + n: "0" + n;
        }, 
        displayTime: function(total_seconds,element,text) {
            var total_seconds = total_seconds /= 1000;

            var h    = Math.floor(total_seconds / 3600);
            var min  = Math.floor((total_seconds / 60) % 60);
            var sec  = Math.floor(total_seconds % 60);
            //var days = Math.floor(total_seconds / 24);

            text = '<span class="light-shades">'+text +'</span>'
            $(element).html(text + this.format(h) + ":" + this.format(min) + ":" + this.format(sec));
        },
        elapsedisplay: function () {
            var current = new Date();
            var timeDiff = current - startTime;
            _IG.displayTime(timeDiff,".elapsetime","Elapsed Time : ");
        },
        remainingdisplay: function () {
            var current = new Date();
            var timeDiff = endTime - current;
            _IG.displayTime(timeDiff,".remainingtime","Remaining Time : ");
        }, 
        initialize: function() {
            $('#data').focus();        
            // $('.voting').hide();
            $('.like').hide();
            $('.smallSizeImg').attr('src', imageSrc);
            $('.userName').append('<span class="light-shades smallFont">(User '+userID+')</span>');            
            $("#dialog-message").dialog({
                modal: true,
                draggable: false,
                resizable: false,
                show: 'blind',
                hide: 'blind',
                width: 500,
                height: 330,
                dialogClass: 'ui-dialog-osx',
                buttons: {
                    "Got it!": function() {
                        $(this).dialog("close");
                    }
                }
            });
        },
        load_post: function(){
            console.log("load_post");
            if (minval != 1 && minval > 0 && minval != Number.MAX_VALUE && unlock){
                unlock = false;
                socket.emit('load_previous',minval);
                minval = minval - 5;
            }
            console.log(minval);
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
                    _IG.load_post();
                }
                else if(minval < 0 || minval == 1) {
                    $("html").off("onwheel" in document.createElement("div") ? "wheel" : "mousewheel") 
                }
            });
        
            $('#datasend').click( function() {
                var message = $('#data').val();
                console.log(message.length+"  print length");
                if(message.length > 0){
                    $("div.someClass").text(message);
                    var escaped = $("<div>").text(message).html();
                    $('#data').val('');
                    socket.emit('send_chat',escaped);
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
                var element = $('#list_'+num)
                if ($(document).find(element).length == 0) 
                { 
                   _IG.load_post();// -- Not Exist
                }
                // while(!present) {
                //     _IG.load_post();
                //     check = $(document).find(element);
                //     present = check.length > 0;
                // }
                var container = $('#conversation'),scrollTo = $('#list_'+num);
                console.log(container);
                container.animate({
                    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                });
                $("#list_"+num).fadeOut(1000).fadeIn(1000);
            });
        },
        initializeTimeout: function(){
            setInterval(this.elapsedisplay, 1000);
            setInterval(this.remainingdisplay,1000);

            setInterval(function(){ 
                socket.emit('send_top_questions',minval);
            }, 300000);

            setTimeout(function() {
                $("#sendBox").hide();
            },timediff);
            setTimeout(Helper.event_over,timediff);
        }
    };
    return {
        init: function () {
            _IG.initialize();
            _IG.initializeTimeout();
            _IG.bindEvents();
        }
    };  
})();

    
    