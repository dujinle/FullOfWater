let shader = {
    name: 'liquid',

    defines: [
    ],   
    vert: 
`
attribute vec4 a_position;//需传入所有粒子的坐标
attribute vec2 a_texCoord;//纹理贴图的纹理坐标
uniform vec4 u_color;//颜色混合
uniform float u_pointSize;//传入粒子的大小
uniform float u_ratio;//传入的屏幕坐标系与物理坐标系的比例
uniform vec2 u_texSize;
#ifdef GL_ES
varying lowp vec4 v_fragmentColor;
varying lowp vec2 v_texCoord;
#else
varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
#endif

void main()
{
	vec4 pos = vec4(a_position.xy*u_ratio, 1, 1);
    gl_Position = CC_PMatrix * pos;
    gl_PointSize = u_pointSize;
    v_fragmentColor = u_color;
	v_texCoord = a_texCoord;
}
`,
    frag:
`
#ifdef GL_ES
varying lowp vec4 v_fragmentColor;
varying lowp vec2 v_texCoord;
#else
varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
#endif
uniform sampler2D u_texture;
void main()
{
	//将纹理采样颜色与v_fragmentColor混合，然后输出
    gl_FragColor = texture2D(u_texture, v_texCoord)*v_fragmentColor;
}
`,
};

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    cc.renderer._forward._programLib.define(shader.name, shader.vert, shader.frag, shader.defines);
});

module.exports = shader;