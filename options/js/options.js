/* 初始化 */
chrome.storage.local.get('userList', function(value) {
	if (JSON.stringify(value) != "{}")
	{
		var userList = value['userList'];
		//var userList=[{"userid":546195, "userAvatarURL":"//i2.hdslb.com/bfs/face/bc5ca101313d4db223c395d64779e76eb3482d60.jpg@68w_68h.webp", "userName": "老番茄"}]
		ul = document.getElementById("js-user");
		for (i in userList) {
			li = document.createElement("li");
			li_innerHTML = '<li class="gugu-list-item">\
								<a href="https://space.bilibili.com/'+userList[i].userid+'" target="_blank">\
									<span class="gugu-avatar"><img src="'+userList[i].userAvatarURL+'"></span>\
									<span class="gugu-username">'+userList[i].userName+'</span>\
								</a>\
								<div class="gugu-fans-action gugu-follow" id="'+userList[i].userid+'">默认三连</div>\
							</li>'
			li.innerHTML = li_innerHTML;
			ul.appendChild(li);
		}
		followListen();
	}
  });


// 按键监听
function followListen(){
	var userFollowButtonList = document.getElementsByClassName("gugu-fans-action");
	for (var i = userFollowButtonList.length - 1; i >= 0; i--) {
		handleClick(i, setFollowActive.bind(this, i));
	}
}

function setFollowActive(idx)
{
	var userFollowButton = document.getElementsByClassName("gugu-fans-action")[idx];
	if(userFollowButton.classList.contains("gugu-follow"))  // 删除名单
	{
		userFollowButton.classList.remove("gugu-follow");
		userFollowButton.classList.add("gugu-unfollow");
		userFollowButton.innerHTML = "默认白嫖";
		chrome.storage.local.get('userList', function(value) {
				var userList = value['userList'];
				var userid = userFollowButton.id;
				var user_target = userList.filter(function(e) {return e.userid == userid});
				var index = userList.indexOf(user_target[0]);
				index > -1 && userList.splice(index,1); //从json数组中删除用户
				// 往存储中写入数据
  				chrome.storage.local.set({'userList': userList}, function() {
      				console.log("save userList!");
  				});
			});
	}
	else {
		userFollowButton.classList.remove("gugu-unfollow");  // 添加名单
		userFollowButton.classList.add("gugu-follow");
		userFollowButton.innerHTML = "默认三连";
		chrome.storage.local.get('userList', function(value) {
				var userName = userFollowButton.parentNode.getElementsByClassName("gugu-username")[0].innerHTML;
				var userAvatarURL = userFollowButton.parentNode.getElementsByTagName("img")[0].src;
				var userid = userFollowButton.id;
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
}

// 点击句柄
function handleClick(idx, handler) {
    document.getElementsByClassName("gugu-fans-action")[idx].addEventListener('click', handler, false);
}


/*localStorage = window.localStorage
var currentProfileName = localStorage['gugu.local.currentProfileName'];
if(typeof currentProfileName === 'undefined')
{
	currentProfileName = 'js-like';
}
document.getElementById(currentProfileName).parentElement.classList.add('gugu-active');



// 菜单选中显示
function setProfileActive(currentProfileName)
{
	var items = ['js-like','js-follow','js-coin'];
	items.forEach(function(item) {
		if(document.getElementById(item).parentElement.classList.contains('gugu-active')){
        	document.getElementById(item).parentElement.classList.remove('gugu-active');
    	}
	})
	document.getElementById(currentProfileName).parentElement.classList.add('gugu-active');
	localStorage['gugu.local.currentProfileName'] = currentProfileName
  // 往存储中写入数据
  chrome.storage.local.set({'gugu.local.currentProfileName': currentProfileName}, function() {
      console.log("save "+ currentProfileName);
  });

}

// 点击句柄
function handleClick(id, handler) {
    document.getElementById(id).addEventListener('click', handler, false);
}

 handleClick('js-like', setProfileActive.bind(this, 'js-like'));
 handleClick('js-follow', setProfileActive.bind(this, 'js-follow'));
 handleClick('js-coin', setProfileActive.bind(this, 'js-coin'));*/