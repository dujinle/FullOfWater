var ThirdAPI = require('ThirdAPI');
var WxVideoAd = require('WxVideoAd');
var WxPortal = require('WxPortal');
cc.Class({
    extends: cc.Component,

    properties: {
		startButton:cc.Node,
		startBBtn:cc.Node,
		soundOnNode:cc.Node,
		soundOffNode:cc.Node,
		scoreLabel:cc.Node,
		openType:cc.Node,
		callback:null,
    },
	onLoad(){
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
	},
	btnFalse(flag){
		this.startButton.getComponent(cc.Button).interactable = flag;
		this.startBBtn.getComponent(cc.Button).interactable = flag;
		if(flag == true){
			if(GlobalData.cdnGameConfig.bdOpenType == 1){
				if(GlobalData.assets['share'] != null){
					this.openType.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share'];
				}
			}else{
				if(GlobalData.assets['video'] != null){
					this.openType.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['video'];
				}
			}
		}
	},
	onShow(){
		console.log('start game scene');
		this.node.active = true;
		if(GlobalData.GameInfoConfig.audioSupport == 1){
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
		}else{
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}
		this.scoreLabel.getComponent(cc.Label).string = '第' + GlobalData.GameInfoConfig.GameCheckPoint + '关';
		if(GlobalData.cdnGameConfig.bdOpenType == 1){
			if(GlobalData.assets['share'] != null){
				this.openType.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share'];
			}
		}else{
			if(GlobalData.assets['video'] != null){
				this.openType.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['video'];
			}
		}
		if(GlobalData.GameInfoConfig.guidBDFlag == 0){
			this.openType.active = true;
		}else{
			this.openType.active = false;
		}
		WxPortal.createAd(1,(err)=>{
			console.log(err);
		})
	},
	bdButtonCb(event){
		if(event != null){
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		}
		if(GlobalData.GameInfoConfig.guidBDFlag == 0){
			if (typeof wx == 'undefined') {
				this.node.active = false;
				if(GlobalData.cdnGameConfig.bdDelFlag != null && GlobalData.cdnGameConfig.bdDelFlag == 1 && GlobalData.GameInfoConfig.onSystemBDDel == 0){
					GlobalData.game.systemTip.getComponent('SystemTip').onShow('StartContent',true,function(){
						GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
					},2);
				}else{
					GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
				}
				WxPortal.destroyBannerAd(1);
				return;
			}
			if(GlobalData.cdnGameConfig.bdOpenType == 1){ //分享
				var param = {
					type:null,
					arg:'budaoStart',
					successCallback:this.shareSuccessCb.bind(this),
					failCallback:this.shareFailedCb.bind(this),
					shareName:'share',
					isWait:true
				};
				ThirdAPI.shareGame(param);
			}else{
				this.DJAVTrueCallFunc = function(arg){
					this.node.active = false;
					WxPortal.destroyBannerAd(1);
					if(GlobalData.cdnGameConfig.bdDelFlag != null && GlobalData.cdnGameConfig.bdDelFlag == 1 && GlobalData.GameInfoConfig.onSystemBDDel == 0){
						GlobalData.game.systemTip.getComponent('SystemTip').onShow('StartContent',true,function(){
							GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
						},2);
					}else{
						GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
					}
				};
				this.DJAVFalseCallFunc = function(arg){
					if(arg == 'cancle'){
						this.shareFailedCb(null,'budaoStart');
					}else if(arg == 'error'){
						GlobalData.cdnGameConfig.bdOpenType = 1;
						this.bdButtonCb(null);
					}
				};
				WxVideoAd.installVideo(this.DJAVTrueCallFunc.bind(this),this.DJAVFalseCallFunc.bind(this),null);
			}
		}else{
			this.node.active = false;
			if(GlobalData.cdnGameConfig.bdDelFlag != null && GlobalData.cdnGameConfig.bdDelFlag == 1){
				GlobalData.game.systemTip.getComponent('SystemTip').onShow('StartContent',true,function(){
					GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
				},2);
			}else{
				GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
			}
			WxPortal.destroyBannerAd(1);
		}
		GlobalData.game.mainGame.active = false;
	},
	startButtonCb(event){
		this.node.active = false;
		GlobalData.game.mainBuDaoGame.active = false;
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		if(GlobalData.cdnGameConfig.delFalg != null && GlobalData.cdnGameConfig.delFalg == 1 && GlobalData.GameInfoConfig.onSystemDel == 0){
			GlobalData.game.systemTip.getComponent('SystemTip').onShow('StartContent',true,function(){
				
				GlobalData.game.mainGame.getComponent('MainGame').initGame();
			},1);
		}else{
			GlobalData.game.mainGame.getComponent('MainGame').initGame();
		}
		WxPortal.destroyBannerAd(1);
	},
	soundButtonCb(){
		if(GlobalData.GameInfoConfig.audioSupport == 0){
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
			GlobalData.GameInfoConfig.audioSupport = 1;
		}else{
			GlobalData.GameInfoConfig.audioSupport = 0;
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}
	},
    shareButtonCb(){
		var param = {
			type:null,
			arg:null,
			successCallback:this.shareSuccessCb.bind(this),
			failCallback:this.shareFailedCb.bind(this),
			shareName:'share',
			isWait:false
		};
		ThirdAPI.shareGame(param);
	},
	rankButtonCb(){
		WxPortal.hideAd(1);
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.rankGame.getComponent('RankGame').show('start',1);
	},
	setButtonCb(){
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.systemTip.getComponent('SystemTip').onShow('DelTrue',true,null,1);
	},
	shareSuccessCb(type, shareTicket, arg){
		if(arg == 'budaoStart'){
			WxPortal.destroyBannerAd(1);
			this.node.active = false;
			if(GlobalData.cdnGameConfig.bdDelFlag != null && GlobalData.cdnGameConfig.bdDelFlag == 1 && GlobalData.GameInfoConfig.onSystemBDDel == 0){
				GlobalData.game.systemTip.getComponent('SystemTip').onShow('StartContent',true,function(){
					GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
				},2);
			}else{
				GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
			}
		}
	},
	shareFailedCb(type,arg){
		try{
			if(arg == 'budaoStart'){
				var self = this;
				var content = GlobalData.msgBox.DJShareContent;
				if(GlobalData.cdnGameConfig.bdOpenType == 2){
					content = GlobalData.msgBox.DJAVContent;
				}
				wx.showModal({
					title:'提示',
					content:content,
					cancelText:'取消',
					confirmText:'确定',
					confirmColor:'#53679c',
					success(res){
						if (res.confirm) {
							self.bdButtonCb(null);
						}else if(res.cancel){}
					}
				});
			}
		}catch(err){
			console.log(err);
		}
	},
});
