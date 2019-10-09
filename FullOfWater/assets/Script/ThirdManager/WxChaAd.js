// banner广告接入
var util = require('util');
let WxChaAd = {
    chaAd: null,

    createChaAd: function (cb) {
        if (typeof wx !== 'undefined') {
            var sysInfo = wx.getSystemInfoSync();
            console.log('sysinfo: ', sysInfo);
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '' && sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 204) {
                console.log('chaAd:', this.chaAd);
				try {
					this.chaAd = wx.createInterstitialAd({ adUnitId: 'adunit-195b106265503d8a' });
                    if (this.chaAd) {
                        var self = this;
                        this.chaAd.show().catch((err) => {
								console.error(err);
								cb('error');
							});

						this.chaAd.onError(err => {
								console.log("错误监听：", err)
								cb('error');
							});
						this.chaAd.onLoad(() => {
								console.log('插屏 广告加载成功')
								cb('ok');
							});
						this.chaAd.onClose(res => {
								console.log('插屏 广告关闭')
								cb('close');
							});
					} else {
						console.log('cha广告没有创建成功！');
						cb('error');
					}
				}catch (error) {
					console.log(error);
					cb('error');
				}
			}else {
				console.log('SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API');
				cb('error');
			}
		}
    }
}

module.exports = WxChaAd;