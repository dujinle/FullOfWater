cc.Class({
    extends: cc.Component,

    properties: {
       bottomCollider:null,
	   openTag:false,
    },
    onLoad () {
		var coms = this.node.getComponents(cc.PhysicsBoxCollider);
		for(var i = 0;i < coms.length;i++){
			var com = coms[i];
			if(com.tag == GlobalData.RigidBodyTag.bottom){
				this.bottomCollider = com;
				break;
			}
		}
	},
	onOpen(){
		this.bottomCollider.enabled = false;
	},
	onClose(){
		this.bottomCollider.enabled = true;
	},
});
