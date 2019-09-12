let MyPhysicsManager = {
	_world:null,
	_factor:100,
	start:function(){
		if(this._world == null){
			this._world = new p2.World({gravity: [0, -5]});
			this._world.sleepMode = p2.World.BODY_SLEEPING;
			this._world.setGlobalStiffness(1e8);

            // Max number of solver iterations to do
            this._world.solver.iterations = 20;

            // Solver error tolerance
            this._world.solver.tolerance = 0.02;

            // Enables sleeping of bodies
            this._world.sleepMode = p2.World.BODY_SLEEPING;
		}
	},
	step:function(dt){
		if(this._world != null){
			this._world.step(1 / 60,dt,5);
		}
	},
};
module.exports = MyPhysicsManager;
/*
cc.PhysicsManager.prototype.start = function(){
	if (CC_EDITOR) return;
	if (!this._world) {
		var world = new b2.World( new b2.Vec2(0, -9.5) );
		world.SetAllowSleeping(true);
		this._world = world;
		//liquid 粒子
		var psd = new b2.ParticleSystemDef();
		psd.radius = GlobalData.GameConfig.radius;
		if(GlobalData.GameInfoConfig.gameType == 1){
			psd.dampingStrength = 1.5;
			psd.viscousStrength = 0;
		}else{
			psd.dampingStrength = 2;
			psd.viscousStrength = 0;
			//psd.elasticStrength = 2;
			//psd.powderStrength = 1;
			//psd.gravityScale = 1.5;
		}
		this._particles = this._world.CreateParticleSystem(psd);
		this._initCallback();
	}
	this._enabled = true;
};
*/