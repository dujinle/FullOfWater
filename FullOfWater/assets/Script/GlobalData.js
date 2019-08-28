GlobalData = {
	AudioManager:{
		ButtonClick:0,
		CupTouchThing:1,
		WaterFall:2,
		CupSmile:3,
		Complete:4,
		AudioEnginMore:8,
		AudioPlays:[]
	},
	GameCheckInfo:{
		1:{
			RigidCup:[30,-327],
			cupLine:[-200,-315],
			RigidDangBan120:[-200,-372],
			RigidShuiLongTou:[-200,0]
		},
		2:{
			RigidCup:[-225.6667487018783, -328.1225484220456],
			RigidDangBan240:[177.97901049475263, -268.24587706146923],
			RigidShuiLongTou:[208.63568215892053, 99.63418290854577],
			cupLine:[208.63556571564538, -209.97791982206803]
		},
		3:{
			"RigidXZDangBan120": [
				-192.455772113943,
				-332.1139430284857
			],
			"RigidDangBan120": [
				-86.86056971514242,
				-369.5832083958021
			],
			"RigidShuiLongTou": [
				-81.7511244377811,
				-71.5322338830585
			],
			"RigidCup": [
				209.48738765647192,
				-328.23181149418036
			],
			"cupLine": [
				-81.75139589864747,
				-311.1387322125751
			]
		},
		4:{
			"RigidXZDangBan120": [
				-238.44077961019485,
				-269.0974512743628
			],
			"RigidDangBan120": [
				-81.7511244377811,
				-316.7856071964018
			],
			"RigidShuiLongTou": [
				-76.64167916041976,
				3.4062968515740977
			],
			"RigidCup": [
				209.48738765647192,
				-328.23181149418036
			],
			"cupLine": [
				-76.64167916041976,
				-258.3411310131748
			]
		},
		5:{
			"RigidDangBan240": [
				-124.32983508245877,
				-309.97301349325335
			],
			"RigidShuiLongTou": [
				-122.62668665667164,
				102.18890554722645
			],
			"cupLine": [
				-122.62714002543743,
				-251.7050613502377
			],
			"RigidCup": [
				214.5957102273818,
				-328.2318957672435
			]
		},
		6:{
			"RigidXFDangBan120": [
				-226.5187406296851,
				-328.7076461769116
			],
			"RigidXZDangBan120": [
				-45.98500749625185,
				-328.7076461769115
			],
			"RigidDangBan240": [
				-139.65817091454272,
				-270.8005997001499
			],
			"RigidShuiLongTou": [
				-127.73613193403298,
				83.45427286356824
			],
			"cupLine": [
				-127.7361886796183,
				-212.53386380477718
			],
			"RigidCup": [
				226.51905082369478,
				-328.2319358383977
			]
		}
	},
	GameCustomDefault:{
		tryTimes:3,
		RigidCup:[30,-327],
		RigidDangBan120:[-200,-372],
		RigidShuiLongTou:[-200,0]
	},
	GameConfig:{
		radius:0.2,
		GuideMoveTime:1.5,			//引导动画时间
		PauseGameMoveTime:0.3		//暂停游戏界面的时间
	},
	RigidBodyTag:{
		bottom:1,
		cup:2
	},
	GameInfoConfig:{
		AudioPlayNum:0,
		audioSupport:1,
		GameCheckPoint:1,
		tryTimesCurrent:0,
		maxScore:0,
		maxLevel:0,
		guidFlag:0,
		shareTimes:0,
		gameStatus:0,
		juNum:0
	},
	cdnGameConfig:{
		refreshBanner:0,		//0 关闭	1打开
		minShareTime:2,
		gameModel:'crazy',
		shareSuccessWeight:[1,1,0.8,0.8,0.6],
		shareCustomSet:1		//0 关闭 自定义分享 1打开自定义分享
	},
	//道具概率参数                                                                                                                
	GamePropParam:{
		bagNum:{
			PropBig:0,
			PropUpLevel:0,
			PropAddBall:0
		},
		useNum:{
			PropBig:0,
			PropUpLevel:0,
			PropAddBall:0
		}
	},
	cdnPropParam:{	//道具自定义参数
		PropUnLock:{	//道具解锁盘数
			PropBig:1,
			PropUpLevel:1,
			PropAddBall:1
		},
		PropParam:{
			//变大概率参数设置
			PropBig:{
				bagNum:2,
				useNum:2,
			},
			//升级概率参数设置
			PropUpLevel:{
				bagNum:2,
				useNum:2
			},
			//加5球概率参数设置
			PropAddBall:{
				bagNum:-1,
				useNum:-1
			}
		},
		PropShareOrADRate:{
			PropBig:{
				PropShare:1,
				PropAV:0
			},
			PropUpLevel:{
				PropShare:1,
				PropAV:0
			}
		}
	},
	cdnShareImages:["res/raw-assets/d7/d79c420a-58c2-4663-87c0-3119e3f3fd94.d3b6b.png"],
	cdnTexts:["你介意男生玩这个游戏吗?"]
};