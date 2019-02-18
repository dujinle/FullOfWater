var WxGlobal = require('WxAPI');
var util = require('util');
if (typeof wx !== 'undefined') {
    //启动微信初始化
	console.log("load times");
    WxGlobal.initOnEnter();
}

let ThirdAPI = {
    "loadLocalData_storageName": '100Balls-data', //分数和金币相关

	//加载本地分数等数据并填充到全局变量
    loadLocalData: function () {
        //存储在云端的数据结构
        try {
            let storage = cc.sys.localStorage.getItem(ThirdAPI.loadLocalData_storageName);
            console.log('storage data : ' + storage);
			if(storage != null && storage != ""){
				let localData = JSON.parse(storage);
                //兼容新添加的数据
				util.updateObj(GlobalData,localData,null);
				console.log(GlobalData);
            }
        } catch (error) {
			console.log(error);
		}
    },
    loadCDNData:function(){
		var url = GlobalData.cdnWebsite + GlobalData.cdnFileDefaultPath;
		util.httpGET(url,null,function(code,data){
			if(code == 200){
				util.updateObj(GlobalData,data,null);
				console.log(GlobalData);
			}
		});
	},
	//更新游戏云端数据
    updataGameInfo: function () {
		if (typeof wx !== 'undefined') {
			WxGlobal.saveCloudData();
		}
        //云端数据再存储一份在本地
        try {
			var dataDic = {
				"GameInfoConfig":GlobalData.GameInfoConfig
			};
			console.log('GameInfoConfig',dataDic);
            let data = JSON.stringify(dataDic);
            cc.sys.localStorage.setItem(ThirdAPI.loadLocalData_storageName, data);	
        } catch (error) {
            console.error(error);
        }
    },
    //分享游戏
    shareGame: function (parmas) {
        if (typeof wx !== 'undefined') {
            WxGlobal.shareGame(parmas);
        }
    },

    //根据类型来获取不同排行榜
    getRank: function (parmas) {
        if (typeof wx !== 'undefined') {
            //console.log('canshu：', parmas, parmas.type);
            switch (parmas.type) {
                case "gameOverUIRank":
                    WxGlobal.getGameOverUIRank(parmas);
                    break;
                case "rankUIFriendRank":
                    WxGlobal.getFriendRank(parmas);
                    break;
				case "rankUIPageUpDown":
                    WxGlobal.getRankPageUpDown(parmas);
                    break;
                case "rankUIGroupRank":
                    WxGlobal.getGroupRank(parmas);
                    break;
                case 'battleUIRank':
                    WxGlobal.getNextFriendRank(parmas);
                    break;
                case 'initFriendRank':
                    WxGlobal.getInitFriendRank(parmas);
                    break;
                default:
                    break;
            }
        }
    },

    //设置canvas的宽、高（因微信调整不能在开放数据域里改canvas）
    setShareCanvas: function (param) {
        if ((typeof wx !== 'undefined') && param) {
            try {
                let openDataContext = wx.getOpenDataContext();
                let sharedCanvas = openDataContext.canvas;
                sharedCanvas.width = parseInt(param.width);
                sharedCanvas.height = parseInt(param.height);
            } catch (error) {}
        }
    },

    //保存复活分享次数
    saveReviveShareInfo: function () {
        let data = JSON.stringify(Global.localReviveShareInfo);
        console.log('try save local revive', data);
        cc.sys.localStorage.setItem(ThirdAPI.loadLocalData_reviveShareName, data);
    },

    //读取本地的复活
    loadReviveShareInfo: function () {
        var result = {
            reviveTime: (new Date()).toDateString(),
            dayShareReviveTimes: 0
        };

        try {
            let storage = cc.sys.localStorage.getItem(ThirdAPI.loadLocalData_reviveShareName);
            console.log('revive storage data : ' + storage);
            let data = JSON.parse(storage);
            if (data) {
                //判断是否是当天
                if (data.reviveTime && data.reviveTime == (new Date()).toDateString()) {
                    return data;
                } else {
                    return result;
                }
            }
        } catch (error) {}
        return result;
    },

    //初始化本地游戏相关存储
    initGameInfo: function () {
        var _date = new Date(Date.now());

        //获取本地数据
        try {
            var storage = cc.sys.localStorage.getItem(ThirdAPI.loadLocalData_gameInfoName);
            if (storage) {
                var localData = JSON.parse(storage);
                console.log('解析:', localData);
                //兼容新添加的数据
                for (const key in Global.gameInfo) {
                    if (localData[key] == undefined) {
                        console.log('兼容key：', key);
                        localData[key] = Global.gameInfo[key];
                    }
                }
                Global.gameInfo = localData;
            }
        } catch (error) {}

        //第二天处理相关参数
        //道具数量第二天清零
        if (Global.gameInfo.changePropGainDate != _date.toDateString() && Global.cdnGameConfig.secondClearPropNum) {
            Global.gameInfo.changePropNum = 0;
            Global.gameInfo.changePropGainDate = _date.toDateString();
        }

        //第二天看视频日期清零
        if (Global.gameInfo.lastRewardVideoAdDate != _date.toDateString()) {
            Global.gameInfo.rewardVideoAdTimes = 0;
            Global.gameInfo.lastRewardVideoAdDate = _date.toDateString();
        }

        //爆炸道具第二天是否清零或者赠送
        if (Global.gameInfo.bombPropGainDate != _date.toDateString()) {
            Global.gameInfo.bombPropNum = parseInt(Global.cdnGameConfig.bombPropConfig.dayGainBombPropNum);
            Global.gameInfo.bombPropGainDate = _date.toDateString();
        }

        //锤子道具第二天清零
        if (Global.gameInfo.clearPropGainDate != _date.toDateString()) {
            Global.gameInfo.clearPropNum = parseInt(Global.cdnGameConfig.clearPropConfig.dayGainClearPropNum);
            Global.gameInfo.clearPropGainDate = _date.toDateString();
        }

        //判断是否初始化道具数量
        if (!Global.gameInfo.changePropHasInit) {
            Global.gameInfo.changePropHasInit = 1;
            if (Global.cdnGameConfig.chestProp && Global.cdnGameConfig.chestProp.length > 0) {
                var changePropInfo = Global.cdnGameConfig.chestProp[0];
                Global.gameInfo.changePropNum = parseInt(changePropInfo.gainNum);
            }
            console.log('change prop not hasInit ', Global.gameInfo);
        }

        //判断是否初始化爆炸道具数量
        if (!Global.gameInfo.bombPropHasInit && Global.cdnGameConfig.bombPropConfig) {
            Global.gameInfo.bombPropHasInit = 1;
            Global.gameInfo.bombPropNum = parseInt(Global.cdnGameConfig.bombPropConfig.initBombPropNum);
            console.log('bomb prop not hasInit ', Global.gameInfo);
        }

        //判断是否初始化锤子道具
        if (!Global.gameInfo.clearPropHasInit && Global.cdnGameConfig.clearPropConfig) {
            Global.gameInfo.clearPropHasInit = 1;
            Global.gameInfo.clearPropNum = parseInt(Global.cdnGameConfig.clearPropConfig.initClearPropNum);
            console.log('clear prop not hasInit ', Global.gameInfo);
        }
        ThirdAPI.saveGameInfo();
    },

    //存储游戏相关数据到本地
    saveGameInfo: function () {
        try {
            let data = JSON.stringify(Global.gameInfo);
            console.log('try save local gameInfo data', data);
            cc.sys.localStorage.setItem(ThirdAPI.loadLocalData_gameInfoName, data);
        } catch (error) {}
    }
};
module.exports = ThirdAPI;