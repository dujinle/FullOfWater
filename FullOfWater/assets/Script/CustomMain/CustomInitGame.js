
var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		mainGame:cc.Node,
		type:1,
		buttonF:cc.Node,
		buttonB:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
		this.buttonF.getComponent(cc.Button).interactable = false;
		this.buttonB.getComponent(cc.Button).interactable = false;
		this.loadDataSync();
    },
	loadDataSync(){
		var self = this;
		//异步加载动态数据
		this.rate = 0;
		this.resLength = 6;
		GlobalData.assets = {};
		GlobalData.game = this;
		this.loadUpdate = function(){
			console.log("this.rate:" + self.rate);
			var scale = Math.floor((self.rate/self.resLength ) * 100);
			if(self.rate >= self.resLength){
				self.unschedule(self.loadUpdate);
				self.buttonF.getComponent(cc.Button).interactable = true;
				self.buttonB.getComponent(cc.Button).interactable = true;
			}
		};
		cc.loader.loadResDir("prefabs",function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				GlobalData.assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				if(assets[i].name == 'AudioManager'){
					self.audioManager = cc.instantiate(assets[i]);
				}
				console.log("load res prefab:" + assets[i].name);
			}
		});
		this.schedule(this.loadUpdate,0.5);
	},
	guankaButton(event,data){
		this.type = parseInt(data);
		this.buttonF.active = false;
		this.buttonB.active = false;
		this.mainGame.getComponent('CustomMainGame').setType(this.type);
		this.mainGame.getComponent('CustomMainGame').initGame();
	}
});
