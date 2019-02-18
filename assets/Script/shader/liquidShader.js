const liquidMaterial = require('../liquidMaterial');

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		cc.dynamicAtlasManager.enabled = false;
    },
	initLiquid(particleSystem,ratio){
		this.particleSystem = particleSystem;
		this.ratio = ratio;
		let texture = this.target.spriteFrame.getTexture();
		let texSize = this.node.getContentSize();
		window.g_material = new liquidMaterial();
		
		g_material.setU_texture(texture);
		g_material.setU_ratio(ratio);
		g_material.setU_color(new b2.Color(1, 1, 1, 0.7));
		g_material.setU_pointSize(this.particleSystem.GetRadius() * ratio * 2);

		let vertsCount = this.particleSystem.GetParticleCount();
		let posVerts = this.particleSystem.GetPositionBuffer();
		let texCoords = new Array();
		for (var i = 0; i < vertsCount; i++){
			let vec = posVerts[i];
			texCoords.push(new b2.Vec2((vec.x * ratio) / texSize.width,
				1 - (vec.y * ratio) / texSize.height));
		}
		
		g_material.setA_position(posVerts[0]);
		g_material.setA_texCoord(texCoords[0]);
	},
    start () {
		/*
        if (this.target) {
            let texture = this.target.spriteFrame.getTexture();
            this._material.setTexture(texture);
            this.target._material = this._material;
            this.target._renderData._material = this._material;
        }
		*/
    },

    update (dt) {
		/*
        this._material.setMotion((this._motion += 0.05));
		if(1.0e20 < this._motion ){ this._motion = 0; }
		*/
    },
});
