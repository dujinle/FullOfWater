cc.Class({
    extends: cc.Component,

    properties: {
		commonItem:cc.Node,
		viewScroll:cc.Node,
    },
	loadRank(data){
		//console.log(data);
		this.viewScroll.getComponent("ScrollView").setInitData(data);
		for(var i = 0;i < data.length;i++){
			var dd = data[i];
			if(dd.my == true){
				this.commonItem.getComponent("RankItem").loadRank(dd);
				break;
			}
		}
	},
});
