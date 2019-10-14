var WxChaAd = require('WxChaAd');
cc.Class({
    extends: cc.Component,

    properties: {
		gotoHomeButton:cc.Node,
		returnGame:cc.Node,
    },
	onLoad(){
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
	},
	//继续游戏按钮回调
	onContinueCb(event){
		var self = this;
		GlobalData.game.audioManager.getComponent('AudioManager').resumeGameBg();
		this.hidePause(function(){
			self.node.active = false;
			GlobalData.GameInfoConfig.gameStatus = 1;
		});
	},
	//重新开始按钮回调
	onResetCb(event){
		var self = this;
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		this.hidePause(function(){
			self.node.active = false;
			if(GlobalData.GameInfoConfig.gameType == 1){
				GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
			}else{
				GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').destroyGame();
			}
			GlobalData.game.startGame.getComponent('StartGame').onShow();
		});
	},
	showPause(){
		console.log("showPause game board show");
		var self = this;
		this.node.active = true;
		this.gotoHomeButton.scale = 0;
		this.returnGame.scale = 0;
		this.returnGame.getComponent(cc.Button).interactable = false;
		this.gotoHomeButton.getComponent(cc.Button).interactable = false;
		var returnGameScale = cc.scaleTo(GlobalData.GameConfig.PauseGameMoveTime,1);
		this.returnGame.runAction(returnGameScale);
		var gotoHomeScale = cc.scaleTo(GlobalData.GameConfig.PauseGameMoveTime,1);
		this.gotoHomeButton.runAction(gotoHomeScale);
		
		if (typeof wx !== 'undefined') {
			WxChaAd.createChaAd(function(res){
				if(res == 'error'){
					self.returnGame.getComponent(cc.Button).interactable = true;
					self.gotoHomeButton.getComponent(cc.Button).interactable = true;
				}else if(res == 'close'){
					self.returnGame.getComponent(cc.Button).interactable = true;
					self.gotoHomeButton.getComponent(cc.Button).interactable = true;
				}
			});
		}else{
			self.returnGame.getComponent(cc.Button).interactable = true;
			self.gotoHomeButton.getComponent(cc.Button).interactable = true;
		}
	},
	hidePause(callBack = null){
		console.log("start game board hide");
		var returnGameAction = cc.scaleTo(GlobalData.GameConfig.PauseGameMoveTime,0.2);
		this.returnGame.runAction(returnGameAction);
		var gotoHomeAction = cc.scaleTo(GlobalData.GameConfig.PauseGameMoveTime,0.2);
		this.gotoHomeButton.runAction(gotoHomeAction);
		var hideAction = cc.callFunc(function(){
			if(callBack != null){
				callBack();
			}
		},this);
		
		this.node.runAction(cc.sequence(
			cc.delayTime(GlobalData.GameConfig.PauseGameMoveTime),
			hideAction
		));
	}
});