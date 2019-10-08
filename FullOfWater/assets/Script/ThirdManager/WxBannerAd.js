// banner广告接入
var util = require('util');
let WxBannerAd = {
    bannerAd: null,
	isCreateSuccess: false,

    createBannerAd: function () {
        if (typeof wx !== 'undefined') {
            var sysInfo = wx.getSystemInfoSync();
            console.log('sysinfo: ', sysInfo);
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '' && sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 204) {
                console.log('bannerAd:', this.bannerAd);
                if (this.isCreateSuccess && !GlobalData.cdnGameConfig.refreshBanner) {
                    console.log('不刷新banner广告');
                    this.showBannerAd();
                    return;
                }
                //销毁banner广告
                this.destroyBannerAd();
                try {
                    this.bannerAd = wx.createBannerAd({
                        adUnitId: 'adunit-668b4f59f6f0c6c9',
                        style: {
                            left: 0,
                            top: 0,
                            width: 200
                        }
                    });
                    console.log('创建bannerAd成功！', this.bannerAd);

                    if (this.bannerAd) {
                        var self = this;
                        this.bannerAd.show()
                            .then(() => {
                                self.isCreateSuccess = true;
                                console.log('banner 广告显示')
                            });

						this.bannerAd.onError(err => {
							console.log("错误监听：", err)
						});

						this.bannerAd.onResize(res => {
							console.log("banner onResize res:", res.width, res.height)
							console.log("banner onResize style real:", this.bannerAd.style.realWidth, this.bannerAd.style.realHeight)
							if (self.bannerAd && self.bannerAd.style) {
								// 适配iphoneX
								var fitOffsetY = GlobalData.phoneModel == 'Normal' ? 0:0.01;
								console.log('fitOffsetY:', fitOffsetY);
								var buttomHeight = fitOffsetY;
								if (GlobalData.phoneModel != 'Normal') {
									console.log('isIphoneX或者是全面屏！');
									buttomHeight *= 40;
								}
								console.log("banner onResize res:", res.width, res.height)
								self.bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;
								self.bannerAd.style.top = sysInfo.screenHeight - res.height - Math.abs(buttomHeight); // sysInfo.screenHeight - Math.abs(buttomHeight);
							}
						});
					} else {
						console.log('广告没有创建成功！');
					}
				}catch (error) {
					console.log(error);
				}
			}else {
				console.log('SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API');
			}
		}
    },

    hideBannerAd: function () {
        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    },

    showBannerAd: function () {
        if (this.bannerAd) {
            this.bannerAd.show();
        }
    },

    //销毁广告
    destroyBannerAd: function () {
        if (this.bannerAd) {
			this.hideBannerAd();
            if (!GlobalData.cdnGameConfig.refreshBanner) {
                return;
            }
            try {
                this.bannerAd.destroy();
                this.bannerAd = null;
            } catch (error) {
                this.bannerAd = null;
            }
        }
    },

    //强制删除
    forceDestroyBannerAd: function () {
        if (this.bannerAd && GlobalData.cdnGameConfig.refreshBanner) {
            try {
                this.bannerAd.destroy();
                this.bannerAd = null;
            } catch (error) {
                this.bannerAd = null;
            }
        }
    },
}

module.exports = WxBannerAd;