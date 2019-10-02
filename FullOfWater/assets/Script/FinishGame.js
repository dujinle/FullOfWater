var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		rankSprite:cc.Node,
		isDraw:false,
		openSprite:cc.Node,
		reStartSprite:cc.Node,
		nextStartSprite:cc.Node,
    },
	onLoad(){
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
		this.reStartSprite.active = false;
		this.nextStartSprite.active = false;
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
		this.reStartSprite.active = false;
		this.nextStartSprite.active = false;
		this.node.active = true;
		this.isDraw = true;
		var param = {
			type:'gameOverUIRank',
			game:GlobalData.GameInfoConfig.gameType
		};
		ThirdAPI.getRank(param);
		if(GlobalData.GameInfoConfig.gameFailFlag == 1){
			this.reStartSprite.active = true;
			this.nextStartSprite.active = true;
			if(GlobalData.GameInfoConfig.gameFailTimes > 0){
				this.reStartSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['number' + GlobalData.GameInfoConfig.gameFailTimes];
				this.nextStartSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['number' + GlobalData.GameInfoConfig.gameFailTimes];
			}else{
				this.reStartSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share'];
				this.nextStartSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share'];
			}
		}
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
		if(GlobalData.GameInfoConfig.gameFailFlag == 1 && typeof wx !== 'undefined'){
			if(GlobalData.GameInfoConfig.gameFailTimes > 0){
				GlobalData.GameInfoConfig.gameFailTimes -= 1;
			}else{
				this.buttonShare('Frestart');
				return;
			}	
		}
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
		if(GlobalData.GameInfoConfig.gameFailFlag == 1 && typeof wx !== 'undefined'){
			if(GlobalData.GameInfoConfig.gameFailTimes > 0){
				GlobalData.GameInfoConfig.gameFailTimes -= 1;
			}else{
				this.buttonShare('Fnext');
				return;
			}
		}
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
	buttonShare(type){
		var param = {
			type:null,
			arg:type,
			successCallback:this.shareSuccessCb.bind(this),
			failCallback:this.shareFailedCb.bind(this),
			shareName:'share',
			isWait:true
		};
		ThirdAPI.shareGame(param);
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
		if(arg == 'Frestart'){
			GlobalData.GameInfoConfig.gameFailTimes = 3;
			this.restartButtonCb();
		}else if(arg == 'Fnext'){
			GlobalData.GameInfoConfig.gameFailTimes = 3;
			this.nextButtonCb();
		}
	},
	shareFailedCb(type,arg){
		console.log(type,arg);
		try{
			if(arg == 'Frestart'){
				var self = this;
				var content = '请分享到不同的群才可以开始游戏!';
				wx.showModal({
					title:'提示',
					content:content,
					cancelText:'取消',
					confirmText:'确定',
					confirmColor:'#53679c',
					success(res){
						if (res.confirm) {
							self.restartButtonCb();
						}else if(res.cancel){}
					}
				});
			}else if(arg == 'Fnext'){
				var self = this;
				var content = '请分享到不同的群才可以开始游戏!';
				wx.showModal({
					title:'提示',
					content:content,
					cancelText:'取消',
					confirmText:'确定',
					confirmColor:'#53679c',
					success(res){
						if (res.confirm) {
							self.nextButtonCb();
						}else if(res.cancel){}
					}
				});
			}
		}catch(err){
			console.log(err);
		}
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
