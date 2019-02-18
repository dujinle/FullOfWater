var EventManager = {
	eventType:{
		GameEvent:'game-event',
		CupEvent:'cup-event'
	},
	on:function(func,pthis){
		cc.director.on(this.eventType.GameEvent,func,pthis);
	},
	off:function(func,pthis){
		cc.director.off(this.eventType.GameEvent,func,pthis);
	},
	emit:function(data){
		cc.director.emit(this.eventType.GameEvent,data);
	},
	onCup:function(func,pthis){
		cc.director.on(this.eventType.CupEvent,func,pthis);
	},
	offCup:function(func,pthis){
		cc.director.off(this.eventType.CupEvent,func,pthis);
	},
	emitCup:function(data){
		cc.director.emit(this.eventType.CupEvent,data);
	}
};
module.exports = EventManager;