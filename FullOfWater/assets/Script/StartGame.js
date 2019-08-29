var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		startButton:cc.Node,
		soundOnNode:cc.Node,
		soundOffNode:cc.Node,
		scoreLabel:cc.Node,
		callback:null,
    },
	onShow(){
		this.node.active = true;
		if(GlobalData.GameInfoConfig.audioSupport == 1){
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
		}else{
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}
		this.scoreLabel.getComponent(cc.Label).string = '第' + GlobalData.GameInfoConfig.GameCheckPoint + '关';
	},
	battleButtonCb(event){
		GlobalData.game.EventFunc({type:'BattleView'});
	},
	startButtonCb(event){
		this.node.active = false;
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.mainGame.getComponent('MainGame').initGame();
	},
	soundButtonCb(){
		if(GlobalData.GameInfoConfig.audioSupport == 0){
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
			GlobalData.GameInfoConfig.audioSupport = 1;
		}else{
			GlobalData.GameInfoConfig.audioSupport = 0;
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}
	},
    shareButtonCb(){
		var param = {
			type:null,
			arg:null,
			successCallback:this.shareSuccessCb.bind(this),
			failCallback:this.shareFailedCb.bind(this),
			shareName:'share',
			isWait:false
		};
		ThirdAPI.shareGame(param);
	},
	rankButtonCb(){
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		var rankGameScene = cc.instantiate(GlobalData.assets['RankGameScene']);
		GlobalData.game.node.addChild(rankGameScene);
		rankGameScene.setPosition(cc.v2(0,0));
		rankGameScene.getComponent('RankGame').show();
	},
	groupRankButtonCb(){
		GlobalData.game.EventFunc({type:'RankGroupView'});
	},
	shareSuccessCb(type, shareTicket, arg){
		console.log(type, shareTicket, arg);
	},
	shareFailedCb(type,arg){
		console.log(type,arg);
	},
});
