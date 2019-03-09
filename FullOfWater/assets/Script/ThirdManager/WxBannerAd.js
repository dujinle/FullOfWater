// banner广告接入
var util = require('util');
let WxBannerAd = {
    bannerAd: null,

    createBannerAd: function (yRate) {
        console.log('call initBannerAd',yRate);
        if (typeof wx !== 'undefined') {
			const version = wx.getSystemInfoSync().SDKVersion;
			if(!util.compareVersion(version,'2.0.4')){
				console.log("版本太低不支持广告投放");
				return null;
			}
            console.log('bannerAd:', this.bannerAd);
            if (this.bannerAd && !GlobalData.cdnGameConfig.refreshBanner) {
                console.log('不刷新banner广告');
                this.showBannerAd();
                return;
            }
			this.destroyBannerAd();
			var screenHeight = wx.getSystemInfoSync().screenHeight;
			var screenWidth = wx.getSystemInfoSync().screenWidth;
			console.log(screenWidth,screenHeight);
			try {
				this.bannerAd = wx.createBannerAd({
					adUnitId: 'adunit-62602751a81e11fd',
					style: {
						left: 0,
						top: 0,
						width: screenWidth
					}
				});
				this.bannerAd.onError(res =>{
					if(res.errCode == 1004){
						this.hideBannerAd();
					}
					console.log(res);
				});
				if (this.bannerAd) {
					this.bannerAd.show();

					this.bannerAd.onResize(res => {
						if (this.bannerAd && this.bannerAd.style) {
							console.log("res:", res.width, res.height)
							if (this.bannerAd && this.bannerAd.style) {
								console.log("real:", this.bannerAd.style.realWidth, this.bannerAd.style.realHeight)
							}

							// 适配iphoneX
							if (this.bannerAd && this.bannerAd.style) {
								//var buttomHeight = sysInfo.screenHeight / 2 - (sysInfo.screenHeight * Math.abs(GlobalData.footPosY) / 568 / 2 - GlobalData.footPosY) / 2;
								if(screenHeight * yRate <= this.bannerAd.style.realHeight){
									this.bannerAd.style.width *= ((screenHeight * yRate) /this.bannerAd.style.realHeight);
								}
								//this.bannerAd.style.width = 300;
								var buttomHeight = this.bannerAd.style.realHeight;
								if (util.isIphoneX()) {
									console.log('isIphoneX');
									buttomHeight -= 6;
								}
								
								console.log('buttomHeight', GlobalData.cdnGameConfig.footPosY, buttomHeight);
								this.bannerAd.style.left = (screenWidth - res.width) / 2;
								this.bannerAd.style.top = screenHeight - Math.abs(buttomHeight);
							}
						}
					})
				}
			} catch (error) {
				console.log(error);
			}
        }
    },

    hideBannerAd: function () {
        console.log('call hideBannerAd');

        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    },

    showBannerAd: function () {
        console.log('call showBannerAd');

        if (this.bannerAd) {
            this.bannerAd.show();
        }
    },

    //销毁广告
    destroyBannerAd: function () {
        console.log('call destroyBannerAd');
        if (this.bannerAd) {
            if (!GlobalData.cdnGameConfig.refreshBanner) {
                console.log('不销毁banner广告，只隐藏');
                this.hideBannerAd();
                return;
            }
            console.log('删除bannerad');
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
        console.log('call forceDestroyBannerAd');
        if (this.bannerAd) {
            console.log('删除bannerad');
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