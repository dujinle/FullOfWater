var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		audioManager:null,
		isDraw:false,
		rankSprite:cc.Node,
    },
    start () {
		try{
			this.texture = new cc.Texture2D();
			var openDataContext = wx.getOpenDataContext();
			this.sharedCanvas = openDataContext.canvas;
		}catch(error){}
    },
	initHide(audioManager){
		this.audioManager = audioManager;
		this.node.active = false;
	},
	onShow(){
		this.node.active = true;
		ThirdAPI.getRank({
			type:'battleGameView',
			game:GlobalData.GameInfoConfig.gameType
		});
		this.isDraw = true;
	},
	rankSuccessCb(){
		if(!this.texture){
			return;
		}
		console.log(this.sharedCanvas);
		this.texture.initWithElement(this.sharedCanvas);
		this.texture.handleLoadedTexture();
		this.rankSprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.texture);
	},
	update(){
		//console.log("update finish game");
		if(this.isDraw == true){
			this.rankSuccessCb();
		}
	}
    // update (dt) {},
});
