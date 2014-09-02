 template.helper('$',$);
    template.helper('Object',Object);


    //1.loading效果 ok 2.刷新功能 ok 3.标记为已读  4.显示上次抓取时间 ok 5. 没有帖子的显示
    $(function(){
        var fresh = F();
        var readed = R();
        var readed = window.localStorage.getItem(readedKey)?$.parseJSON(window.localStorage.getItem(readedKey)):{};
        $('body').html(template.render('t-list',{'posts':fresh}));
        // $("*[data-original-title]").tooltip({placement:"top"});

        //刷新功能
        $(".icon-refresh").on('click',function(){
            loadPost($(this).closest(".accordion-heading").next());
        });

        //标记为已读
        $('.icon-trash').on('click',function(event){
            var postKey = $(this).closest(".accordion-heading").next().attr("postKey");
            readed[postKey] = fresh[postKey];
            delete fresh[postKey];
            setR(readed);
            setF(fresh);
            $(this).closest(".accordion-group").slideToggle();
            var postsSum = Object.keys(fresh).length;
            chrome.browserAction.setBadgeText({text:""+postsSum});
        });


        //展开的时候获取帖子正文
        $('.collapse').on('show',function(){
            var postKey = $(this).attr('postKey');
            var article = $(this).find("pre");
            //如果已经获取了正文，则直接显示
            if(fresh[postKey].content){
                article.html(fresh[postKey].content);
                return;
            }
            //否则用ajax请求
            loadPost($(this));
        });

        //载入某个帖子
        function loadPost(accordionBody){
            var postKey = accordionBody.attr('postKey');
            var article = accordionBody.find("pre").html("loading....");
            var lastCaptureTimeSpan = accordionBody.prev().find(".lastCaptureTime");
            var refreshIcon = accordionBody.prev().find(".icon-refresh");
            $.get(accordionBody.attr('url'),function(data){
                var postId = fresh[postKey]["id"];
                var content = $(data).find("textarea").html();
                article.html(content);
                fresh[postKey]["content"] = content;
                var now = moment().format("MM-DD hh:mm");
                fresh[postKey]["lastCaptureTime"] = now;
                lastCaptureTimeSpan.text("最近抓取时间："+now);
                refreshIcon.show();
                setF(fresh);
            },'html');
        }
    });