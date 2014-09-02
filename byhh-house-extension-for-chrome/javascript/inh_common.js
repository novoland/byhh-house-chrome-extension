var bbsUrl = "http://bbs.whnet.edu.cn/cgi-bin/bbsnewtdoc?board=House";
//在本地维护两个数据结构：已读 / 未读消息，是两个hashmap，key为"发表时间_作者"形式。
var readedKey = "inh_readed";
var freshKey = "inh_fresh";
function F(){
return window.localStorage.getItem(freshKey)?$.parseJSON(window.localStorage.getItem(freshKey)):{};
}

function R(){
return window.localStorage.getItem(readedKey)?$.parseJSON(window.localStorage.getItem(readedKey)):{};
}

function setF(fresh){
	window.localStorage.setItem(freshKey,JSON.stringify(fresh));
}

function setR(readed){
	window.localStorage.setItem(readedKey,JSON.stringify(readed));
}