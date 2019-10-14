cc.Class({
    extends: cc.Component,

    properties: {
        okBtn:cc.Node,
		conBtn:cc.Node,
		label:cc.Node,
		actionType:null,
    },
	onLoad(){
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
	},
	onShow(type,flag,cb,gameType){
		this.label.getComponent(cc.Label).string = GlobalData.msgBox[type];
		if(flag == false){
			this.okBtn.active = false;
			this.conBtn.active = false;
			this.label.y = 0;
		}else{
			this.okBtn.active = true;
			this.conBtn.active = true;
			this.label.y = 130;
		}
		this.actionType = type;
		this.gameType = gameType;
		if(cb != null){
			this.cb = cb;
		}
		this.node.active = true;
	},
	onClose(){
		this.node.active = false;
		if(this.actionType == 'GameFinishContent'){
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
			GlobalData.game.finishGame.getComponent('FinishGame').hide();
			if(this.gameType == 1){
				GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
			}else{
				GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').destroyGame();
			}
			GlobalData.game.startGame.getComponent('StartGame').onShow();
		}else if(this.actionType == 'DelTrue'){
			this.node.active = false;
		}else{
			if(this.cb != null){
				this.cb();
			}
			if(this.gameType == 1){
				GlobalData.GameInfoConfig.onSystemDel = 1;
				GlobalData.cdnGameConfig.delFalg = 2;
			}else{
				GlobalData.GameInfoConfig.onSystemBDDel = 1;
				GlobalData.cdnGameConfig.bdDelFlag = 2;
			}
		}
		
	},
	//清除数据
	btnCb(event){
		if(this.actionType == 'StartContent'){
			if(this.gameType == 1){
				GlobalData.GameInfoConfig.GameCheckPoint = 1;
				GlobalData.cdnGameConfig.delFalg = 2;
				GlobalData.GameInfoConfig.onSystemDel = 1;
			}else{
				GlobalData.GameInfoConfig.GameBuDaoPoint = 1;
				GlobalData.cdnGameConfig.bdDelFlag = 2;
				GlobalData.GameInfoConfig.onSystemBDDel = 1;
			}
		}else if(this.actionType == 'DelTrue'){
			if(this.gameType == 1){
				GlobalData.GameInfoConfig.onSystemDel = 1;
				GlobalData.GameInfoConfig.GameCheckPoint = 1;
				GlobalData.cdnGameConfig.delFalg = 2;
			}else{
				GlobalData.GameInfoConfig.GameBuDaoPoint = 1;
				GlobalData.cdnGameConfig.bdDelFlag = 2;
				GlobalData.GameInfoConfig.onSystemBDDel = 1;
			}
		}
		if(this.cb != null){
			this.cb();
		}
		this.node.active = false;
	},
	//继续游戏
	conBtnCb(event){
		this.node.active = false;
		if(this.gameType == 1){
			GlobalData.GameInfoConfig.onSystemDel = 1;
			GlobalData.cdnGameConfig.delFalg = 2;
		}else{
			GlobalData.cdnGameConfig.bdDelFlag = 2;
			GlobalData.GameInfoConfig.onSystemBDDel = 1;
		}
		if(this.cb != null){
			this.cb();
		}
	}
});
