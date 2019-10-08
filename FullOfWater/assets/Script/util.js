let util = {
	getRandomObjForArray:function(array){
		if(array == null || array.length == 0){
			return -1;
		}
		var random = Math.floor(Math.random()*array.length);
		return array[random];
	},
	getRandomIndexForArray:function(array){
		if(array == null || array.length == 0){
			return -1;
		}
		var random = Math.floor(Math.random()*array.length);
		return random;
	},
	getCoverAge(node1,node2){
		var pos = node1.getPosition();
		var size = node1.getContentSize();
		var lpos = node2.getPosition();
		var lsize = node2.getContentSize();
		var coverage = new Array();
		for(var i = 0;i < 640;i++){
			coverage[i] = 0;
		}
		for(var i = Math.floor(pos.x - size.width/2 + 320);i < Math.floor(pos.x + size.width/2 + 320);i++){
			coverage[i] += 1;
		}
		for(var i = Math.floor(lpos.x - lsize.width/2 + 320);i < Math.floor(lpos.x + lsize.width/2 + 320);i++){
			coverage[i] += 1;
		}
		var totalCover = 0;
		for(var i = 0;i < 640;i++){
			if(coverage[i] == 2){
				totalCover += 1;
			}
		}
		return totalCover / lsize.width;
	},
	//获取随机数
	getRandomNum:function(rateType){
		var randomNumber = Math.random();
		var startRate = 0.0;
		//console.log("getRandomNum",randomNumber);
		for(var num in rateType){
			var rateTmp = rateType[num];
			if(randomNumber > startRate && randomNumber <= startRate + rateTmp){
				//console.log("getRandomNum",num);
				return num;
			}
			startRate += rateTmp;
		}
		
		//这里返回2 避免rateType设置错误导致无效
		return -1;
	},
	isArrayFn:function(value){
		if (typeof Array.isArray === "function") {
			return Array.isArray(value);
		}else{
			return Object.prototype.toString.call(value) === "[object Array]";
		}
	},
	//复制对象，如果存在属性则更新
	updateObj:function (newObj,obj,constKey) {
		if(typeof obj !== 'object'){
			console.log('not a object data');
			return;
		}
		//如果是一个数组对象则直接复制
		for(var key in obj){
			if(constKey == key){
				newObj[key] = obj[key];
			}else if(newObj[key] == null){
				newObj[key] = obj[key];
			}else if(typeof obj[key] !== 'object'){
				newObj[key] = obj[key];
			}else if(this.isArrayFn(obj[key])){
				newObj[key] = obj[key];
			}else if(typeof obj[key] == 'object'){
				this.updateObj(newObj[key],obj[key],constKey);
			}
		}
	},
	httpGET:function(url,param,cb){
		var xhr = cc.loader.getXMLHttpRequest();
		if(param == null){
			xhr.open("GET", url,false);
		}else{
			xhr.open("GET", url + "?" + param,false);
		}
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
				var result = JSON.parse(xhr.responseText);
				cb(xhr.status,result);
			}else{
				cb({"code":xhr.status,"message":xhr.message});
			}
		};
		xhr.send(null);
	},
	getPhoneModel:function(){
		var size = cc.view.getFrameSize();
		console.log('getFrameSize:',size);
		var biLi = cc.winSize.width / cc.winSize.height;
		if (typeof wx !== 'undefined') {
            try {
                var sysInfo = wx.getSystemInfoSync();
                if (sysInfo && sysInfo.model) {
                    // 适配iphoneX
                    var isFitIphoneX = (sysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphonex", 0) != -1);
                    if (isFitIphoneX) {
                        return 'IphoneX';
                    }
					if(biLi < 0.5){
						return 'IphoneX';
					}else{
						return 'Normal';
					}
                }
            } catch (error) {
				if(biLi < 0.5){
					return 'IphoneX';
				}else{
					return 'Normal';
				}
            }
        }
		if(biLi < 0.5){
			return 'IphoneX';
		}else{
			return 'Normal';
		}
	},
	customScreenAdapt(pthis){
		var DesignWidth = 640;
		var DesignHeight = 1136;
		let size = cc.view.getFrameSize();
		GlobalData.phoneModel = this.getPhoneModel();
		if (GlobalData.phoneModel == 'IphoneX'){ //判断是不是iphonex
			cc.view.setDesignResolutionSize(1125, 2436, cc.ResolutionPolicy.FIXED_WIDTH);
			pthis.node.scaleX = 1125 / 640;
			pthis.node.scaleY = 2436 / 1136;
			let openDataContext = wx.getOpenDataContext();
			let sharedCanvas = openDataContext.canvas;
			sharedCanvas.width = 640;
			sharedCanvas.height = 1136;
			pthis.mainGame.setPosition(cc.v2(0,-40));
			GlobalData.phoneModel = 'IphoneX';
		}else if(GlobalData.phoneModel == 'IphoneXR'){
			cc.view.setDesignResolutionSize(828, 1792, cc.ResolutionPolicy.FIXED_WIDTH);
			pthis.node.scaleX = 828 / 640;
			pthis.node.scaleY = 1792 / 1136;
			let openDataContext = wx.getOpenDataContext();
			let sharedCanvas = openDataContext.canvas;
			sharedCanvas.width = 640;
			sharedCanvas.height = 1136;
			pthis.mainGame.setPosition(cc.v2(0,-40));
			GlobalData.phoneModel = 'IphoneXR';
		}else{
			GlobalData.phoneModel = 'Normal';
		}
	},
	isIphoneX:function(){
		var size = cc.view.getFrameSize();
        var flag = (size.width == 375 && size.height == 812)
               ||(size.width == 812 && size.height == 375);
		return flag;
	},
	compareVersion:function(v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)
		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}
		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])
			if (num1 > num2) {
				return 1
			} else if (num1 < num2) {
				return -1
			}
		}
		return 0
	}
};
module.exports = util;