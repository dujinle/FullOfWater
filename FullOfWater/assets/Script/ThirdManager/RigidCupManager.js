var EventManager = require('EventManager');
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
	initData(audioManager){
		this.audioManager = audioManager;
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
		this.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.CupTouchThing);
    },
	setStatus(type){
		var self = this;
		if(type == 'smile'){
			var call = cc.callFunc(function(){
				self.cupFinish.active = true;
				self.cupBegin.active = false;
				self.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.CupSmile);
				setTimeout(function(){
					GlobalData.GameInfoConfig.gameStatus = 0;
					EventManager.emit({type:'FinishGame'});
				},3000);
			},this);
			this.node.runAction(cc.sequence(cc.delayTime(1),call));
			
		}
	}
});
