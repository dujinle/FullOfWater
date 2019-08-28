cc.PhysicsManager.prototype.start = function(){
	if (CC_EDITOR) return;
	if (!this._world) {
		var world = new b2.World( new b2.Vec2(0, -9.5) );
		world.SetAllowSleeping(true);
		this._world = world;

		//liquid 粒子
		var psd = new b2.ParticleSystemDef();
		psd.radius = GlobalData.GameConfig.radius;
		this._particle = world.CreateParticleSystem(psd);
		this._initCallback();
	}
	this._enabled = true;
};
b2.Draw.prototype.DrawParticles = function( positionBuffer, radius, colorBuffer, particleCount){
	var color = new cc.Color(15,167,230);
	for(var i=0; i < particleCount; i++) {
		let vec2 = positionBuffer[i];
		this.DrawSolidCircle(vec2,radius * 1.2,0,color);
    }
};