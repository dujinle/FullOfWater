cc.Class({
    extends: cc.Component,

    properties: {
        cupBegin:cc.Node,
		cupFinish:cc.Node,
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
	}
});
