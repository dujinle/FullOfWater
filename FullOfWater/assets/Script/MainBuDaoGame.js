var util = require('util');
var ThirdAPI = require('ThirdAPI');
var PropManager = require('PropManager');
var WxVideoAd = require('WxVideoAd');
cc.Class({
	extends: cc.Component,

	properties: {
		pauseButton:cc.Node,
		checkPoint:cc.Node,
		groundNode:cc.Node,
		guideHandle:cc.Node,
		gameTime:cc.Node,
		lastTime:0,
		touchStart:0,
	},
	onLoad(){
		console.log('main game onload');
		this.pymanager = cc.director.getPhysicsManager();
		this.pymanager.start();
		this.gameProp = {};
		// 开启物理步长的设置
		this.pymanager.enabledAccumulator = true;

		// 物理步长，默认 FIXED_TIME_STEP 是 1/60
		this.pymanager.FIXED_TIME_STEP = 1/30;

		// 每次更新物理系统处理速度的迭代次数，默认为 10
		this.pymanager.VELOCITY_ITERATIONS = 8;

		// 每次更新物理系统处理位置的迭代次数，默认为 10
		this.pymanager.POSITION_ITERATIONS = 8;
		
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
	shareOrAV(prop,type){
		this.iscallBack = false;
		this.propKey = prop;
		if(type == "PropShare"){
			this.shareSuccessCb = function(type, shareTicket, arg){
				if(this.iscallBack == false){
					this.trickNode.getComponent('TrackManager').continueTrack();
					EventManager.emit({
						type:'GetPropSuccess',
						prop:this.propKey
					});
				}
				this.iscallBack = true;
			};
			this.shareFailedCb = function(type,arg){
				if(this.iscallBack == false){
					this.trickNode.getComponent('TrackManager').continueTrack();
					this.showFailInfo(null);
				}
				this.iscallBack = true;
			};
			var param = {
				type:null,
				arg:null,
				successCallback:this.shareSuccessCb.bind(this),
				failCallback:this.shareFailedCb.bind(this),
				shareName:type,
				isWait:true
			};
			if(GlobalData.cdnGameConfig.shareCustomSet == 0){
				param.isWait = false;
			}
			ThirdAPI.shareGame(param);
		}
		else if(type == "PropAV"){
			this.AVSuccessCb = function(arg){
				this.trickNode.getComponent('TrackManager').continueTrack();
				EventManager.emit({
					type:'GetPropSuccess',
					prop:arg.propKey
				});
			}.bind(this);
			this.AVFailedCb = function(arg){
				this.trickNode.getComponent('TrackManager').continueTrack();
				this.showFailInfo("看完视频才能获得奖励，请再看一次");
			}.bind(this);
			WxVideoAd.initCreateReward(this.AVSuccessCb,this.AVFailedCb,null);
		}
	},
	showFailInfo(msg){
		if(this.failNode != null){
			this.failNode.stopAllActions();
			this.failNode.removeFromParent();
			this.failNode.destroy();
			this.failNode = null;
		}
		this.failNode = cc.instantiate(GlobalData.assets['PBShareFail']);
		this.mainGameBoard.addChild(this.failNode);
		this.failNode.setPosition(cc.v2(0,0));
		if(msg != null){
			this.failNode.getChildByName('tipsLabel').getComponent(cc.Label).string = msg;
		}
		var actionEnd = cc.callFunc(function(){
			if(this.failNode != null){
				this.failNode.stopAllActions();
				this.failNode.removeFromParent();
				this.failNode.destroy();
				this.failNode = null;
			}
		}.bind(this),this);
		this.failNode.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1),cc.fadeOut(0.5),actionEnd));
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
		this.checkPoint.getComponent(cc.Label).string = "第" + GlobalData.GameInfoConfig.GameBuDaoPoint + '关';
		this.gameInfo = GlobalData.GameBuDaoInfo[GlobalData.GameInfoConfig.GameBuDaoPoint];
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
		GlobalData.GameInfoConfig.gameStatus = 1;
		GlobalData.GameInfoConfig.gameType = 2;
		this.initGuidGame();
		this.initParticle();
		this.addTouchEvent();
	},
	initGuidGame(){
		var self = this;
		if(GlobalData.GameInfoConfig.guidBDFlag == 0){
			var pos = this.rigidCup.getPosition();
			for(var i = 0;i < this.gameProp.length;i++){
				var propN = this.gameProp[i];
				pos = propN.node.getPosition();
				break;
			}
			var size = this.guideHandle.getContentSize();
			this.guideHandle.active = true;
			this.guideHandle.setPosition(cc.v2(pos.x - size.width/2,pos.y - size.height/3));
			this.guideHandle.zIndex = 3;
			var callFunc = cc.callFunc(function(){
				self.guideHandle.rotation = 0;
			});
			var moveEnd = cc.rotateTo(GlobalData.GameConfig.GuideMoveTime,20);
			var repeat = cc.repeatForever(cc.sequence(moveEnd,callFunc));
			this.guideHandle.runAction(repeat);
		}else{
			this.guideHandle.active = false;
		}
	},
	initParticle(){
		let PTM_RATIO = cc.PhysicsManager.PTM_RATIO;
		var shuiLongTouSize = this.rigidCup.getContentSize();
		var shuiLongTouPos = this.rigidCup.getPosition();
		var size = this.node.getContentSize();
		this.particleSystem = this.pymanager._particles;
		var box = new b2.PolygonShape();
		box.SetAsBox(shuiLongTouSize.width/3/PTM_RATIO, shuiLongTouSize.height/2/PTM_RATIO, new b2.Vec2(0, 0), 0);

		var particleGroupDef = new b2.ParticleGroupDef();
		particleGroupDef.shape = box;
		particleGroupDef.flags = b2.waterParticle;
		particleGroupDef.position.Set((shuiLongTouPos.x + size.width/2)/PTM_RATIO,(shuiLongTouPos.y + size.height/2 + shuiLongTouSize.height/2)/PTM_RATIO);
		this.particleGroup = this.particleSystem.CreateParticleGroup(particleGroupDef);
	},
	addTouchEvent(){
		for(var i = 0;i < this.gameProp.length;i++){
			var propNode = this.gameProp[i];
			if(propNode.name == null){
				continue;
			}
			propNode.node.on(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
		}
	},
	offTouchEvent(){
		for(var i = 0;i < this.gameProp.length;i++){
			var propNode = this.gameProp[i];
			if(propNode.name == null){
				continue;
			}
			propNode.node.off(cc.Node.EventType.TOUCH_START, this.eventTouchStart,this);
		}
	},
	eventTouchStart(event){
		console.log('eventTouchStart');
		if(GlobalData.GameInfoConfig.guidBDFlag == 0){
			GlobalData.GameInfoConfig.guidBDFlag = 1;
			this.guideHandle.stopAllActions();
			this.guideHandle.active = false;
		}
		for(var i = 0;i < this.gameProp.length;i++){
			var node = this.gameProp[i];
			if(node.name == event.target.name){
				node.name = null;
				break;
			}
		}
		event.target.removeFromParent();
		event.target.destroy();
		if(this.touchStart == 0){
			this.schedule(this.cupAction,0.3);
			this.touchStart = 1;
		}
	},
	
	cupAction(){
		var rigidBody = this.rigidCup.getComponent(cc.RigidBody);
		var curPos = this.rigidCup.getPosition();
		console.log(curPos.x,curPos.y);
		if(this.lastPos != null && Math.abs(this.lastPos.x - curPos.x) <= 0.001 && Math.abs(curPos.y - this.lastPos.y) <= 0.001){
			//console.log(rigidBody.linearVelocity,rigidBody.angularVelocity);
			var res = this.checkOnce();
			if(res == false){
				this.rigidCup.getComponent('RigidCupManager').setStatus('fail');
				this.offTouchEvent();
				this.unschedule(this.cupAction);
			}else{
				var leftProp = 0;
				for(var i = 0;i < this.gameProp.length;i++){
					var node = this.gameProp[i];
					if(node.name != null){
						leftProp += 1;
					}
				}
				if(leftProp == 0){
					this.rigidCup.getComponent('RigidCupManager').setStatus('smile');
					this.offTouchEvent();
					this.unschedule(this.cupAction);
				}
			}
		}
		this.lastPos = this.rigidCup.getPosition();
	},
	//检查是否符合结果
	checkOnce(){
		if(this.rigidCup == null){
			return false;
		}
		var angleRotate = this.rigidCup.rotation % 360;
		if(angleRotate > 20 && angleRotate <= 340){
			return false;
		}
		if(angleRotate < -20 && angleRotate > -340){
			return false;
		}
		return true;
	},
	destroyGame(){
		this.rigidCup.removeFromParent();
		this.rigidCup.destroy();
		this.lastTime = 0;
		GlobalData.GameInfoConfig.gameTime = 0;
		for(var i = 0;i < this.gameProp.length;i++){
			var node = this.gameProp[i];
			if(node.name != null){
				node.node.removeFromParent();
				node.node.destroy();
			}
		}
		this.touchStart = 0;
		this.gameProp = [];
		if(this.particleSystem != null){
			this.particleGroup.DestroyParticles(null);
			this.particleSystem.DestroyParticleGroup(this.particleGroup);
			this.particleSystem = null;
		}
		let gra = this.node.getComponent(cc.Graphics);
		gra.clear();
		ThirdAPI.updataGameInfo();
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
		let vertsCount = this.particleSystem.GetParticleCount();
		let posVerts = this.particleSystem.GetPositionBuffer();
		let gra = this.node.getComponent(cc.Graphics);
		gra.clear();
		let totalCount = 0;
		//var box = this.rigidCup.getBoundingBox();
		for (let i = 0; i < vertsCount; i++) {
			let bassPos1 = cc.v2(posVerts[i].x,posVerts[i].y);
			//let bassPos2 = cc.v2(posVerts[i + 1].x,posVerts[i + 1].y);
			bassPos1.x = (bassPos1.x * PTM_RATIO) - size.width/2;
			bassPos1.y = (bassPos1.y * PTM_RATIO) - size.height/2;
			//bassPos2.x = (bassPos2.x * PTM_RATIO) - size.width/2;
			//bassPos2.y = (bassPos2.y * PTM_RATIO) - size.height/2;
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
