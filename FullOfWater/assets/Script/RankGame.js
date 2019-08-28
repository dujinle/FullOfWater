var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		rankSprite:cc.Node,
		isDraw:false,
    },
    onLoad () {
		console.log("finish game board load");
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
			}
        }, this.node);
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
		this.hide();
		this.node.removeFromParent();
		this.node.destroy();
	},
	show(){
		console.log("finish game show");
		this.isDraw = true;
		this.node.active = true;
		var param = {
			type:'rankUIFriendRank'
		};
		ThirdAPI.getRank(param);
	},
	hide(){
		this.isDraw = false;
		this.node.active = false;
	},
	friendRankCb(){
		console.log("finish game show");
		this.isDraw = true;
		 var param = {
			type:'rankUIFriendRank'
		};
		ThirdAPI.getRank(param);
	},
	groupRankCb(){
		console.log("finish game show");
		this.isDraw = true;
		 var param = {
			type:'rankUIGroupRank'
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
