cc.Class({
    extends: cc.Component,

    properties: {
        cupBegin:cc.Node,
		cupFinish:cc.Node,
		audioManager:null,
    },
    onLoad () {
		this.rigidBody = this.node.getComponent(cc.RigidBody);
	},
	applyForce(vector,point){
		var increat = vector;
		increat.mulSelf(150);
		var worldPoint = this.rigidBody.getWorldCenter();
		console.log('eventTouchCancel',vector,point,worldPoint);
		this.rigidBody.applyForce(vector,point,true);
	},
	// 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
		if(GlobalData.game.audioManager != null){
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.CupTouchThing);
		}
    },
	setStatus(type){
		var self = this;
		if(type == 'smile'){
			this.cupFinish.active = true;
			this.cupBegin.active = false;
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.CupSmile);
			setTimeout(function(){
				GlobalData.GameInfoConfig.gameStatus = 0;
				GlobalData.game.finishGame.getComponent('FinishGame').show();
			},2000);
		}else if(type == 'fail'){
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.Complete);
			setTimeout(function(){
				GlobalData.GameInfoConfig.gameStatus = -1;
				GlobalData.game.finishGame.getComponent('FinishGame').show();
			},2000);
		}
	}
});
