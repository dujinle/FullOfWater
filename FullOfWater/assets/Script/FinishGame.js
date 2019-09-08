var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		rankSprite:cc.Node,
		isDraw:false,
		openSprite:cc.Node,
    },
	onLoad(){
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
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
			type:'gameOverUIRank',
			game:GlobalData.GameInfoConfig.gameType
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
		if(GlobalData.GameInfoConfig.gameType == 1){
			GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
			GlobalData.game.mainGame.getComponent('MainGame').initGame();
		}else{
			GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').destroyGame();
			GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
		}
		this.hide();
	},
	nextButtonCb(){
		if(GlobalData.GameInfoConfig.gameType == 1){
			if(GlobalData.GameInfoConfig.gameStatus == -1){
				GlobalData.GameInfoConfig.GameCheckPoint -= 1;
			}
			if(GlobalData.GameCheckInfo[GlobalData.GameInfoConfig.GameCheckPoint + 1] == null){
				GlobalData.game.systemTip.active = true;
				return;
			}
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
			GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
			this.hide();
			
			GlobalData.GameInfoConfig.GameCheckPoint += 1;
			GlobalData.game.mainGame.getComponent('MainGame').initGame();
		}
		else{
			if(GlobalData.GameInfoConfig.gameStatus == -1){
				GlobalData.GameInfoConfig.GameBuDaoPoint -= 1;
			}
			if(GlobalData.GameBuDaoInfo[GlobalData.GameInfoConfig.GameBuDaoPoint + 1] == null){
				GlobalData.game.systemTip.active = true;
				return;
			}
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
			GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').destroyGame();
			this.hide();
			
			GlobalData.GameInfoConfig.GameBuDaoPoint += 1;
			GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
		}
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
