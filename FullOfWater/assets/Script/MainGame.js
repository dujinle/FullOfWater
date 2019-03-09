var util = require('util');
var ThirdAPI = require('ThirdAPI');
var PropManager = require('PropManager');
var EventManager = require('EventManager');
var WxVideoAd = require('WxVideoAd');
var MetaBall = require('MetaBall');
cc.Class({
    extends: cc.Component,

    properties: {
		pauseButton:cc.Node,
		checkPoint:cc.Node,
		groundNode:cc.Node,
		tryTimesLabel:cc.Node,
		graphicsNode:cc.Node,
		waterFall:cc.Node,
		lastTime:0,
		gameStatus:0,
		fallWaterFlag:false,
		fallWaterWave:false,
		audioManager:null,
    },

    onLoad () {
		//打开物理属性 碰撞检测
		this.pymanager = cc.director.getPhysicsManager();
		//this.pymanager.enabled = true;
		this.graphics = this.graphicsNode.getComponent(cc.Graphics);
		this.gameProp = {};
		this.pymanager.start();
		this.pymanager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_pairBit |
			cc.PhysicsManager.DrawBits.e_centerOfMassBit |
			cc.PhysicsManager.DrawBits.e_jointBit |
			cc.PhysicsManager.DrawBits.e_shapeBit |
			cc.PhysicsManager.DrawBits.e_aabbBit;
	},
	//所有面板的button按钮 返回函数
	panelButtonCb(event,customEventData){
		var self = this;
		//继续游戏
		console.log('panelButtonCb',customEventData);
		this.audioManager.getComponent("AudioManager").play(GlobalData.AudioManager.ButtonClick);
		if(customEventData == "P_show"){
			this.audioManager.getComponent("AudioManager").pauseGameBg();
			EventManager.emit({
				type:'PauseGame'
			});
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
	//再次进入游戏 数据重置
	enterGame(){
		GlobalData.GameInfoConfig.juNum += 1;
		this.ballsNum.getComponent(cc.Label).string = GlobalData.GameRunTime.BallUnFallNum;
		this.freshPropStatus();
		this.initFallBalls();
		this.trickNode.getComponent('TrackManager').startTrack();
		this.audioManager.getComponent('AudioManager').playGameBg();
		GlobalData.GameRunTime.CurrentSpeed = GlobalData.CupConfig.CupMoveSpeed;
		ThirdAPI.updataGameInfo();
	},
	initHide(audioManager){
		this.audioManager = audioManager;
		this.node.active = false;
	},
	//第一次进入游戏初始化数据
	initGame(){
		this.node.active = true;
		this.audioManager.getComponent('AudioManager').playGameBg();
		this.checkPoint.getComponent(cc.Label).string = "第" + GlobalData.GameRunTime.GameCheckPoint + '关';
		this.gameInfo = GlobalData.GameCheckInfo[GlobalData.GameRunTime.GameCheckPoint];
		this.tryTimesLabel.getComponent(cc.Label).string = GlobalData.GameRunTime.tryTimesCurrent + '/' + this.gameInfo.tryTimes;
		for(var key in this.gameInfo){
			if(GlobalData.assets[key] != null){
				var pos = this.gameInfo[key];
				var node = cc.instantiate(GlobalData.assets[key]);
				if(key == 'RigidCup'){
					this.rigidCup = node;
					this.rigidCup.getComponent('RigidCupManager').initData(this.audioManager);
				}else if(key == 'RigidShuiLongTou'){
					this.shuiLongTou = node;
				}else if(key == 'cupLine'){
					this.cupLine = node;
				}else{
					this.gameProp[key] = node;
				}
				this.groundNode.addChild(node);
				node.setPosition(cc.v2(pos[0],pos[1]));
			}
		}
		this.addTouchEvent();
		this.initParticle();
		//this.buyos.active = true;
		//this.buyos.setPosition(this.rigidCup.getPosition());
		//this.fallWater();
	},
	initParticle(){
		let PTM_RATIO = cc.PhysicsManager.PTM_RATIO;
		var shuiLongTouSize = this.shuiLongTou.getContentSize();
		var shuiLongTouPos = this.shuiLongTou.getPosition();
		var size = this.node.getContentSize();
		var world = this.pymanager._world;

		this.particleSystem = this.pymanager._particle;
		var box = new b2.PolygonShape();
		box.SetAsBox(shuiLongTouSize.width/2/PTM_RATIO, (shuiLongTouSize.height * 2.5)/PTM_RATIO, new b2.Vec2(0, 0), 0);

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
		this.touchMoveFlag = true;
		this.initLocation = this.rigidCup.getPosition();
		this.touchLocation = this.node.convertToNodeSpaceAR(event.getLocation());
		this.origin = this.touchLocation.clone();//射线原点坐标
		this.graphics.clear();
		this.graphics.moveTo(this.origin.x,this.origin.y);
		console.log('eventTouchStart',this.initLocation,this.touchLocation);
		//for test
		this.shuiLongTou.getComponent('ShuiLongTou').onOpen();
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
		this.touchMoveFlag = false;
		this.graphics.clear();
		var increat = this.touchLocation.sub(this.origin);
		var point = this.node.convertToWorldSpaceAR(this.origin);
		this.rigidCup.getComponent('RigidCupManager').applyForce(increat,point);
		GlobalData.GameRunTime.tryTimesCurrent += 1;
		this.tryTimesLabel.getComponent(cc.Label).string = GlobalData.GameRunTime.tryTimesCurrent + '/' + this.gameInfo.tryTimes;
	},
	eventTouchCancel(event){
		this.touchMoveFlag = false;
		this.graphics.clear();
		var increat = this.touchLocation.sub(this.origin);
		var point = this.node.convertToWorldSpaceAR(this.origin);
		this.rigidCup.getComponent('RigidCupManager').applyForce(increat,point);
		GlobalData.GameRunTime.tryTimesCurrent += 1;
		this.tryTimesLabel.getComponent(cc.Label).string = GlobalData.GameRunTime.tryTimesCurrent + '/' + this.gameInfo.tryTimes;
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
		for(var key in this.gameProp){
			var node = this.gameProp[key];
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
		this.fallWaterFlag = true;
		this.offTouchEvent();
		this.rigidCup.runAction(cc.moveTo(0.2,this.cupLine.getPosition()));
		this.shuiLongTou.getComponent('ShuiLongTou').onOpen();
		this.audioManager.getComponent('AudioManager').keepPlay(GlobalData.AudioManager.WaterFall,true);
		this.fallWaterWave = true;
	},
	destroyGame(){
		this.rigidCup.removeFromParent();
		this.rigidCup.destroy();
		this.shuiLongTou.removeFromParent();
		this.shuiLongTou.destroy();
		this.cupLine.removeFromParent();
		this.cupLine.destroy();
		for(var key in this.gameProp){
			var node = this.gameProp[key];
			node.removeFromParent();
			node.destroy();
		}
		this.audioManager.getComponent('AudioManager').stopGameBg();
		this.particleGroup.DestroyParticles(null);
		this.particleSystem.DestroyParticleGroup(this.particleGroup);
		this.node.active = false;
	},
	update (dt) {
		if(this.touchMoveFlag == false){
			var rigidBody = this.rigidCup.getComponent(cc.RigidBody);
			if(rigidBody.angularVelocity == 0 && rigidBody.linearVelocity.x == 0 && rigidBody.linearVelocity.y == 0){
				//console.log(rigidBody.linearVelocity,rigidBody.angularVelocity);
				var res = this.checkOnce();
				if(res == true){
					this.touchMoveFlag = true;
					this.fallWater();
				}
			}
		}
		if(this.particleSystem == null){
			return;
		}
		if(this.fallWaterFlag == false){
			return;
		}
		let size = this.node.getContentSize();
		let PTM_RATIO = cc.PhysicsManager.PTM_RATIO;
		let SLTPos = this.shuiLongTou.getPosition();
		let SLTSize = this.shuiLongTou.getContentSize();
		let vertsCount = this.particleSystem.GetParticleCount();
		let posVerts = this.particleSystem.GetPositionBuffer();
        let gra = this.getComponent(cc.Graphics);
        gra.clear();
        //gra.fillColor = cc.Color.BLUE;
		let totalCount = 0;
		var box = this.rigidCup.getBoundingBox();
        for (let i = 0; i < vertsCount; i++) {
            let bassPos1 = cc.v2(posVerts[i].x,posVerts[i].y);
			bassPos1.x = (bassPos1.x * PTM_RATIO) - size.width/2;
			bassPos1.y = (bassPos1.y * PTM_RATIO) - size.height/2;
			if(bassPos1.y >= (SLTPos.y - SLTSize.height/2 - 10)){
				continue;
			}
			if(box.contains(bassPos1)){
				totalCount += 1;
			}
            let radius1 = GlobalData.GameConfig.radius * PTM_RATIO * 1.2;
            gra.circle(bassPos1.x, bassPos1.y, radius1);
            gra.fill();
			gra.stroke();
		}
		if(totalCount > 3 && this.gameStatus == 0){
			this.gameStatus = 1;
			this.fallWaterWave = false;
			this.shuiLongTou.getComponent('ShuiLongTou').onClose();
			this.audioManager.getComponent('AudioManager').keepPlay(GlobalData.AudioManager.WaterFall,false);
			this.rigidCup.getComponent('RigidCupManager').setStatus('smile');
		}
		if(this.fallWaterWave == true){
			let bassPos1 = cc.v2(posVerts[vertsCount - 1].x,posVerts[vertsCount-1].y);
			bassPos1.x = (bassPos1.x * PTM_RATIO) - size.width/2;
			bassPos1.y = (bassPos1.y * PTM_RATIO) - size.height/2;
			if(bassPos1.y < (SLTPos.y - SLTSize.height/2 - 10)){
				this.fallWaterWave = false;
				this.audioManager.getComponent('AudioManager').keepPlay(GlobalData.AudioManager.WaterFall,false);
			}
		}
	},
});
