cc.Class({
    extends: cc.Component,

    properties: {
		rankNodes:{
			type:cc.Node,
			default:[]
		}
    },
	loadRank(data){
		//console.log(data);
		for(var i = 0;i < data.length;i++){
			var dd = data[i];
			var itemNode = this.rankNodes[i];
			itemNode.getChildByName("rankLabel").getComponent(cc.Label).string = dd.rank;
			itemNode.getChildByName("nameLabel").getComponent(cc.Label).string = dd.nickname;
			itemNode.getChildByName("scoreLabel").getComponent(cc.Label).string = 0;
			for(var j = 0;j < dd.KVDataList.length;j++){
				var kvdata = dd.KVDataList[j];
				if(kvdata.key == "maxScore"){
					itemNode.getChildByName("scoreLabel").getComponent(cc.Label).string = kvdata.value;
				}
			}
			if(dd.my == true){
				itemNode.getChildByName("scoreLabel").color = new cc.color("#ba5a55");
				itemNode.getChildByName("rankLabel").color = new cc.color("#ba5a55");
				itemNode.getChildByName("nameLabel").color = new cc.color("#ba5a55");
			}
			this.loadImage(itemNode,dd.avatarUrl);
		}
	},
	loadImage(node,url){
		cc.loader.load({url:url, type: 'png'}, function (err, tex) {
			//console.log("loadImage",url,node);
			node.getChildByName("avatarSprite").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
		});
	}
});
