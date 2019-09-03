cc.Class({
    extends: cc.Component,

    properties: {
        
    },
	onClose(){
		this.node.active = false;
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.finishGame.getComponent('FinishGame').hide();
		GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
		GlobalData.game.startGame.getComponent('StartGame').onShow();
	}
});
