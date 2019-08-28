
cc.Class({
    extends: cc.Component,

    properties: {
		finishGameRank:cc.Node,
		rankGmameView:cc.Node,
		aboveGameView:cc.Node,
		battleGameView:cc.Node,
    },
	onLoad(){
		this.setViewVisiable(null);
	},
    start () {
        wx.onMessage(data => {
			this.setViewVisiable(null);
            switch (data.type) {
                case 'gameOverUIRank':
					wx.getFriendCloudStorage({
						keyList: ['maxScore','maxLevel'], // 你要获取的、托管在微信后台都key
						success: res => {
							//console.log(res.data);
							//排序
							this.setViewVisiable(data.type);
							var rankList = this.sortRank(res.data);
							this.drawRankOverList(rankList,data);
						}
					});
					
                    break;
                case 'rankUIFriendRank':
					wx.getFriendCloudStorage({
						keyList: ['maxScore','maxLevel'], // 你要获取的、托管在微信后台都key
						success: res => {
							//console.log(res.data);
							//排序
							this.setViewVisiable(data.type);
							var rankList = this.sortRank(res.data);
							this.drawRankFrientList(rankList,data);
						}
					});
                    break;
				case 'rankUIGroupRank':
					wx.getGroupCloudStorage({
						shareTicket: data.shareTicket,
						keyList: ['maxScore','maxLevel'], // 你要获取的、托管在微信后台都key
						success: res => {
							//console.log(res.data);
							//排序
							this.setViewVisiable(data.type);
							var rankList = this.sortRank(res.data);
							this.drawRankFrientList(rankList,data);
						}
					});
                    break;
				case 'initFriendRank':
					this.setViewVisiable(data.type);
					this.initRankFriendCloudStorage(data);
					break;
				case 'battleUIRank':
					this.setViewVisiable(data.type);
					this.drawRankList(this.rankList,data);
                    break;
				case 'battleGameView':
					wx.getFriendCloudStorage({
						keyList: ['maxScore','maxLevel'], // 你要获取的、托管在微信后台都key
						success: res => {
							//console.log(res.data);
							//排序
							this.setViewVisiable(data.type);
							this.drawRankFrientList(res.data,data);
						}
					});
                    break;
            }
        });
    },
	initRankFriendCloudStorage(data){
		this.rankList = null;
		this.battleInit = false;
		this.myRankData = null;
		wx.getFriendCloudStorage({
			keyList: ['maxScore','maxLevel'], // 你要获取的、托管在微信后台都key
			success: res => {
				//console.log(res.data);
				var dataList = res.data;
				wx.getUserInfo({
					openIdList: ['selfOpenId'],
					lang: 'zh_CN',
					success: (res) => {
						console.log('getUserInfo success', res.data);
						for(var i = 0;i < dataList.length;i++){
							var item = dataList[i];
							item.rank = i + 1;
							item.my = false;
							if(item.nickname == res.data[0].nickName){
								item.my = true;
								this.myRankData = item;
							}
						}
						this.rankList = this.sortRank(dataList);
						this.battleInit = true;
						var data = {type:'battleUIRank',score:0};
						this.setViewVisiable(data.type);
						this.drawRankList(this.rankList,data);
					},
					fail: (res) => {
						//console.log('getUserInfo reject', res.data)
						reject(res)
						//data.name = '我';
						//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
						//this.drawSelfRank(data.KVDataList);
					}
				})
			}
		});
	},
	setViewVisiable(type){
		this.finishGameRank.active = false;
		this.rankGmameView.active = false;
		this.aboveGameView.active = false;
		this.battleGameView.active = false;
		if(type == 'battleUIRank'){
			this.aboveGameView.active = true;
		}else if(type == 'rankUIGroupRank'){
			this.rankGmameView.active = true;
		}else if(type == 'rankUIFriendRank'){
			this.rankGmameView.active = true;
		}else if(type == 'gameOverUIRank'){
			this.finishGameRank.active = true;
		}else if(type == 'battleGameView'){
			this.battleGameView.active = true;
		}
	},
	drawRankOverList(dataList,data){
		wx.getUserInfo({
			openIdList: ['selfOpenId'],
			lang: 'zh_CN',
			success: (res) => {
				console.log('getUserInfo success', res.data);
				var preData = null;
				var drawList = [];
				var findSelf = false;
				for(var i = 0;i < dataList.length;i++){
					var item = dataList[i];
					item.rank = i + 1;
					item.my = false;
					if(item.nickname == res.data[0].nickName){
						item.my = true;
						if(preData != null){
							drawList.push(preData);
						}
						drawList.push(item);
						findSelf = true;
						continue;
					}
					if(findSelf == true){
						if(drawList.length <= 2){
							drawList.push(item);
						}
					}
					//找到三个 如果有了就结束循环
					if(drawList.length >= 3){
						break;
					}
					preData = item;
				}
				this.drawRankList(drawList,data);
			},
			fail: (res) => {
				//console.log('getUserInfo reject', res.data)
				reject(res)
				//data.name = '我';
				//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
				//this.drawSelfRank(data.KVDataList);
			}
		})
		
	},
	drawRankFrientList(rankList,data){
		wx.getUserInfo({
			openIdList: ['selfOpenId'],
			lang: 'zh_CN',
			success: (res) => {
				console.log('getUserInfo success', res.data);
				for(var i = 0;i < rankList.length;i++){
					var item = rankList[i];
					item.rank = i + 1;
					item.my = false;
					if(item.nickname == res.data[0].nickName){
						item.my = true;
					}
				}
				this.drawRankList(rankList,data);
			},
			fail: (res) => {
				//console.log('getUserInfo reject', res.data)
				reject(res)
				//data.name = '我';
				//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
				//this.drawSelfRank(data.KVDataList);
			}
		})
	},
	drawRankList(drawList,data){
		console.log('drawRankList',drawList,data);
		if(data.type == "gameOverUIRank"){
			this.finishGameRank.getComponent("FinishGameRank").loadRank(drawList);
		}else if(data.type == "rankUIFriendRank" || data.type == "rankUIGroupRank"){
			this.rankGmameView.getComponent("RankGameView").loadRank(drawList);
		}else if(data.type == 'battleUIRank'){
			if(this.battleInit == true){
				this.aboveGameView.getComponent("AboveGameView").loadRank(drawList,this.myRankData,data.score);
			}
		}else if(data.type == 'battleGameView'){
			var param = JSON.stringify(drawList);
			let openContext = wx.getSharedCanvas().getContext('2d');
			openContext['canvas']['userdata'] = param;
		}
	},
	sortRank(data){
		return data.sort(this.sortFunction);
	},
	sortFunction(a,b){
		var amaxScore = 0;
		var bmaxScore = 0;
		for(var i = 0;i < a.KVDataList.length;i++){
			var aitem = a.KVDataList[i];
			//console.log(aitem);
			if(aitem.key == "maxLevel"){
				amaxScore = parseInt(aitem.value);
			}
		}
		for(var i = 0;i < b.KVDataList.length;i++){
			var bitem = b.KVDataList[i];
			//console.log(bitem);
			if(bitem.key == "maxLevel"){
				bmaxScore = parseInt(bitem.value);
			}
		}
		return  bmaxScore - amaxScore;
	}
});
