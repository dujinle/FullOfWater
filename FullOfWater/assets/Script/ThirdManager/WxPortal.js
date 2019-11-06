// portal推荐位接入
var util = require('util');
let WxPortal = {
    portalAd:null,
	iconAd:null,
	bannerAd:null,
	isSuccess:[0,0,0,0],
    createAd: function (type,cb) {
        if (typeof wx !== 'undefined') {
            var sysInfo = wx.getSystemInfoSync();
            console.log('sysinfo: ', sysInfo);
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '' && sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 275) {
				var version = sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "");
				if (!GlobalData.cdnGameConfig.refreshBanner && this.isSuccess[type] == 1) {
                    console.log('不刷新推荐位');
                    this.showBannerAd(type);
                    return;
                }
                //销毁banner广告
                this.destroyBannerAd(type);
				try {
					if(type == 2){
						// 创建banner推荐位实例，提前初始化
						if (wx.createGameBanner) {
							this.bannerAd = wx.createGameBanner({
								adUnitId: 'PBgAAcR_sgTxCS1w',
								style:{
									left:0,
									top: sysInfo.windowHeight
								}
							})
						}
						// 在适合的场景显示推荐位
						// err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
						if (this.bannerAd) {
							this.isSuccess[type] = 1;
							this.bannerAd.show().catch((err) => {
								console.error(err)
								cb('error');
							})
						}
					}
					else if(type == 1){
						// 定义icon推荐位
						// 创建推荐位实例，提前初始化
						console.log('iconAd creat check',version);
						//这里做一下判断吧 因为 需要版本超过2.8.2
						if (version >= 282 && wx.createGameIcon) {
							console.log('iconAd creat start');
							this.iconAd = wx.createGameIcon({
								adUnitId: 'PBgAAcR_sgT_xJ48',
								count:3,
								style:[
									{
										appNameHidden:0,
										color: "#ffffff",
										borderWidth:2,
										borderColor: "#ffea00",
										size: 30,
										top: 0.3 * sysInfo.windowHeight,
										left: 0.01 * sysInfo.windowWidth
									}, {
										appNameHidden: 0,
										color: "#ffffff",
										borderWidth: 2,
										borderColor: "#ffea00",
										size: 30,
										top: 0.2 * sysInfo.windowHeight,
										left: 0.01 * sysInfo.windowWidth
									}, {
										appNameHidden: 0,
										color: "#ffffff",
										borderWidth: 2,
										borderColor: "#ffea00",
										size: 30,
										top: 0.1 * sysInfo.windowHeight,
										left: 0.01 * sysInfo.windowWidth
									}
								]
							})
						}

						// 在合适的场景显示推荐位
						// err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
						if (this.iconAd) {
							console.log('iconAd creat success');
							this.isSuccess[type] = 1;
							this.iconAd.load().then(() => {
								console.log('iconAd load success');
								this.iconAd.show()
							}).catch((err) => {
								console.log(err)
								cb('error');
							})
						}
					}
					else if(type == 3){
						// 定义浮层推荐位
						// 创建推荐位实例，提前初始化
						if (wx.createGamePortal) {
							this.portalAd = wx.createGamePortal({
							adUnitId: 'PBgAAcR_sgT2qgW8'
						  })
						}

						// 在适合的场景显示推荐位
						// err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
						if (this.portalAd) {
							this.isSuccess[type] = 1;
							this.portalAd.load().then(() => {
								this.portalAd.show()
							}).catch((err) => {
								console.error(err)
								cb('error');
							})
							this.portalAd.onClose(res => {
								console.log('插屏 广告关闭')
								this.portalAd = null;
								this.isSuccess[type] = 0;
								cb('close');
							});
						}
					}
				}catch (error) {
					console.log(error);
					cb('error');
				}
			}
			else {
				console.log('SDKVersion 判断基础库版本号 >= 2.7.5 后再使用该 API');
				cb('error');
			}
		}
    },
	hideAd(type){
		if(type == 1){
			if(this.iconAd != null){
				this.iconAd.hide();
			}
		}
		if(type == 2){
			if(this.bannerAd != null){
				this.bannerAd.hide();
			}
		}
		if(type == 3){
			if(this.portalAd != null){
				this.portalAd.hide();
			}
		}
	},
	showBannerAd: function (type) {
		if(type == 1){
			if(this.iconAd != null){
				this.iconAd.show();
			}
		}
		if(type == 2){
			if(this.bannerAd != null){
				this.bannerAd.show();
			}
		}
		if(type == 3){
			if(this.portalAd != null){
				this.portalAd.show();
			}
		}
    },
	destroyBannerAd(type){
		if(type == 1){
			if (this.iconAd) {
				console.log('destroyBannerAd',type);
				this.iconAd.hide();
				if (!GlobalData.cdnGameConfig.refreshBanner) {
					return;
				}
				try {
					this.iconAd.destroy();
					this.iconAd = null;
				} catch (error) {
					this.iconAd = null;
				}
			}
		}
		else if(type == 2){
			if (this.bannerAd) {
				console.log('destroyBannerAd',type);
				this.bannerAd.hide();
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
		}
		else if(type == 3){
			if (this.portalAd) {
				console.log('destroyBannerAd',type);
				this.portalAd.hide();
				if (!GlobalData.cdnGameConfig.refreshBanner) {
					return;
				}
				try {
					this.portalAd.destroy();
					this.portalAd = null;
				} catch (error) {
					this.portalAd = null;
				}
			}
		}
	}
}

module.exports = WxPortal;