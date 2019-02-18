var util = require("util");
let WxGlobal = {
	
    initOnEnter: function () {
        console.log('get launch options')
        let options = this.getLaunchOptionsSync();
        console.log('launch options', options);
        if (options) {
            this.shareTicket = options.shareTicket;
            this.scene = options.scene;
            this.query = options.query;
            this.isSticky = options.isSticky;
        }
        this.queryString = '';

        this.setShareTicketEnabled(true);
        this.showShareMenu();
        this.registShare();
        this.registOnShow();
        this.registOnError();
        this.setUserInfo();
        this.resetSharePointConfig();
    },

    // 返回小程序启动参数
    getLaunchOptionsSync: function () {
        return wx.getLaunchOptionsSync();
    },
	//设置分享开启
    setShareTicketEnabled: function (isEnabled) {
        wx.updateShareMenu({
            withShareTicket: isEnabled,
            success: () => {
                WxGlobal.shareTicketEnabled = isEnabled;
            }
        })
    },
	
	//注册右上角的微信分享
    registShare: function () {
        this.onShareAppMessage(() => {
            var shareInfo = this.getShareInfo();
            console.log('用户点击了右上按钮并分享,query:', WxGlobal.queryString);
            return {
                title: shareInfo.text,
                imageUrl: shareInfo.imageUrl,
                query: WxGlobal.queryString
            };
        })
    },
    //设置默认的微信用户数据
    setUserInfo: function () {
        WxGlobal.userInfo = {
            nickName: 'wxname_001',
            maxscore: 0,
            gold: 0,
            iv: '',
            signature: '',
            gender: 1,
            avatarUrl: 'res/raw-assets/resources/plist/items/rank_1.png'
        };
    },

    registOnShow: function () {
        wx.onShow((res) => {
            console.log('wx onShow', res);
            if (res.shareTicket) {
                WxGlobal.shareTicket = res.shareTicket;
            }

            console.log("----------------onShow------------------", this.sharePointConfig);
            // 判断是否在等待分享返回
            if (this.sharePointConfig.wait) {
                // 判断是否大于最小分享时间
                let d = new Date();
                console.log("收获分享：判断是否大于最小分享时间", d, this.sharePointConfig.shareTime);
                if (Date.parse(d) - Date.parse(this.sharePointConfig.shareTime) > GlobalData.cdnGameConfig.minShareTime * 1000) {
                    // 大于最小分享时间
                    console.log("大于最小分享时间");

                    let successWeightIndex = GlobalData.GameInfoConfig.shareTimes % GlobalData.cdnGameConfig.shareSuccessWeight.length;
                    let successWeight = GlobalData.cdnGameConfig.shareSuccessWeight[successWeightIndex];
                    let isSuccess = Math.random() < successWeight;

                    console.log("分享成功概率：", isSuccess, GlobalData.GameInfoConfig.shareTimes, successWeightIndex, successWeight);

                    // 判断是否随机到成功
                    if (isSuccess) {
                        console.log("分享成功!");
                        if (this.sharePointConfig.successcallback) {
                            this.sharePointConfig.successcallback(null, WxGlobal.shareTicket, this.sharePointConfig.arg);
                        }
                    } else {
                        console.log("分享失败!");
                        // 不在最小分享时间内，直接失败
                        if (this.sharePointConfig.failcallback) {
                            this.sharePointConfig.failcallback("cancel", this.sharePointConfig.arg);
                        }
                    }
                    GlobalData.GameInfoConfig.shareTimes++;
                } else {
                    // 小于最小分享时间
                    console.log("小于最小分享时间");
                    if (this.sharePointConfig.failcallback) {
                        this.sharePointConfig.failcallback("cancel", this.sharePointConfig.arg);
                    }
                }
                // 重置分享配置
                this.resetSharePointConfig();
            }
        });
    },
    //重置分享配置
    resetSharePointConfig: function () {
        this.sharePointConfig = {
            name: "",
			arg:null,
            wait: false,
            successcallback: null,
            failcallback: null,
            shareTime: (new Date())
        };
    },
    registOnError: function () {
        wx.onError((res) => {
            console.log('wx error:' + res.message + '\nstack:\n' + res.stack);
        })
    },
    //显示右上菜单的转发按钮
    showShareMenu: function () {
        wx.showShareMenu();
    },

    onShareAppMessage: function (callback) {
        console.log('注册点击转发按钮事件');
        wx.onShareAppMessage(callback);
    },
	shareAppMessage: function (params) {
        console.log('转发:', params);
        wx.shareAppMessage(params);
    },
    //获取微信分享数据（分享图和分享文案）
    getShareInfo: function () {
        var imageUrl;
        var text;
        var shareIndex = util.getRandomIndexForArray(GlobalData.cdnShareImages);
        if (shareIndex > -1) {
            imageUrl = GlobalData.cdnShareImages[shareIndex];
            text = GlobalData.cdnTexts[shareIndex];
        }
        return {
            imageUrl: imageUrl,
            text: text
        };
    },

    //保存云端数据
    saveCloudData: function () {
        if (typeof wx === 'undefined') return;
        var sysInfo = wx.getSystemInfoSync();
        if (sysInfo && sysInfo.SDKVersion < "1.9.92") {
            console.log('支持版本小于1.9.92，不能存储到微信云端');
            return;
        }
        if (!GlobalData) return;
        //存储key-value格式数据到微信云端
        var maxScore = parseInt(GlobalData.GameInfoConfig.maxScore);
        var maxLevel = parseInt(GlobalData.GameInfoConfig.maxLevel);

        let obj = {
            KVDataList: [{
                key: 'maxScore',
                value: maxScore + ''
            }, {
                key: 'maxLevel',
                value: maxLevel + ''
            }]
        }
        console.log('wx saveCloudData:', obj);

        this.setUserCloudStorage(obj);
        //this.setMaxScore(maxScore, maxLevel);
    },

    //保存数据到云端
    setUserCloudStorage: function (params) {
        try {
            console.log('WxGlobal setUserCloudStorage:', params);
            wx.setUserCloudStorage(params);
        } catch (error) {
            console.log(error);
        }
    },

    //设置查询字符串
    setMaxScore: function (maxscore, gold) {
        WxGlobal.queryString =
            'nickName=' + WxGlobal.userInfo.nickName + '&' +
            'maxscore=' + maxscore + '&' +
            'gold=' + gold + '&' +
            'gender=' + WxGlobal.userInfo.gender + '&' +
            'avatarUrl=' + WxGlobal.userInfo.avatarUrl;

        console.log('wx setMaxScore, query:', WxGlobal.queryString);
    },
	
    //拉起微信分享(参数：successCallback,failCallback)
    shareGame: function (params) {
        console.log('分享到群:', params);
        //var checkShareGroup = require('../common/checkShareGroup');
        var shareInfo = this.getShareInfo();
        var successCallback = params.successCallback;
        var failCallback = params.failCallback;

        // 分享点和回调配置
        this.sharePointConfig = {
            name: params.shareName,
			arg:params.arg,
            wait: params.isWait,
            successcallback: successCallback,
            failcallback: failCallback,
            shareTime: (new Date())
        };
		//判断是否打开自定义分享
		if(params.isWait == true){
			successCallback = null;
			failCallback = null;
		}
        WxGlobal.shareAppMessage({
			title: shareInfo.text,
			imageUrl: shareInfo.imageUrl,
            query: WxGlobal.queryString,
            success: (res) => {
				console.log('wx分享成功', res);
				if (res.shareTickets) {
					WxGlobal.shareTicketEnabled = true;
					WxGlobal.shareTicket = res.shareTickets[0];

					wx.getShareInfo({
						shareTicket: res.shareTickets[0],
						success: function (result) {
							console.log('获取分享信息成功', result);
							if (result) {
								if(successCallback != null){
									successCallback(null, WxGlobal.shareTicket, params.arg);
								}
                            }
                        },
                        fail: () => {
                            console.log('获取分享信息失败');
                            if (failCallback) {
                                failCallback("", params.arg);
                            }
                        },
                        complete: () => {},
                    });
                } else {
                    console.log('wx分享到群失败', failCallback, params.arg);
                    if (failCallback) {
						failCallback("fail", params.arg);
					}
				}
			},
            fail: () => {
				console.log('wx换个群试试吧', failCallback, params.arg);
				if (failCallback) {
					failCallback("cancel", params.arg);
				}
			},
			complete: () => {
				console.log('wx分享结束', failCallback);
			},
        });
    },


    //获取好友排行
    getFriendRank: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: params.type
            }
            if (WxGlobal.shareTicketEnabled) {
                msg.shareTicket = WxGlobal.shareTicket;
            }
            console.log('post message', msg);
            openDataContext.postMessage(msg);
            if (params.callback) {
                params.callback('wx');
            }
        } catch (error) {}
    },

    //获取群排行
    getGroupRank: function (params) {
        var callback = {
            type: params.type,
            arg: params,
            successCallback: this.onShareGroupSuccess.bind(this),
            failCallback: this.onShareGroupFail.bind(this)
        };
        this.shareGame(callback);
    },

    //群排行分享成功
    onShareGroupSuccess: function (openGId, shareTicket, arg) {
        console.log('额外参数', arg);
        //分享给群
        try {
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: arg.type,
                shareTicket: shareTicket
            }
            openDataContext.postMessage(msg);
        } catch (error) {}

        if (arg.callback) {
            arg.callback(shareTicket);
            this.shareTicket = undefined;
        }
    },

    //群分享到群失败
    onShareGroupFail: function (msg, params) {
        if (params && params.callback) {
            params.callback('failed');
        }
    },
    //获取游戏结束界面的排行榜
    getGameOverUIRank: function (params) {
        try {
			cc.log("getGameOverUIRank",params);
            let openDataContext = wx.getOpenDataContext()
            let msg = {
                type: 'gameOverUIRank'
            }
            if (WxGlobal.shareTicketEnabled) {
                msg.shareTicket = WxGlobal.shareTicket;
            }
            openDataContext.postMessage(msg);
        } catch (error) {}
    },

    //初始化好友信息
    getInitFriendRank: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext();
            let msg = {
                type: params.type
            }
            if (WxGlobal.shareTicketEnabled) {
                msg.shareTicket = WxGlobal.shareTicket;
            }
            openDataContext.postMessage(msg);
        } catch (error) {}
    },

    //获取战斗界面下一个好友信息
    getNextFriendRank: function (params) {
        try {
            let openDataContext = wx.getOpenDataContext();
            let msg = {
                type: params.type,
                score: params.score
            }
            if (WxGlobal.shareTicketEnabled) {
                msg.shareTicket = WxGlobal.shareTicket;
            }
            openDataContext.postMessage(msg);
            if (params.callback) {
                params.callback('wx');
            }
        } catch (error) {}
    },

};
module.exports = WxGlobal;