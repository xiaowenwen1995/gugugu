/* 初始化 */
localStorage = window.localStorage
var currentProfileName = localStorage['gugu.local.currentProfileName'];
if(typeof currentProfileName === 'undefined')
{
	currentProfileName = 'js-like';
}
document.getElementById(currentProfileName).parentElement.classList.add('gugu-active');

/* 监听用户的选择 */

// 菜单选中显示
function setProfileActive(currentProfileName)
{
	items = ['js-like','js-follow','js-coin'];
	items.forEach(function(item) {
		if(document.getElementById(item).parentElement.classList.contains('gugu-active')){
        	document.getElementById(item).parentElement.classList.remove('gugu-active');
    	}
	})
	document.getElementById(currentProfileName).parentElement.classList.add('gugu-active');
	localStorage['gugu.local.currentProfileName'] = currentProfileName
  // 往存储中写入数据
  chrome.storage.local.set({'currentProfileName': currentProfileName}, function() {
      console.log("save "+ currentProfileName);
  });

}

// 点击句柄
function handleClick(id, handler) {
    document.getElementById(id).addEventListener('click', handler, false);
}

 handleClick('js-like', setProfileActive.bind(this, 'js-like'));
 handleClick('js-follow', setProfileActive.bind(this, 'js-follow'));
 handleClick('js-coin', setProfileActive.bind(this, 'js-coin'));