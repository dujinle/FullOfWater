
cc.Class({
    extends: cc.Component,

    properties: {
		guanka:1,
		type:1,
		gk:cc.Node,
    },
	initGame(type){
		this.type = type;
		this.gk.getComponent(cc.Label).string = this.guanka;
		if(this.type == 1){
			this.gameProp = [];
			this.gameInfo = GlobalData.GameCheckInfo[this.guanka];
			for(var i = 0;i < this.gameInfo.length;i++){
				var item = this.gameInfo[i];
				if(GlobalData.assets[item.name] != null){
					var pos = item.pos;
					var node = cc.instantiate(GlobalData.assets[item.name]);
					if(item.name == 'RigidCup'){
						this.rigidCup = node;
					}else if(item.name == 'RigidShuiLongTou'){
						this.shuiLongTou = node;
					}else if(item.name == 'cupLine'){
						this.cupLine = node;
					}else{
						this.gameProp.push({name:node.name,node:node});
					}
					this.node.addChild(node);
					node.setPosition(cc.v2(pos[0],pos[1]));
					if(item.scale != null){
						node.scale = item.scale;
					}
					if(item.scaleY != null){
						node.scaleY = item.scaleY;
					}
					if(item.rotation != null){
						node.rotation = item.rotation;
					}
				}
			}
		}
		else{
			this.gameProp = [];
			this.gameInfo = GlobalData.GameBuDaoInfo[this.guanka];
			for(var i = 0;i < this.gameInfo.length;i++){
				var item = this.gameInfo[i];
				if(GlobalData.assets[item.name] != null){
					var pos = item.pos;
					var node = cc.instantiate(GlobalData.assets[item.name]);
					if(item.name == 'RigidCup'){
						this.rigidCup = node;
					}else{
						this.gameProp.push({name:node.name,node:node});
					}
					node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
					this.node.addChild(node);
					node.setPosition(cc.v2(pos[0],pos[1]));
					if(item.scale != null){
						node.scale = item.scale;
					}
					if(item.scaleY != null){
						node.scaleY = item.scaleY;
					}
					if(item.rotation != null){
						node.rotation = item.rotation;
					}
				}
			}
		}
	},
	onRight(){
		this.guanka += 1;
		this.destroyGame();
		this.initGame(this.type);
	},
	onLeft(){
		this.guanka -= 1;
		this.destroyGame();
		this.initGame(this.type);
	},
	destroyGame(){
		console.log('destroyGame',this.guanka);
		this.rigidCup.removeFromParent();
		this.rigidCup.destroy();
		if(this.type == 2){
			for(var i = 0;i < this.gameProp.length;i++){
				var node = this.gameProp[i];
				if(node.name != null){
					node.node.removeFromParent();
					node.node.destroy();
				}
			}
		}else{
			this.shuiLongTou.removeFromParent();
			this.shuiLongTou.destroy();
			this.cupLine.removeFromParent();
			this.cupLine.destroy();
			for(var i = 0;i < this.gameProp.length;i++){
				var node = this.gameProp[i];
				if(node.name != null){
					node.node.removeFromParent();
					node.node.destroy();
				}
			}
		}
	}
});
