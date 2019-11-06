var ThirdAPI = require('ThirdAPI');
var WxPortal = require('WxPortal');
var WxBannerAd = require('WxBannerAd');
cc.Class({
    extends: cc.Component,

    properties: {
		scene:null,
		adType:0,
		rankSprite:cc.Node,
		isDraw:false,
    },
    onLoad () {
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
		console.log("rank game board load");
	},
	start(){
		try{
			this.texture = new cc.Texture2D();
			var openDataContext = wx.getOpenDataContext();
			this.sharedCanvas = openDataContext.canvas;
		}catch(error){}
		//this.sharedCanvas.width = 640;
		//this.sharedCanvas.height = 1136;
	},
	onClose(){
		this.isDraw = false;
		this.node.active = false;
		//从结束界面跳转过来的
		if(this.scene == 'finish'){
			if(this.adType == 0){
				WxBannerAd.showBannerAd();
			}else{
				WxPortal.showBannerAd(2);
			}
		}else if(this.scene == 'start'){
			WxPortal.showBannerAd(1);
		}
	},
	show(scene,adType){
		console.log("rank game show");
		this.isDraw = true;
		this.node.active = true;
		this.scene = scene;
		this.adType = adType;
		var param = {
			type:'rankUIFriendRank',
			game:GlobalData.GameInfoConfig.gameType
		};
		ThirdAPI.getRank(param);
	},
	friendRankCb(){
		console.log("finish game show");
		this.isDraw = true;
		 var param = {
			type:'rankUIFriendRank',
			game:GlobalData.GameInfoConfig.gameType
		};
		ThirdAPI.getRank(param);
	},
	groupRankCb(){
		console.log("finish game show");
		this.isDraw = true;
		 var param = {
			type:'rankUIGroupRank',
			game:GlobalData.GameInfoConfig.gameType
		};
		ThirdAPI.getRank(param);
	},
	rankSuccessCb(){
		if(!this.texture){
			return;
		}
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
});
