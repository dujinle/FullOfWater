cc.Class({
    extends: cc.Component,

    properties: {
		aboveLabel:cc.Node,
		avaterSprite:cc.Node,
		nameLabel:cc.Node,
		scoreLabel:cc.Node,
    },
	loadRank(data,myData,score){
		console.log(data,myData,score);
		var upObject = null;
		for(var i = 0;i < data.length;i++){
			var dd = data[i];
			var maxScore = this.getMaxScore(dd);
			//如果最大分数小于分数 则找到 break
			if(dd.my == true){
				continue;
			}
			if(maxScore < score){
				break;
			}
			upObject = dd;
		}
		if(upObject == null){
			this.aboveLabel.getComponent(cc.Label).string = '无人可挡';
			this.loadImage(this.avaterSprite,myData.avatarUrl);
			this.nameLabel.getComponent(cc.Label).string = myData.nickname;
			this.scoreLabel.getComponent(cc.Label).string = score;
		}else{
			this.aboveLabel.getComponent(cc.Label).string = '即将超越';
			this.loadImage(this.avaterSprite,upObject.avatarUrl);
			this.nameLabel.getComponent(cc.Label).string = upObject.nickname;
			this.scoreLabel.getComponent(cc.Label).string = this.getMaxScore(upObject);;
		}
	},
	loadImage(node,url){
		cc.loader.load({url:url, type: 'png'}, function (err, tex) {
			//console.log("loadImage",url,node);
			node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
		});
	},
	getMaxScore(dd){
		for(var j = 0;j < dd.KVDataList.length;j++){
			var kvdata = dd.KVDataList[j];
			if(kvdata.key == "maxScore"){
				return parseInt(kvdata.value);
			}
		}
		return 0;
	}
});
