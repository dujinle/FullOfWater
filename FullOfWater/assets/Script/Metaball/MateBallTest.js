var MetaBall = require('MetaBall');
var MyPhysicsManager = require('MyPhysicsManager');
cc.Class({
    extends: cc.Component,

    properties: {
		graphicsNode:cc.Node,
		ground:cc.Node,
		sLT:cc.Node,
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
		//this.node.on(cc.Node.EventType.MOUSE_MOVE,this.mouseMove,this);
		MyPhysicsManager.start();
		this.addPlane();
		//this.mouseMove();
	},
	addPlane(){
		var size = this.ground.getContentSize();
		var np = this.ground.getPosition();
		var pos = cc.v2(np.x,np.y - size.height/2);
		//console.log(np,tp,size);
		//var pos = this.node.convertToWorldSpaceAR(tp);
		this.body = new p2.Body({
			position: [pos.x/MyPhysicsManager._factor,pos.y/MyPhysicsManager._factor],
			angle: -this.node.rotation / 180 * Math.PI,
			type: p2.Body.STATIC
		});
		//console.log(np,tp,pos,this.body.position)
		this.body.name = "plane";
		this.body.displays = [this.node];
		this.shape = new p2.Box({width: size.width/MyPhysicsManager._factor , height:50/MyPhysicsManager._factor});
		this.body.addShape(this.shape);
		
		pos = cc.v2(np.x - size.width/2,np.y);
		this.body2 = new p2.Body({
			position: [pos.x/MyPhysicsManager._factor,pos.y/MyPhysicsManager._factor],
			angle: -this.node.rotation / 90 * Math.PI,
			type: p2.Body.STATIC
		});
		//console.log(np,tp,pos,this.body.position)
		this.body2.name = "plane2";
		this.body2.displays = [this.node];
		this.shape2 = new p2.Box({width: 50/MyPhysicsManager._factor , height:size.height/MyPhysicsManager._factor});
		this.body2.addShape(this.shape2);
		
		pos = cc.v2(np.x + size.width/2,np.y);
		this.body3 = new p2.Body({
			position: [pos.x/MyPhysicsManager._factor,pos.y/MyPhysicsManager._factor],
			angle: -this.node.rotation / 90 * Math.PI,
			type: p2.Body.STATIC
		});
		//console.log(np,tp,pos,this.body.position)
		this.body3.name = "plane2";
		this.body3.displays = [this.node];
		this.shape3 = new p2.Box({width: 50/MyPhysicsManager._factor , height:size.height/MyPhysicsManager._factor});
		this.body3.addShape(this.shape3);
		
		MyPhysicsManager._world.addBody(this.body);
		MyPhysicsManager._world.addBody(this.body2);
		MyPhysicsManager._world.addBody(this.body3);
		
	},
	mouseMove(event){
		var enablePositionNoise = true, // Add some noise in circle positions
            N = 15,         // Number of circles in x direction
            M = 15,         // and in y
            r = 0.07,       // circle radius
            d = 2.2;        // Distance between circle centers

        // Create demo application
        var app = new p2.WebGLRenderer(function(){

            // Create the world
            var world = new p2.World({
                gravity : [0,-5]
            });

            // Pre-fill object pools. Completely optional but good for performance!
            world.overlapKeeper.recordPool.resize(16);
            world.narrowphase.contactEquationPool.resize(1024);
            world.narrowphase.frictionEquationPool.resize(1024);

            this.setWorld(world);

            // Set stiffness of all contacts and constraints
            world.setGlobalStiffness(1e8);

            // Max number of solver iterations to do
            world.solver.iterations = 20;

            // Solver error tolerance
            world.solver.tolerance = 0.02;

            // Enables sleeping of bodies
            world.sleepMode = p2.World.BODY_SLEEPING;

            // Create circle bodies
            for(var i=0; i<N; i++){
                for(var j=M-1; j>=0; j--){
                    var x = (i-N/2)*r*d+(enablePositionNoise ? Math.random()*r : 0);
                    var y = (j-M/2)*r*d;
                    var p = new p2.Body({
                        mass: 1,
                        position: [x, y],
                    });
                    p.addShape(new p2.Circle({ radius: r }));
                    p.allowSleep = true;
                    p.sleepSpeedLimit = 1;  // Body will feel sleepy if speed<1 (speed is the norm of velocity)
                    p.sleepTimeLimit = 1;   // Body falls asleep after 1s of sleepiness
                    world.addBody(p);
                }
            }

            // Compute max/min positions of circles
            var xmin = (-N/2 * r*d),
                xmax = ( N/2 * r*d),
                ymin = (-M/2 * r*d),
                ymax = ( M/2 * r*d);

            // Create bottom plane
            var plane = new p2.Body({
                position : [0,ymin],
            });
            plane.addShape(new p2.Plane());
            world.addBody(plane);

            // Left plane
            var planeLeft = new p2.Body({
                angle: -Math.PI/2,
                position: [xmin, 0]
            });
            planeLeft.addShape(new p2.Plane());
            world.addBody(planeLeft);

            // Right plane
            var planeRight = new p2.Body({
                angle: Math.PI/2,
                position: [xmax, 0]
            });
            planeRight.addShape(new p2.Plane());
            world.addBody(planeRight);

            // Start demo
            this.frame(0, 0, 4, 4);
        });
	},
    start () {
		var sSize = this.sLT.getContentSize();
		var sPos = this.sLT.getPosition();
		this.ridus = sSize.width/4/2/MyPhysicsManager._factor;
		this.contains = [];
		for(var i = 0;i < 50;i++){
			var body = new p2.Body({
				mass:1,
				position: [sPos.x/MyPhysicsManager._factor,sPos.y/MyPhysicsManager._factor]
			});
			console.log(sPos.x/MyPhysicsManager._factor,sPos.y/MyPhysicsManager._factor);
			body.allowSleep = true;
            body.sleepSpeedLimit = 1;  // Body will feel sleepy if speed<1 (speed is the norm of velocity)
            body.sleepTimeLimit = 1;   // Body falls asleep after 1s of sleepiness
			body.addShape(new p2.Particle());
			this.contains.push(body);
			MyPhysicsManager._world.addBody(body);
		}
    },

    update (dt) {
		this.graphics.clear();
		MyPhysicsManager.step(dt);
		//this.graphics.circle(0 ,100,this.ridus * MyPhysicsManager._factor);
		//this.graphics.fill();
		//this.graphics.stroke();
		for(var i = 0;i < 50;i++){
			var body = this.contains[i];
			var pos = body.position;
			console.log(pos[0] *MyPhysicsManager._factor,pos[1] *MyPhysicsManager._factor,this.ridus * MyPhysicsManager._factor);
		
			this.graphics.circle(pos[0] *MyPhysicsManager._factor,pos[1] *MyPhysicsManager._factor,this.ridus * MyPhysicsManager._factor * 2);
			this.graphics.fill();
			this.graphics.stroke();
		}
	},
});
