var MetaBall = require('MetaBall');
cc.Class({
    extends: cc.Component,

    properties: {
		graphicsNode:cc.Node,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.graphics = this.graphicsNode.getComponent(cc.Graphics);
		this.node.on(cc.Node.EventType.MOUSE_MOVE,this.mouseMove,this);
	},
	mouseMove(event){
		//console.log(event);
		this.graphics.clear();
		
		this.graphics.circle(0, 0, 100);

		var x = event._x - 320;
		var y = event._y - 568;
		this.graphics.circle(x, y, 50);
		//console.log(cc.v2(x,y));
		var ret = MetaBall.metaball(100,50,cc.v2(0,0),cc.v2(x,y),0.5,2.4);
		if(ret != null){
			this.graphics.clear();
			
			this.graphics.arc(0,0,100,ret.angle1,ret.angle2,true);
			this.graphics.bezierCurveTo(ret.con2.x,ret.con2.y,ret.con4.x,ret.con4.y,ret.pos4.x,ret.pos4.y);
			this.graphics.arc(x,y,50,ret.angle4,ret.angle3,true);
			this.graphics.bezierCurveTo(ret.con3.x,ret.con3.y,ret.con1.x,ret.con1.y,ret.pos1.x,ret.pos1.y);
			//this.graphics.moveTo(ret.pos1.x,ret.pos1.y);
			//this.graphics.bezierCurveTo(ret.con1.x,ret.con1.y,ret.con3.x,ret.con3.y,ret.pos3.x,ret.pos3.y);
			//this.graphics.close();
			//this.graphics.moveTo(ret.pos4.x,ret.pos4.y);
			//this.graphics.bezierCurveTo(ret.con4.x,ret.con4.y,ret.con2.x,ret.con2.y,ret.pos2.x,ret.pos2.y);
			//this.graphics.close();
			//this.graphics.bezierCurveTo(ret.pos1.x,ret.pos1.y,ret.con1.x,ret.con1.y,)
			//this.graphics.moveTo(ret.pos1.x,ret.pos1.y);
			//this.graphics.lineTo(ret.pos3.x,ret.pos3.y);
			//this.graphics.moveTo(ret.pos2.x,ret.pos2.y);
			//this.graphics.lineTo(ret.pos4.x,ret.pos4.y);
			//this.graphics.quadraticCurveTo(ret.pos1.x,ret.pos1.y,ret.pos3.x,ret.pos3.y);
			//this.graphics.quadraticCurveTo(ret.pos2.x,ret.pos2.y,ret.pos4.x,ret.pos4.y);
		}
		this.graphics.close();
		this.graphics.fill();
		this.graphics.stroke();
		console.log(ret);
	},
    start () {

    },

    // update (dt) {},
});
