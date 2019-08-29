var util = require('util');
cc.Class({
    extends: cc.Component,

    properties: {
		propLayout:cc.Node,
		groundNode:cc.Node,
		finishGame:cc.Node,
		finishButton:cc.Node,
		checkButton:cc.Node,
		checkFlag:false,
    },

    onLoad () {
		this.gameNodes = {};
		this.finishGame.active = false;
		this.checkFlag = false;
		this.pymanager = cc.director.getPhysicsManager();
		this.pymanager.start();
	},
	initGame(){
		for(var key in GlobalData.assets){
			if(key == 'FinishGameScene' || key == 'PauseGameScene'){
				continue;
			}
			if(key == 'cupLine'){
				continue;
			}
			var node = cc.instantiate(GlobalData.assets[key]);
			if(key == 'RigidCup'){
				node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
			}
			if(key == 'RigidcupLine'){
				node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
			}
			this.propLayout.addChild(node);
			this.addTouchEvent(node);
		}
	},
	addTouchEvent(node){
		if(node != null){
			node.on(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
			node.on(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
			node.on(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
			node.on(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
		}
	},
	offTouchEvent(node){
		if(node != null){
			node.off(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
			node.off(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
			node.off(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
			node.off(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
		}
	},
	eventTouchStart(event){
		console.log('eventTouchStart');
		this.initPosition = this.node.convertToNodeSpaceAR(event.getLocation());
		let node = event.getCurrentTarget();
		if(this.gameNodes[node.name] == null){
			this.touchNode = cc.instantiate(node);
			this.groundNode.addChild(this.touchNode);
			this.touchNode.setPosition(this.initPosition);
			this.addTouchEvent(this.touchNode);
			this.gameNodes[node.name] = this.touchNode;
		}else{
			this.touchNode = node;
		}
	},
	eventTouchMove(event){
		let delta = event.touch.getDelta();
		//let node = event.getCurrentTarget();
		this.touchNode.x += delta.x;
		this.touchNode.y += delta.y;
	},
	eventTouchEnd(event){
		this.touchNode = null;
	},
	eventTouchCancel(event){
		this.touchNode = null;
	},
	publish(event){
		if(this.checkFlag == false){
			this.check(event);
		}
		var img = this.capture();
		this.finishGame.active = true;
		this.propLayout.active = false;
		this.finishButton.active = false;
		this.checkButton.active = false;
		var finishSprite = this.finishGame.getChildByName('finishGameInfo');
		var flext = finishSprite.getComponent(cc.Sprite);
		let texture = new cc.Texture2D();
        texture.initWithElement(img);
		
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        flext.spriteFrame = spriteFrame;
	},
	finalPublish(event){
		var gameInfo = {tryTimes:10};
		for(var key in this.gameNodes){
			var node = this.gameNodes[key];
			gameInfo[key] = [node.x,node.y];
		}
		console.log(JSON.stringify(gameInfo,null,'\t'));
		this.finishGame.active = false;
		this.finishButton.active = true;
		this.checkButton.active = true;
		this.propLayout.active = true;
	},
	capture(){
		var size = this.groundNode.getContentSize();
		let texture = new cc.RenderTexture();
        let gl = cc.game['_renderContext'];
        texture.initWithSize(size.width, size.height,gl.STENCIL_INDEX8);

        let width = size.width;
        let height = size.height;

        let camera =  this.node.addComponent(cc.Camera);
        camera.depth = 0
        camera.targetTexture = texture;
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        camera.render(this.node);
        let data = texture.readPixels();
        
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow*width*4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start+i];
            }
            ctx.putImageData(imageData, 0, row);
        }

        var dataURL = canvas.toDataURL("image/jpeg");
        var img = document.createElement("img");
        img.src = dataURL;
        this.node.removeComponent(camera)
        return img;
	},
	check(event){
		this.checkFlag = true;
		try{
			var RigidShuiLongTou = this.gameNodes['RigidShuiLongTou'];
			if(RigidShuiLongTou == null){
				return;
			}
			var sltPos = RigidShuiLongTou.getPosition();
			var cupLine = this.gameNodes['RigidcupLine'];
			cupLine.x = sltPos.x;
			var size = cupLine.getContentSize();
			var pos = cupLine.getPosition();
			for(var key in this.gameNodes){
				var node = this.gameNodes[key];
				if(key == 'RigidShuiLongTou'){
					continue;
				}
				if(key == 'RigidcupLine'){
					node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
					continue;
				}
				if(key == 'RigidCup'){
					node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
					continue;
				}
				var lpos = node.getPosition();
				var lsize = node.getContentSize();
				var lowY = lpos.y - lsize.height/2;
				var upY = pos.y + size.height/2;
				if(lowY >= upY){
					var coverage = util.getCoverAge(node,cupLine);
					if(coverage > 0.8){
						console.log('zhe dang  weizhi');
						return false;
					}
				}
			}
		}catch(err){
			console.log(err);
		}
	}
});
