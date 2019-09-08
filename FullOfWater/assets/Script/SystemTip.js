cc.Class({
    extends: cc.Component,

    properties: {
        
    },
	onClose(){
		this.node.active = false;
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.finishGame.getComponent('FinishGame').hide();
		if(GlobalData.GameInfoConfig.gameType == 1){
			GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
		}else{
			GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').destroyGame();
		}
		GlobalData.game.startGame.getComponent('StartGame').onShow();
	}
});
