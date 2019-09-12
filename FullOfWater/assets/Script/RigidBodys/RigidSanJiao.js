var MyPhysicsManager = require('MyPhysicsManager');
cc.Class({
    extends: cc.Component,

    properties: {
		body: {default: null},
		shape: {default: null}
    },
    start () {
		var pos = this.node.getPosition();
		this.size = 180;//this.node.getContentSize();
		this.body = new p2.Body({
			mass: 1,
			position: [pos.x/MyPhysicsManager._factor, pos.y/MyPhysicsManager._factor],
			angle: -this.node.rotation / 180 * Math.PI,
			type: p2.Body.DYNAMIC
		});
		this.body.name = this.node.name;
		this.body.displays = [this.node];
		//构造三个顶点
		var vertices = [];
		for(var i=2, N=3; i>= 0; i--){
			var a = 2*Math.PI / N * i;
			var vertex = [
				this.size*0.5*Math.sin(a)/MyPhysicsManager._factor,
				this.size*0.5*Math.cos(a)/MyPhysicsManager._factor
			]; // Note: vertices are added counter-clockwise
			vertices.push(vertex);
		}
		console.log(vertices)
		var path = [[-27,-60],[27,-60],[45,47],[42,51],[37,47],[21,-44],[-21,-44],[-37,47],[-42,51],[-45,47]];
		for(var i = 0;i < path.length;i++){
			var item = path[i];
			item[0] = item[0] / MyPhysicsManager._factor;
			item[1] = item[1] / MyPhysicsManager._factor;
		}
        //this.shape = new p2.Convex({ vertices: vertices });
		//this.body.addShape(this.shape);
		this.body.fromPolygon(path);
		MyPhysicsManager._world.addBody(this.body);
    },

    update (dt) {
		this.node.x = this.body.position[0] * MyPhysicsManager._factor;
		this.node.y = this.body.position[1] * MyPhysicsManager._factor;
		this.node.rotation = -(this.body.angle * 180 / Math.PI);
	},
});
