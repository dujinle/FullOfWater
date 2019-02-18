const math = cc.vmath;
const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
const gfx = renderEngine.gfx;
const Material = renderEngine.Material;

// Require to load the shader to program lib
require('../liquidVF');

function liquidMaterial () {
    Material.call(this, false);

    var pass = new renderer.Pass('liquid');
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    let mainTech = new renderer.Technique(
        ['transparent'],
        [
			{ name: 'u_texture', type: renderer.PARAM_TEXTURE_2D},
			{ name: 'a_position', type: renderer.PARAM_FLOAT4 },
            { name: 'a_texCoord', type: renderer.PARAM_FLOAT2 },
            { name: 'u_color', type: renderer.PARAM_COLOR4 },
			{ name: 'u_pointSize', type: renderer.PARAM_FLOAT },
			{ name: 'u_ratio', type: renderer.PARAM_FLOAT },
        ],
        [
            pass
        ]
    );
	this.a_position = 0;
	this.a_texCoord = 0;
	this.u_color = new b2.Color(0,0,0,0);
	this.u_pointSize = 0;
	this.u_ratio = 0;
	this.u_texture = null;
	

    // need _effect to calculate hash
    this._effect = this.effect = new renderer.Effect(
        [
            mainTech,
        ],
        {
			'u_texture': this.u_texture,
            'a_position': this.a_position,
            'a_texCoord': this.a_texCoord,
			'u_color': this.u_color,
			'u_ratio': this.u_ratio,
			'u_pointSize': this.u_pointSize
        }
    );
    
    this._mainTech = mainTech;
}
cc.js.extend(liquidMaterial, Material);
cc.js.mixin(liquidMaterial.prototype, {
	setU_texture(u_texture){
		this.u_texture = u_texture;
		this.u_texture.update({ flipY: false, mipmap: false });
        this.effect.setProperty('u_texture', this.u_texture.getImpl());
	},
	setA_position(a_position){
		this.a_position = a_position;
        this.effect.setProperty('a_position', this.a_position);
	},
	setA_texCoord(a_texCoord){
		this.a_texCoord = a_texCoord;
        this.effect.setProperty('a_texCoord', this.a_texCoord);
	},
	setU_ratio(u_ratio){
		this.u_ratio = u_ratio;
        this.effect.setProperty('u_ratio', this.u_ratio);
	},
	setU_color(u_color){
		this.u_color.r = u_color.r;
		this.u_color.g = u_color.g;
		this.u_color.b = u_color.b;
		this.u_color.a = u_color.a;
        this.effect.setProperty('u_color', this.u_color);
	},
	setU_pointSize(u_pointSize){
		this.u_pointSize = u_pointSize;
        this.effect.setProperty('u_pointSize', this.u_pointSize);
	},
	getA_position(){
		return this.a_position;
	},
	getA_texCoord(){
		return this.a_texCoord;
	},
	getU_color(){
		return this.u_color;
	}
});

module.exports = liquidMaterial;