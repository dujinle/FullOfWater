/*
 * file : LinkImages.js
 * brief: This file can link images on different platforms.
 */

let WxVideoAd = {
    videoAd: null,

    installVideo: function (onCLoseCallback, onFailedCallBack,arg) {
        if (typeof wx !== 'undefined') {
            try {
                let videoAd = wx.createRewardedVideoAd({
                    adUnitId: 'adunit-ca794fa3c1681554'
                })

                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => {
                        // videoAd.load()
                        //     .then(() => videoAd.show())
                    })

                videoAd.offClose();
                videoAd.onClose((res) => {
                    if (res == undefined) {
                        if (onCLoseCallback) {
                            onCLoseCallback(arg);
                        }
                    } else {
                        if (res.isEnded) {
                            if (onCLoseCallback) {
                                onCLoseCallback(arg);
                            }
                        } else {
                            if (onFailedCallBack) {
                                onFailedCallBack('cancle');
                            }
                        }
                    }
                })

                videoAd.onError(err => {
                    // Global.viewControllerScript.showDialogTips(Global.alyunGameCF.rewardVideoErrorDesc);
                    if (onFailedCallBack) {
                        onFailedCallBack('error');
                    }
                })
            } catch (error) {
				if (onFailedCallBack) {
					onFailedCallBack('error');
				}
            }
        }
    },

    onEnabled: function () {

    },
}

module.exports = WxVideoAd;