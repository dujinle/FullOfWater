var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		rankSprite:cc.Node,
		isDraw:false,
		openSprite:cc.Node,
    },
	start(){
		try{
			this.texture = new cc.Texture2D();
			var openDataContext = wx.getOpenDataContext();
			this.sharedCanvas = openDataContext.canvas;
		}catch(error){}
	},
	show(){
		console.log("finish game show");
		GlobalData.game.audioManager.getComponent('AudioManager').stopGameBg();
		this.node.active = true;
		this.isDraw = true;
		var param = {
			type:'gameOverUIRank'
		};
		ThirdAPI.getRank(param);
	},
	hide(){
		this.isDraw = false;
		this.node.active = false;
	},
	rankButtonCb(){
		this.isDraw = false;
		GlobalData.game.rankGame.getComponent('RankGame').show();
	},
	restartButtonCb(){
		GlobalData.game.audioManager.getComponent("AudioManager").play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
		GlobalData.game.mainGame.getComponent('MainGame').initGame();
		this.hide();
	},
	nextButtonCb(){
		if(GlobalData.GameCheckInfo[GlobalData.GameInfoConfig.GameCheckPoint + 1] == null){
				return;
		}
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
		this.hide();
		if(GlobalData.GameInfoConfig.gameStatus == -1){
			GlobalData.GameInfoConfig.GameCheckPoint -= 1;
		}
		GlobalData.GameInfoConfig.GameCheckPoint += 1;
		GlobalData.game.mainGame.getComponent('MainGame').initGame();
	},
	shareToFriends(){
		var param = {
			type:null,
			arg:null,
			successCallback:this.shareSuccessCb.bind(this),
			failCallback:this.shareFailedCb.bind(this),
			shareName:'分享你的战绩',
			isWait:false
		};
		ThirdAPI.shareGame(param);
	},
	shareSuccessCb(type, shareTicket, arg){
		console.log(type, shareTicket, arg);
	},
	shareFailedCb(type,arg){
		console.log(type,arg);
	},
	rankSuccessCb(){
		if(!this.texture){
			return;
		}
		this.texture.initWithElement(this.sharedCanvas);
		this.texture.handleLoadedTexture();
		this.rankSprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.texture);
	},
	update(){
		//console.log("update finish game");
		if(this.isDraw == true){
			this.rankSuccessCb();
		}
	}
});
