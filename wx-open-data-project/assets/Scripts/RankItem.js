cc.Class({
    extends: cc.Component,

    properties: {
		itemID:0,
		rankLabel:cc.Node,
		nameLabel:cc.Node,
		avatarSprite:cc.Node,
		scoreLabel:cc.Node,
    },
	setItem(id,data){
		this.itemID = id;
		this.loadRank(data);
	},
    loadRank(data){
		console.log("loadRank start......");
		this.rankLabel.getComponent(cc.Label).string = data.rank;
		this.nameLabel.getComponent(cc.Label).string = data.nickname;
		this.scoreLabel.getComponent(cc.Label).string = 0;
		for(var i = 0;i < data.KVDataList.length;i++){
			var kvdata = data.KVDataList[i];
			if(kvdata.key == "maxScore"){
				this.scoreLabel.getComponent(cc.Label).string = kvdata.value;
			}
		}
		this.loadImage(this.avatarSprite,data.avatarUrl);
	},
	loadImage(node,url){
		cc.loader.load({url:url, type: 'png'}, function (err, tex) {
			node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
		});
	}
});
