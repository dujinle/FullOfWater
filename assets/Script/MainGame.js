var util = require('util');
var ThirdAPI = require('ThirdAPI');
var PropManager = require('PropManager');
var EventManager = require('EventManager');
var WxVideoAd = require('WxVideoAd');
cc.Class({
    extends: cc.Component,

    properties: {
		pauseButton:cc.Node,
		checkPoint:cc.Node,
		groundNode:cc.Node,
		tryTimesLabel:cc.Node,
		graphicsNode:cc.Node,
		waterFall:cc.Node,
		audioManager:null,
    },

    onLoad () {
		//打开物理属性 碰撞检测
		this.pymanager = cc.director.getPhysicsManager();
		//this.pymanager.enabled = true;
		this.graphics = this.graphicsNode.getComponent(cc.Graphics);
		this.gameProp = {};
		this.waterPool = new Array();
		this.pymanager.start();
		this.pymanager.debugDrawFlags = 
		cc.PhysicsManager.DrawBits.e_aabbBit |
		cc.PhysicsManager.DrawBits.e_pairBit |
		cc.PhysicsManager.DrawBits.e_centerOfMassBit |
		cc.PhysicsManager.DrawBits.e_jointBit |
		cc.PhysicsManager.DrawBits.e_shapeBit
		cc.PhysicsManager.DrawBits.e_particleBit
		;
	},
	//所有面板的button按钮 返回函数
	panelButtonCb(event,customEventData){
		var self = this;
		//继续游戏
		console.log('panelButtonCb',customEventData);
		this.audioManager.getComponent("AudioManager").play(GlobalData.AudioManager.ButtonClick);
		if(customEventData == "P_show"){
			this.audioManager.getComponent("AudioManager").pauseGameBg();
			this.trickNode.getComponent('TrackManager').stopTrack();
			this.showPBGameScene({
				scene:'PauseGameScene',
				type:null
			});
		}else if(customEventData == "C_Big"){
			var ret = PropManager.checkPropAbled('PropBig');
			if(ret == 0){
				var propType = PropManager.getProp('PropBig');
				if(propType != null){
					this.trickNode.getComponent('TrackManager').stopTrack();
					this.shareOrAV('PropBig',propType);
				}
			}else if(ret == 1){
				this.trickNode.getComponent('TrackManager').bigOneCup();
				this.freshPropStatus();
			}
		}else if(customEventData == "C_UpLevel"){
			var ret = PropManager.checkPropAbled('PropUpLevel');
			if(ret == 0){
				var propType = PropManager.getProp('PropUpLevel');
				if(propType != null){
					this.trickNode.getComponent('TrackManager').stopTrack();
					this.shareOrAV('PropUpLevel',propType);
				}
			}else if(ret == 1){
				this.trickNode.getComponent('TrackManager').upLevelCup(false);
				this.freshPropStatus();
			}
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
		this.pauseButton.active = false;
		this.checkPoint.active = false;
		this.groundNode.active = false;
		this.tryTimesLabel.active = false;
	},
	//第一次进入游戏初始化数据
	initGame(){
		this.groundNode.active = true;
		this.checkPoint.active = true;
		this.tryTimesLabel.active = true;
		this.pauseButton.active = true;
		this.checkPoint.getComponent(cc.Label).string = "第" + GlobalData.GameRunTime.GameCheckPoint + '关';
		this.gameInfo = GlobalData.GameCheckInfo[GlobalData.GameRunTime.GameCheckPoint];
		this.tryTimesLabel.getComponent(cc.Label).string = GlobalData.GameRunTime.tryTimesCurrent + '/' + this.gameInfo.tryTimes;
		for(var key in this.gameInfo){
			if(GlobalData.assets[key] != null){
				var pos = this.gameInfo[key];
				var node = cc.instantiate(GlobalData.assets[key]);
				if(key == 'RigidCup'){
					this.rigidCup = node;
				}else if(key == 'shuiLongTou'){
					this.shuiLongTou = node;
				}else{
					this.gameProp[key] = node;
				}
				this.groundNode.addChild(node);
				node.setPosition(cc.v2(pos[0],pos[1]));
			}
		}
		this.addTouchEvent();
		this.fallWater();
		//this.waterFall.getComponent('MetaballManager').fallWater();
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
		this.initLocation = this.rigidCup.getPosition();
		this.touchLocation = this.node.convertToNodeSpaceAR(event.getLocation());
		this.origin = this.touchLocation.clone();//射线原点坐标
		this.graphics.clear();
		this.graphics.moveTo(this.origin.x,this.origin.y);
		console.log('eventTouchStart',this.initLocation,this.touchLocation);
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
	},
	eventTouchCancel(event){
		this.graphics.clear();
		var increat = this.touchLocation.sub(this.origin);
		var point = this.node.convertToWorldSpaceAR(this.origin);
		this.rigidCup.getComponent('RigidCupManager').applyForce(increat,point);
		var res = this.checkOnce();
		if(res == true){
			this.fallWater();
		}else{
			GlobalData.GameRunTime.tryTimesCurrent += 1;
			this.tryTimesLabel.getComponent(cc.Label).string = GlobalData.GameRunTime.tryTimesCurrent + '/' + this.gameInfo.tryTimes;
		}
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
		window.PTM_RATIO = cc.PhysicsManager.PTM_RATIO;
		var size = this.node.getContentSize();
		var world = this.pymanager._world;

		var particleSystem = this.pymanager._particle;
		var colorBuffer = particleSystem.GetColorBuffer();
		//particleSystem.SetColorBuffer();
		var box = new b2.PolygonShape();
		box.SetAsBox(0.9, 0.9, new b2.Vec2(10, 10), 0);

		var particleGroupDef = new b2.ParticleGroupDef();
		particleGroupDef.shape = box;
		particleGroupDef.flags = b2.tensileParticle | b2.viscousParticle;
		var particleGroup = particleSystem.CreateParticleGroup(particleGroupDef);
		this.waterFall.getComponent('liquidShader').initLiquid(particleSystem,PTM_RATIO);
	},
	
	BallFallEvent(data){
		var self = this;
		console.log(data);
		if(data.type == 'FallLine'){
			GlobalData.GameRunTime.BallAbledNum -= 1;
			if(GlobalData.GameRunTime.BallUnFallNum > 0){
				this.fallOneBall();
			}
			this.finishGame();
		}else if(data.type == 'CupRemove'){
			this.trickNode.getComponent('TrackManager').removeCup(data.uuid);
			GlobalData.GameRunTime.CupAbledNum -= 1;
			delete GlobalData.GameRunTime.CupNodesDic[data.uuid];
			this.finishGame();
		}else if(data.type == 'StartGame'){
			this.startGameBoard.active = false;
			this.mainGameBoard.active = true;
			this.clearGame();
			this.initGame();
		}else if(data.type == 'ReStartGame'){
			this.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
			this.finishGameScene.removeFromParent();
			this.finishGameScene.destroy();
			this.clearGame();
			this.enterGame();
		}
		else if(data.type == 'UpdateScore'){
			GlobalData.GameRunTime.TotalScore += data.score;
			this.scoreLabel.getComponent(cc.Label).string = GlobalData.GameRunTime.TotalScore;
			if(GlobalData.GameRunTime.TotalScore > GlobalData.GameInfoConfig.maxScore){
				GlobalData.GameInfoConfig.maxScore = GlobalData.GameRunTime.TotalScore;
				GlobalData.GameInfoConfig.maxLevel = GlobalData.GameRunTime.CircleLevel;
				ThirdAPI.updataGameInfo();
			}
		}
		else if(data.type == 'UpdateCircle'){
			this.levelLabel.getComponent(cc.Label).string = GlobalData.GameRunTime.CircleLevel;
			this.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.LevelBell);
			//如果球体升级则进行颜色变化
			var self = this;
			var trickNodeSize = this.trickNode.getContentSize();
			//动画速度 0.1s/100m
			var time = (trickNodeSize.width/2 + 100)/GlobalData.GameRunTime.CurrentSpeed;
			
			
			if(GlobalData.GameRunTime.CircleLevel % GlobalData.BallConfig.BallUpLevel == 0){
				setTimeout(function(){
					let UpLevelIsValid = new Array();
					for(let key in GlobalData.GameRunTime.ContentBallsDic){
						let ball = GlobalData.GameRunTime.ContentBallsDic[key];
						if(ball != null && ball.isValid){
							UpLevelIsValid.push(ball);
						}
					}
					let BallNode = util.getRandomObjForArray(UpLevelIsValid);
					if(BallNode != -1){
						var ballCom = BallNode.getComponent('RigidBall');
						if(ballCom.level < (GlobalData.BallConfig.BallColor.length - 1)){
							ballCom.setColor(ballCom.level + 1);
						}
					}
				},time);
			}
			if(GlobalData.GameRunTime.CircleLevel % GlobalData.CupConfig.CupUpLevel == 0){
				//设置速度升级
				GlobalData.GameRunTime.CurrentSpeed *= (1 + GlobalData.CupConfig.CupSpeedArate);
				if(GlobalData.GameRunTime.CurrentSpeed >= GlobalData.CupConfig.CupMoveMSpeed){
					GlobalData.GameRunTime.CurrentSpeed = GlobalData.CupConfig.CupMoveMSpeed
				}
				setTimeout(function(){
					self.trickNode.getComponent('TrackManager').upLevelCup(true);
				},time);
			}
		}
		else if(data.type == 'RankView'){
			//WxBannerAd.hideBannerAd();
			if(this.finishGameScene != null){
				this.finishGameScene.getComponent("FinishGame").isDraw = false;
			}
			this.showPBGameScene({
				scene:'RankGameScene',
				type:'rankUIFriendRank'
			});
		}
		else if(data.type == 'RankGroupView'){
			if(this.finishGameScene != null){
				this.finishGameScene.getComponent("FinishGame").isDraw = false;
			}
			this.showPBGameScene({
				scene:'RankGameScene',
				type:'rankUIGroupRank'
			});
		}
		else if(data.type == 'PauseContinue'){
			this.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
			if(this.pauseGameScene != null){
				this.pauseGameScene.getComponent("PauseGame").hidePause(function(){
					self.audioManager.getComponent('AudioManager').resumeGameBg();
					self.destroyGameBoard(self.pauseGameScene);
					self.trickNode.getComponent('TrackManager').continueTrack();
				});
			}
		}
		else if(data.type == 'PauseReset'){
			this.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
			if(this.pauseGameScene != null){
				this.pauseGameScene.getComponent("PauseGame").hidePause(function(){
					self.destroyGameBoard(self.pauseGameScene);
					self.destroyGame();
					self.audioManager.getComponent('AudioManager').stopGameBg();
					self.startGameBoard.active = true;
				});
			}
		}
		else if(data.type == 'GetPropSuccess'){
			if(this.propFly != null){
				this.propFly.stopAllActions();
				this.propFly.removeFromParent();
				this.propFly.destroy();
				this.propFly = null;
			}
			this.propFly = cc.instantiate(GlobalData.assets['PBPropFly']);
			this.mainGameBoard.addChild(this.propFly);
			this.propFly.setPosition(cc.v2(0,0));
			if(data.prop == 'PropBig'){
				var buttonBig = this.buttonNodes.getChildByName('buttonBig');
				this.propFly.getComponent('PropFly').startFly(0.2,'buttonBig',1,buttonBig.getPosition(),function(){
					GlobalData.GamePropParam.bagNum[data.prop] += 1;
					//ThirdAPI.updataGameInfo();
					self.freshPropStatus();
				});
			}else if(data.prop == 'PropUpLevel'){
				var buttonUpLevel = this.buttonNodes.getChildByName('buttonUpLevel');
				this.propFly.getComponent('PropFly').startFly(0.2,'buttonUpLevel',1,buttonUpLevel.getPosition(),function(){
					GlobalData.GamePropParam.bagNum[data.propKey] += 1;
					//ThirdAPI.updataGameInfo();
					self.freshPropStatus();
				});
			}
		}
	},// update (dt) {},
});
