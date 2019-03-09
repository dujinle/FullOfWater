/*
 * file : LinkImages.js
 * brief: This file can link images on different platforms.
 */

let WxVideoAd = {
    videoAd: null,

    initCreateReward: function (onCLoseCallback, onFailedCallBack,arg) {
        if (typeof wx !== 'undefined') {
            console.log('call initCreateReward');

            try {
                let videoAd = wx.createRewardedVideoAd({
                    adUnitId: 'adunit-317a6f77277bb1b1'
                })

                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => {
                        console.log('ad load faild:', err.errMsg)
                        // videoAd.load()
                        //     .then(() => videoAd.show())
                    })

                videoAd.offClose();
                videoAd.onClose((res) => {
                    if (res == undefined) {
                        //看完广告,给奖励
                        if (onCLoseCallback) {
                            onCLoseCallback(arg);
                        }
                    } else {
                        // 用户点击了【关闭广告】按钮
                        console.log('==> wxRewardVideoAd onClose', res);
                        if (res.isEnded) {
                            //看完广告,给奖励
                            if (onCLoseCallback) {
                                onCLoseCallback(arg);
                            }
                        } else {
                            // 没看完,不给奖励
                            console.log('广告没看完');
                            if (onFailedCallBack) {
                                console.log('回调失败');
                                onFailedCallBack(arg);
                            }
                        }
                    }
                })

                videoAd.onError(err => {
                    console.log('onError:', err.errMsg)
                    // Global.viewControllerScript.showDialogTips(Global.cdnGameConfig.rewardVideoErrorDesc);
                    if (onFailedCallBack) {
                        console.log('广告拉起失败');
                        onFailedCallBack(arg);
                    }
                })
            } catch (error) {
                console.log('WxVideoAd error', error);
            }
        }
    },

    onEnabled: function () {

    },
}

module.exports = WxVideoAd;