var MyPhysicsManager = require('MyPhysicsManager');
cc.Class({
    extends: cc.Component,

    properties: {
		body: {default: null},
		shape: {default: null}
    },
    start () {
		console.log('RigidBox');
		var pos = this.node.getPosition();
		console.log(pos);
		this.body = new p2.Body({
			mass: 1,
			position: [pos.x/MyPhysicsManager._factor, pos.y/MyPhysicsManager._factor],
			angle: -this.node.rotation / 180 * Math.PI,
			type: p2.Body.DYNAMIC
		});
		this.body.name = this.node.name;
		this.body.displays = [this.node];
		this.shape = new p2.Circle({radius: this.node.width/2/MyPhysicsManager._factor});
		this.body.addShape(this.shape);
		MyPhysicsManager._world.addBody(this.body);
    },

    update (dt) {
		this.node.x = this.body.position[0] * MyPhysicsManager._factor;
		this.node.y = this.body.position[1] * MyPhysicsManager._factor;
		this.node.rotation = -(this.body.angle * 180 / Math.PI);
	},
});
