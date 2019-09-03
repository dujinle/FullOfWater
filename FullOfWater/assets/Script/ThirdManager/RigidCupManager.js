cc.Class({
    extends: cc.Component,

    properties: {
        cupShangXin:cc.Node,
		cupJingYa:cc.Node,
		cupSmile:cc.Node,
		audioManager:null,
    },
    onLoad () {
		this.rigidBody = this.node.getComponent(cc.RigidBody);
		this.setCupImage('shangxin');
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
	setCupImage(type){
		if(type == 'smile'){
			this.cupShangXin.active = false;
			this.cupJingYa.active = false;
			this.cupSmile.active = true;
		}else if(type == 'shangxin'){
			this.cupShangXin.active = true;
			this.cupJingYa.active = false;
			this.cupSmile.active = false;
		}else if(type == 'jingya'){
			this.cupShangXin.active = false;
			this.cupJingYa.active = true;
			this.cupSmile.active = false;
		}
	},
	setStatus(type){
		var self = this;
		if(type == 'smile'){
			this.setCupImage('smile');
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.CupSmile);
			setTimeout(function(){
				GlobalData.GameInfoConfig.gameStatus = 0;
				GlobalData.game.finishGame.getComponent('FinishGame').show();
			},2000);
		}else if(type == 'fail'){
			this.setCupImage('shangxin');
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.Complete);
			setTimeout(function(){
				GlobalData.GameInfoConfig.gameStatus = -1;
				GlobalData.game.finishGame.getComponent('FinishGame').show();
			},2000);
		}
	}
});
