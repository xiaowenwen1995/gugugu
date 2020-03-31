function init(){
	//插入up主“默认三连”按键
	userFollowButton();
	// 从存储中读取数据
	chrome.storage.local.get('currentProfileName', function(value) {
		var currentProfileName = JSON.stringify(value);
		if(currentProfileName == "{}")
		{
			currentProfileName = "js-like";
		}
		else
		{
			currentProfileName = value['currentProfileName'];
		}
    	console.log("gugu已就绪!");
    	console.log("模式为："+ currentProfileName);
		if(currentProfileName == "js-like")
		{
			sendListen();
		}
		else if(currentProfileName == "js-follow")
		{
			userListen();
		}
		else if(currentProfileName == "js-coin")
		{
			schnappi();
		}
	});
}

window.setTimeout(init,2000);

//一键三连操作
function gugu(){
	var like = document.getElementsByClassName("like")[0]; //点赞
	var coin = document.getElementsByClassName("coin")[0]; //投币
	var collect = document.getElementsByClassName("collect")[0]; //收藏
	like.click();  // 执行点击
	coin.click();
	collect.click();
	console.log("已完成一键三连啦！gugugu~");
}

//监听弹幕发送
function sendListen(){
	var send = document.getElementsByClassName("bilibili-player-video-btn-send")[0]; //发送按键
	send.onclick = function(){
		input = document.getElementsByClassName("bilibili-player-video-danmaku-input")[0]; // 弹幕文本框
		if (input.value == "下次一定" || input.value == "你币没了") {
			gugu(); //一键三连操作
		}
	}
}

//判断up主
function userListen(){
	follow = document.getElementById("js-fans-action");
	var video = document.getElementsByTagName("video")[0];
	video.onclick = function(){
		if(follow.innerHTML == "已默认三连")
		{
			gugu(); //一键三连操作
		}
	}
}

//监听视频播放，撒币模式
function schnappi(){
	var video = document.getElementsByTagName("video")[0];
	video.onclick = function(){
		gugu();
	}
}

//插入up主“默认三连”按键
function userFollowButton(){
	var userid = document.getElementById("v_upinfo").getElementsByClassName("username")[0].href.match(/\d+/g)[0];
	chrome.storage.local.get('userList', function(value) {
		// 页面操作
		var user_html = document.getElementById("v_upinfo").getElementsByClassName("name")[0];
		var div = document.createElement("div");
		var divClass = document.createAttribute('class');
		var divId = document.createAttribute("id");
		divId.value= "js-fans-action";
		// 名单判断
		if (JSON.stringify(value) == "{}") {
			divClass.value = "gugu-fans-action gugu-follow";
			div.innerHTML = '默认三连';
		}
		else {
			var userList = value["userList"];
			var user = userList.filter(function(e) {return e.userid == userid});
			if (user.length == 0) {
				divClass.value = "gugu-fans-action gugu-follow";
				div.innerHTML = '默认三连';
			}
			else{
				divClass.value = "gugu-fans-action gugu-unfollow";
				div.innerHTML = '已默认三连';
			}
		}
		div.setAttributeNode(divClass);
		div.setAttributeNode(divId);
		user_html.appendChild(div); //插入html元素
		userFollowButtonListen(); // 监听插入的按键
	});
}

//监听up主“默认三连”按键
function userFollowButtonListen(){
	var userFollowButton = document.getElementById("js-fans-action"); //发送按键
	userFollowButton.onclick = function(){
		if(userFollowButton.classList.contains("gugu-follow"))  // 加入名单
		{
			userFollowButton.classList.remove("gugu-follow");
			userFollowButton.classList.add("gugu-unfollow");
			userFollowButton.innerHTML = "已默认三连";
			chrome.storage.local.get('userList', function(value) {
				user = document.getElementById("v_upinfo");
				var userid = user.getElementsByClassName("username")[0].href.match(/\d+/g)[0];
				var userAvatarURL = user.getElementsByTagName("img")[0].src;
				var userName = user.getElementsByClassName("username")[0].innerHTML;
				if(JSON.stringify(value) == "{}")
				{
					userList = [{"userid":userid, "userAvatarURL":userAvatarURL, "userName": userName}];
				}
				else{
					var userList = value["userList"];
					userList.push({"userid":userid, "userAvatarURL":userAvatarURL, "userName": userName})
				}
				// 往存储中写入数据
  				chrome.storage.local.set({'userList': userList}, function() {
      				console.log("save userList!");
  				});
			});
		}
		else{
			userFollowButton.classList.remove("gugu-unfollow");  // 退出名单
			userFollowButton.classList.add("gugu-follow");
			userFollowButton.innerHTML = "默认三连";
			chrome.storage.local.get('userList', function(value) {
				var userList = value['userList'];
				user = document.getElementById("v_upinfo");
				var userid = user.getElementsByClassName("username")[0].href.match(/\d+/g)[0];
				var user_target = userList.filter(function(e) {return e.userid == userid});
				var index = userList.indexOf(user_target[0]);
				index > -1 && userList.splice(index,1); //从json数组中删除用户
				// 往存储中写入数据
  				chrome.storage.local.set({'userList': userList}, function() {
      				console.log("save userList!");
  				});
			});
		}
	}
}

