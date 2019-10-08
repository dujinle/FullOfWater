var util = require('util');
var WxBannerAd = require('WxBannerAd');
var ThirdAPI = require('ThirdAPI');
cc.Class({
	extends: cc.Component,

	properties: {
		pauseButton:cc.Node,
		checkPoint:cc.Node,
		groundNode:cc.Node,
		tryTimesLabel:cc.Node,
		graphicsNode:cc.Node,
		guideHandle:cc.Node,
		gameTime:cc.Node,
		lastTime:0,
	},
	onLoad(){
		console.log('main game onload');
		this.pymanager = cc.director.getPhysicsManager();
		this.graphics = this.graphicsNode.getComponent(cc.Graphics);
		this.gameProp = {};
		this.pymanager.start();
		this.graphics.clear();
		// 开启物理步长的设置
		this.pymanager.enabledAccumulator = true;

		// 物理步长，默认 FIXED_TIME_STEP 是 1/60
		this.pymanager.FIXED_TIME_STEP = 1/30;

		// 每次更新物理系统处理速度的迭代次数，默认为 10
		this.pymanager.VELOCITY_ITERATIONS = 8;

		// 每次更新物理系统处理位置的迭代次数，默认为 10
		this.pymanager.POSITION_ITERATIONS = 8;
		/*
		this.pymanager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
			cc.PhysicsManager.DrawBits.e_pairBit |
			cc.PhysicsManager.DrawBits.e_centerOfMassBit |
			cc.PhysicsManager.DrawBits.e_jointBit |
			cc.PhysicsManager.DrawBits.e_shapeBit
			;
		*/
	},
	//所有面板的button按钮 返回函数
	panelButtonCb(event,customEventData){
		//继续游戏
		console.log('panelButtonCb',customEventData);
		GlobalData.game.audioManager.getComponent("AudioManager").play(GlobalData.AudioManager.ButtonClick);
		if(customEventData == "P_show"){
			GlobalData.GameInfoConfig.gameStatus = 2;
			GlobalData.game.audioManager.getComponent("AudioManager").pauseGameBg();
			GlobalData.game.pauseGame.getComponent('PauseGame').showPause();
		}
	},
	//第一次进入游戏初始化数据
	initGame(){
		this.node.active = true;
		this.gameProp = [];
		let gra = this.node.getComponent(cc.Graphics);
		gra.clear();
		GlobalData.GameInfoConfig.gameTime = GlobalData.GameConfig.LeftTime;
		this.gameTime.getComponent(cc.Label).string = Math.floor(GlobalData.GameInfoConfig.gameTime / 60) + ":" + GlobalData.GameInfoConfig.gameTime % 60;
		GlobalData.game.audioManager.getComponent('AudioManager').playGameBg();
		this.checkPoint.getComponent(cc.Label).string = "第" + GlobalData.GameInfoConfig.GameCheckPoint + '关';
		this.gameInfo = GlobalData.GameCheckInfo[GlobalData.GameInfoConfig.GameCheckPoint];
		this.tryTimesLabel.getComponent(cc.Label).string = GlobalData.GameInfoConfig.tryTimesCurrent + '/' + GlobalData.GameConfig.tryTimes;
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
				this.groundNode.addChild(node);
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
		this.addTouchEvent();
		this.initGuidGame();
		GlobalData.GameInfoConfig.gameStatus = 1;
		GlobalData.GameInfoConfig.gameType = 1;
		WxBannerAd.createBannerAd();
	},
	initGuidGame(){
		var self = this;
		if(GlobalData.GameInfoConfig.guidFlag == 0){
			var pos = this.rigidCup.getPosition();
			this.guideHandle.active = true;
			this.guideHandle.setPosition(pos);
			var callFunc = cc.callFunc(function(){
				self.guideHandle.setPosition(pos);
			});
			var moveEnd = cc.moveTo(GlobalData.GameConfig.GuideMoveTime,cc.v2(pos.x - 50,pos.y + 150));
			var repeat = cc.repeatForever(cc.sequence(moveEnd,callFunc));
			this.guideHandle.runAction(repeat);
		}else{
			this.guideHandle.active = false;
		}
	},
	initParticle(){
		let PTM_RATIO = cc.PhysicsManager.PTM_RATIO;
		var shuiLongTouSize = this.shuiLongTou.getContentSize();
		var shuiLongTouPos = this.shuiLongTou.getPosition();
		var size = this.node.getContentSize();
		this.particleSystem = this.pymanager._particles;
		var box = new b2.PolygonShape();
		box.SetAsBox(shuiLongTouSize.width/2/PTM_RATIO, (shuiLongTouSize.height * 1.5)/PTM_RATIO, new b2.Vec2(0, 0), 0);

		var particleGroupDef = new b2.ParticleGroupDef();
		particleGroupDef.shape = box;
		particleGroupDef.flags = b2.waterParticle;
		particleGroupDef.position.Set((shuiLongTouPos.x + size.width/2)/PTM_RATIO,(shuiLongTouPos.y + size.height/2 + shuiLongTouSize.height* 2.2)/PTM_RATIO);
		this.particleGroup = this.particleSystem.CreateParticleGroup(particleGroupDef);
	},
	addTouchEvent(){
		if(this.rigidCup != null){
			this.rigidCup.on(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
			this.rigidCup.on(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
			this.rigidCup.on(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
			this.rigidCup.on(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
		}
	},
	offTouchEvent(){
		if(this.rigidCup != null){
			this.rigidCup.off(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
			this.rigidCup.off(cc.Node.EventType.TOUCH_MOVE, this.eventTouchMove,this);
			this.rigidCup.off(cc.Node.EventType.TOUCH_END, this.eventTouchEnd,this);
			this.rigidCup.off(cc.Node.EventType.TOUCH_CANCEL, this.eventTouchCancel,this);
		}
	},
	eventTouchStart(event){
		console.log('eventTouchStart');
		if(GlobalData.GameInfoConfig.guidFlag == 0){
			GlobalData.GameInfoConfig.guidFlag = 1;
			this.guideHandle.stopAllActions();
			this.guideHandle.active = false;
		}
		this.unschedule(this.cupAction);
		this.initLocation = this.rigidCup.getPosition();
		this.touchLocation = this.node.convertToNodeSpaceAR(event.getLocation());
		this.origin = this.touchLocation.clone();//射线原点坐标
		this.graphics.clear();
		this.graphics.moveTo(this.origin.x,this.origin.y);
		console.log('eventTouchStart',this.initLocation,this.touchLocation);
		//for test
		//this.shuiLongTou.getComponent('ShuiLongTou').onOpen();
	},
	eventTouchMove(event){
		this.graphics.clear();
		this.graphics.moveTo(this.origin.x,this.origin.y);
		this.touchLocation.x += event.touch.getDelta().x;
		this.touchLocation.y += event.touch.getDelta().y;
		let touchPos = this.touchLocation;
		if (touchPos.y < this.origin.y) {
			return;
		}
		this.graphics.lineTo(touchPos.x,touchPos.y);
		this.graphics.stroke();
	},
	eventTouchEnd(event){
		console.log('eventTouchEnd',this.touchLocation,this.origin);
		this.graphics.clear();
		var increat = this.touchLocation.sub(this.origin);
		var point = this.node.convertToWorldSpaceAR(this.origin);
		this.rigidCup.getComponent('RigidCupManager').applyForce(increat,point);
		GlobalData.GameInfoConfig.tryTimesCurrent += 1;
		this.tryTimesLabel.getComponent(cc.Label).string = GlobalData.GameInfoConfig.tryTimesCurrent + '/' + GlobalData.GameConfig.tryTimes;
		this.schedule(this.cupAction,0.3);
	},
	cupAction(){
		this.offTouchEvent();
		var rigidBody = this.rigidCup.getComponent(cc.RigidBody);
		if(rigidBody.angularVelocity == 0 && rigidBody.linearVelocity.x == 0 && rigidBody.linearVelocity.y == 0){
			//console.log(rigidBody.linearVelocity,rigidBody.angularVelocity);
			this.addTouchEvent();
			var res = this.checkOnce();
			if(res == true){
				rigidBody.type = cc.RigidBodyType.Static;
				this.offTouchEvent();
				this.rigidCup.x = this.cupLine.x;
				this.fallWater();
				this.unschedule(this.cupAction);
			}else if(GlobalData.GameInfoConfig.tryTimesCurrent >= GlobalData.GameConfig.tryTimes){
				rigidBody.type = cc.RigidBodyType.Static;
				this.rigidCup.getComponent('RigidCupManager').setStatus('fail');
				this.offTouchEvent();
				this.unschedule(this.cupAction);
			}
		}
	},
	eventTouchCancel(event){
		this.graphics.clear();
		var increat = this.touchLocation.sub(this.origin);
		var point = this.node.convertToWorldSpaceAR(this.origin);
		this.rigidCup.getComponent('RigidCupManager').applyForce(increat,point);
		GlobalData.GameInfoConfig.tryTimesCurrent += 1;
		this.tryTimesLabel.getComponent(cc.Label).string = GlobalData.GameInfoConfig.tryTimesCurrent + '/' + GlobalData.GameConfig.tryTimes;
		this.schedule(this.cupAction,0.3);
	},
	//检查是否符合结果
	checkOnce(){
		if(this.rigidCup == null){
			return false;
		}
		var angleRotate = this.rigidCup.rotation % 360;
		if(angleRotate > 10 && angleRotate <= 350){
			return false;
		}
		if(angleRotate < -10 && angleRotate > -350){
			return false;
		}
		var coverage = util.getCoverAge(this.rigidCup,this.shuiLongTou);
		if(coverage < 0.8){
			return false;
		}
		var size = this.rigidCup.getContentSize();
		var pos = this.rigidCup.getPosition();
		for(var i = 0;i < this.gameProp.length;i++){
			var inode = this.gameProp[i];
			var node = inode.node;
			var lpos = node.getPosition();
			var lsize = node.getContentSize();
			var lowY = lpos.y - lsize.height/2;
			var upY = pos.y + size.height/2;
			if(lowY >= upY){
				var coverage = util.getCoverAge(node,this.rigidCup);
				if(coverage > 0.8){
					return false;
				}
			}
		}
		return true;
	},
	fallWater(){
		console.log('fallWater start......');
		var self = this;
		this.initParticle();
		this.rigidCup.getComponent('RigidCupManager').setCupImage('jingya');
		GlobalData.game.audioManager.getComponent('AudioManager').keepPlay(GlobalData.AudioManager.WaterFall,true);
		this.node.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
			GlobalData.game.audioManager.getComponent('AudioManager').keepPlay(GlobalData.AudioManager.WaterFall,false);
			self.rigidCup.getComponent('RigidCupManager').setStatus('smile');
		},this)));
	},
	destroyGame(){
		this.unschedule(this.cupAction);
		this.rigidCup.removeFromParent();
		this.rigidCup.destroy();
		this.shuiLongTou.removeFromParent();
		this.shuiLongTou.destroy();
		this.cupLine.removeFromParent();
		this.cupLine.destroy();
		for(var i = 0;i < this.gameProp.length;i++){
			var node = this.gameProp[i];
			if(node.name != null){
				console.log(node.name,node.node.isValid);
				node.node.removeFromParent();
				node.node.destroy();
			}
		}
		this.lastTime = 0;
		GlobalData.GameInfoConfig.gameTime = 0;
		this.gameProp = [];
		GlobalData.GameInfoConfig.tryTimesCurrent = 0;
		if(this.particleSystem != null){
			this.particleGroup.DestroyParticles(null);
			this.particleSystem.DestroyParticleGroup(this.particleGroup);
			this.particleSystem = null;
		}
		let gra = this.node.getComponent(cc.Graphics);
		gra.clear();
		ThirdAPI.updataGameInfo();
		WxBannerAd.destroyBannerAd();
	},
	update (dt) {
		if(GlobalData.GameInfoConfig.gameStatus != 1){
			return;
		}
		if(GlobalData.GameInfoConfig.gameTime < 0){
			return;
		}
		this.lastTime += dt;
		if(this.lastTime >= 1){
			this.lastTime = 0;
			GlobalData.GameInfoConfig.gameTime -= 1;
			if(GlobalData.GameInfoConfig.gameTime <= 0){
				this.rigidCup.getComponent('RigidCupManager').setStatus('fail');
				this.offTouchEvent();
				this.unschedule(this.cupAction);
			}
			this.gameTime.getComponent(cc.Label).string = Math.floor(GlobalData.GameInfoConfig.gameTime / 60) + ":" + GlobalData.GameInfoConfig.gameTime % 60;
		}
		if(this.particleSystem == null){
			return;
		}

		let size = this.node.getContentSize();
		let PTM_RATIO = cc.PhysicsManager.PTM_RATIO;
		let SLTPos = this.shuiLongTou.getPosition();
		let SLTSize = this.shuiLongTou.getContentSize();
		let vertsCount = this.particleSystem.GetParticleCount();
		let posVerts = this.particleSystem.GetPositionBuffer();
		let gra = this.node.getComponent(cc.Graphics);
		gra.clear();
		let totalCount = 0;
		//var box = this.rigidCup.getBoundingBox();
		for (let i = 0; i < vertsCount - 1; i++) {
			let bassPos1 = cc.v2(posVerts[i].x,posVerts[i].y);
			let bassPos2 = cc.v2(posVerts[i + 1].x,posVerts[i + 1].y);
			bassPos1.x = (bassPos1.x * PTM_RATIO) - size.width/2;
			bassPos1.y = (bassPos1.y * PTM_RATIO) - size.height/2;
			bassPos2.x = (bassPos2.x * PTM_RATIO) - size.width/2;
			bassPos2.y = (bassPos2.y * PTM_RATIO) - size.height/2;
			if(bassPos1.y >= (SLTPos.y - SLTSize.height/2 - 10)){
				continue;
			}
			var ret = null;
			//var ret = MetaBall.metaball(GlobalData.GameConfig.radius * PTM_RATIO,GlobalData.GameConfig.radius * PTM_RATIO,bassPos1,bassPos2,0.5,2.4);
			if(ret != null){
				console.log(ret);
				this.graphics.arc(bassPos1.x,bassPos1.y,GlobalData.GameConfig.radius * PTM_RATIO,ret.angle1,ret.angle2,true);
				this.graphics.bezierCurveTo(ret.con2.x,ret.con2.y,ret.con4.x,ret.con4.y,ret.pos4.x,ret.pos4.y);
				this.graphics.arc(bassPos2.x,bassPos2.y,GlobalData.GameConfig.radius * PTM_RATIO,ret.angle4,ret.angle3,true);
				this.graphics.bezierCurveTo(ret.con3.x,ret.con3.y,ret.con1.x,ret.con1.y,ret.pos1.x,ret.pos1.y);
			}else{
				gra.circle(bassPos1.x, bassPos1.y, GlobalData.GameConfig.radius * PTM_RATIO);
			}
			//if(box.contains(bassPos1)){
			//	totalCount += 1;
			//}
			//let radius1 = GlobalData.GameConfig.radius * PTM_RATIO * 1.2;
			//gra.circle(bassPos1.x, bassPos1.y, radius1);
			gra.fill();
			gra.stroke();
		}

	},
});
