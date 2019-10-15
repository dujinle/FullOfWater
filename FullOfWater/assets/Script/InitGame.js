var util = require('util');
var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		startGame:cc.Node,
		mainGame:cc.Node,
		mainBuDaoGame:cc.Node,
		finishGame:cc.Node,
		pauseGame:cc.Node,
		rankGame:cc.Node,
		systemTip:cc.Node,
		audioManager:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
		ThirdAPI.loadLocalData();
		this.loadDataSync();
		GlobalData.game = this;
		ThirdAPI.loadCDNData();
		this.startGame.getComponent('StartGame').onShow();
		this.startGame.getComponent('StartGame').btnFalse(false);
		this.mainBuDaoGame.active = false;
		this.mainGame.active = false;
		this.finishGame.active = false;
		this.pauseGame.active = false;
		this.rankGame.active = false;
		this.systemTip.active = false;
		util.customScreenAdapt();
    },
	loadDataSync(){
		var self = this;
		//异步加载动态数据
		this.rate = 0;
		this.resLength = 16;
		GlobalData.assets = {};
		this.loadUpdate = function(){
			console.log("this.rate:" + self.rate);
			var scale = Math.floor((self.rate/self.resLength ) * 100);
			if(self.rate >= self.resLength){
				self.unschedule(self.loadUpdate);
				self.startGame.getComponent('StartGame').btnFalse(true);
			}
		};
		cc.loader.loadRes("dynamicPlist", cc.SpriteAtlas, function (err, atlas) {
			for(var key in atlas._spriteFrames){
				console.log("load res :" + key);
				GlobalData.assets[key] = atlas._spriteFrames[key];
			}
			//self.rate = self.rate + 1;
		});
		cc.loader.loadResDir("dynImages", cc.SpriteFrame, function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				console.log("load res :" + assets[i].name);
				GlobalData.assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
			}
		});
		cc.loader.loadResDir("prefabs",function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				GlobalData.assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				console.log("load res prefab:" + assets[i].name);
			}
		});
		this.schedule(this.loadUpdate,0.5);
	},
	// called every frame
    update: function (dt) {

    },
});
