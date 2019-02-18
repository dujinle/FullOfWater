GlobalData = {
	AudioManager:{
		ButtonClick:0,
		AudioEnginMore:8,
		AudioPlays:[]
	},
	GameCheckInfo:{
		1:{
			tryTimes:10,
			RigidCup:[30,-327],
			RigidDangBan120:[-200,-372],
			shuiLongTou:[-200,0]
		}
	},
	//数字更新时间
	TimeActionParam:{
		GuideMoveTime:2,			//引导动画时间
		EatNodeMoveTime:0.2,		//被吃掉的子移动时间
		EatNodeSameDelayTime:0,		//同类子移动延迟单元
		EatNodeOtherDelayTime:0.05,	//不同类子被吃间隔时间
		EatNodeBigTime:0.1,			//数字变大的时间这个值需要x2
		RefreshNodeTime:0.3,		//刷新数字的时间
		PropSBAScaleTime:0.3,		//宝箱弹出效果时间
		NumRollCell:2,				//数字roll的单元
		NumRollTime:0.2,			//数字刷新时长
		EatFlyTimeCell:0.5,			//数字飞的时间总时长 EatFlyTimeCell * 2.5
		StartGameMoveTime:0.3,		//开始界面的效果
		PauseGameMoveTime:0.3		//暂停游戏界面的时间
	},
	RigidBodyTag:{
		ball:0,
		contentClose:1,
		contentOpen:2,
		floor:3,
		contentLine:4,
		cupInner:5,
		cupLine:6,
		cupFallRight:8,
		cupFallLeft:9,
		cupRightRotate:10,
		cupLeftRotate:11
	},
	WorldConfig:{
		gravity:[0,-320]
	},
	GameRunTime:{
		AudioPlayNum:0,
		GameCheckPoint:1,
		tryTimesCurrent:1,
		totalScore:0,
		maxScore:0
	},
	GameInfoConfig:{
		audioSupport:1,
		ballTouchBottom:0,
		maxScore:0,
		maxLevel:0,
		addCupNum:0,
		shareTimes:0,
		gameStatus:0,
		linerDamp:0,
		juNum:0
	},
	cdnGameConfig:{
		refreshBanner:0,		//0 关闭	1打开
		minShareTime:2,
		gameModel:'crazy',
		shareSuccessWeight:[1,1,0.8,0.8,0.6],
		shareCustomSet:1		//0 关闭 自定义分享 1打开自定义分享
	},
	CupConfig:{
		CupColor:['White','Green','Blue','Violet','Orange','Red'],
		CupColorDic:{
			White:[255,255,255],
			Green:[0,128,0],
			Blue:[0,0,255],
			Violet:[128,0,128],
			Orange:[255,165,0],
			Red:[255,0,0]
		},
		CupCreatNum:6,
		CupMoveSpeed:0.15,
		CupMoveMSpeed:0.45,//杯子的最大旋转速度，超过之后要进行衰减
		CupMoveASpeed:1.5,
		CupSpeedArate:0.1,//每三轮速度增加率
		CupMoveDir:'right',
		CupUpLevel:3
	},
	BallConfig:{
		BallColor:['Yellow','Green','Blue','Violet','Orange','Red'],
		BallColorDic:{
			Yellow:[255,255,0],
			Green:[0,128,0],
			Blue:[0,0,255],
			Violet:[128,0,128],
			Orange:[255,165,0],
			Red:[255,0,0]
		},
		BallGravityScale:5,
		BallUpLevel:1,
		BallTotalNum:100,
		BallGravityScale:10,
		BallPreFall:20,
		BallRowArray:[8,9,10,11,12,12,11,10,9,8]
	},
	BallInCupPos:[
		[21,-35],[0,-39],[-21,-35],
		[22,-15],[0,-19],[-22,-15],
		[23,5],[0,1],[-23,5],
		[24,25],[0,21],[-24,25]
	],
	ScoreLevel:[1,2,3,4,5,6],
	cdnGameConfig:{
		refreshBanner:0,		//0 关闭	1打开
		minShareTime:2.8,
		gameModel:'crazy',
		shareSuccessWeight:[1,1,1,1,1],
		shareADLevel:50000,
		PropShare:0.5,
		PropAV:0.5,
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