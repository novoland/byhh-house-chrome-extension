template.helper('$',$);
      var notification;
      var notificationHideDelay = -1;//10s
      var capturePostsInterval = 1000*60*5;
        // window.localStorage.removeItem(readedKey);
        // window.localStorage.removeItem(freshKey);
      
      var timertask = function(){
        $.get(bbsUrl,function(data){
        var table = $(data).find("table[width='800']");
        var trs = table.find('tr');

        var postsFound = 0; //本次抓取发现的新出租帖子（没看过的，并且没有收录到未看帖子或已看帖子中的）
        var fresh = F();
        trs.each(function(i,e){
          //几个判定条件：1 是帖子 2 是出租帖子 3 未被收录到未读帖子集合中 4 是未读帖子
          if(isPost(e) && isRent(e) && !inFresh(e) && isFresh(e)){
            postsFound++;
            var key = getPostKey(e);
            fresh[key]={
              'key':key,
              'time':$($(e).children()[2]).find('em').text(),
              'title':getTdText(e,3).substring(1),
              'click':getTdText(e,5),
              'postUrl':"http://bbs.whnet.edu.cn/cgi-bin/"+$($(e).children()[3]).find('a').attr('href'),
              'id':$($(e).children()[3]).find('a').attr('href').split("=").pop()
            };
          }
        });
        setF(fresh);
        var postsSum = Object.keys(fresh).length;
        chrome.browserAction.setBadgeText({text:""+postsSum});  
          
        //个数通知  &  桌面通知
        if(postsFound <= 0)return;
        notification?notification.close():"";
        var notificationContent =template.render("notification-content",{'postsInfo':{'postsFound':postsFound,'postsSum':postsSum}});
        notification = new Notification(
          'Hi,',
          {
            icon:'/img/home.png', 
            body:notificationContent
          } 
        );
        if(notificationHideDelay>0)
          setTimeout(function(){notification.close();},notificationHideDelay);
      },'html');
	   }

     setInterval(timertask,capturePostsInterval);
     timertask();

      //判断一行是否帖子
      function isPost(e){
        return parseInt($(e).first().text())>0;
      }
      //一个帖子是否看过
      function isFresh(e){
        return !R()[getPostKey(e)];
      }
      //一个帖子是否已经在未读集合中
      function inFresh(e){
        return F()[getPostKey(e)];
      }
      //是否出租
      function isRent(e){
        var isRent = true;
        var filterPatterns = [/求租/,/权限/,/汇总/,/日租/,/格式/,/求合租/,/求短租/,/求/,/寻/];
        $(filterPatterns).each(function(i,p){
          if(p.test(getTdText(e,3))){
            isRent = false;
            return;
          }
        });
        return isRent;
      }
      //从一个帖子的tr中解析出key
      function getPostKey(e){
        //return getTdText(e,2)+"_"+getTdText(e,3);
        return $($(e).children()[3]).find("a").attr("href").split("file=")[1];
      }
      function getTdText(e,i){
        return $($(e).children()[i]).text().trim();
      }