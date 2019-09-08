var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		startButton:cc.Node,
		soundOnNode:cc.Node,
		soundOffNode:cc.Node,
		scoreLabel:cc.Node,
		openType:cc.Node,
		callback:null,
    },
	onLoad(){
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
	},
	onShow(){
		console.log('start game scene');
		this.node.active = true;
		if(GlobalData.GameInfoConfig.audioSupport == 1){
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
		}else{
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}
		this.scoreLabel.getComponent(cc.Label).string = '第' + GlobalData.GameInfoConfig.GameCheckPoint + '关';
		if(GlobalData.GameInfoConfig.guidBDFlag == 0){
			this.openType.active = true;
		}else{
			this.openType.active = false;
		}
	},
	bdButtonCb(event){
		if(GlobalData.GameInfoConfig.guidBDFlag == 0){
			if (typeof wx == 'undefined') {
				this.node.active = false;
				GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
				GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
				return;
			}
			var param = {
				type:null,
				arg:'budaoStart',
				successCallback:this.shareSuccessCb.bind(this),
				failCallback:this.shareFailedCb.bind(this),
				shareName:'share',
				isWait:true
			};
			ThirdAPI.shareGame(param);
		}else{
			this.node.active = false;
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
			GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
		}
		GlobalData.game.mainGame.active = false;
	},
	startButtonCb(event){
		this.node.active = false;
		GlobalData.game.mainBuDaoGame.active = false;
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
		GlobalData.game.rankGame.getComponent('RankGame').show();
	},
	shareSuccessCb(type, shareTicket, arg){
		if(arg == 'budaoStart'){
			this.node.active = false;
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
			GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
		}
	},
	shareFailedCb(type,arg){
		try{
			if(arg == 'budaoStart'){
				var self = this;
				var content = '请分享到不同的群获得更多的好友帮助!';
				wx.showModal({
					title:'提示',
					content:content,
					cancelText:'取消',
					confirmText:'确定',
					confirmColor:'#53679c',
					success(res){
						if (res.confirm) {
							self.bdButtonCb();
						}else if(res.cancel){}
					}
				});
			}
		}catch(err){
			console.log(err);
		}
	},
});
