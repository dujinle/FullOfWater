cc.Class({
    extends: cc.Component,

  properties: {
		audioSources:{
			type:cc.AudioSource,
			default:[]
		},
		audio_bg: {
            default: null,
            type: cc.AudioClip
        }
    },
	play(type){
		if(GlobalData.GameInfoConfig.audioSupport == 1){
			//微信同时播放音频的数量有限 8
			if(GlobalData.GameInfoConfig.AudioPlayNum >= GlobalData.AudioManager.AudioEnginMore){
				let audio = GlobalData.AudioManager.AudioPlays.shift();
				if(audio && audio.isPlaying){
					audio.stop();
				}
				GlobalData.GameInfoConfig.AudioPlayNum -= 1;
			}
			var audio = this.audioSources[type].getComponent(cc.AudioSource);
			audio.play();
			GlobalData.AudioManager.AudioPlays.push(audio);
			GlobalData.GameInfoConfig.AudioPlayNum += 1;
		}
	},
	keepPlay(type,flag){
		if(GlobalData.GameInfoConfig.audioSupport == 1){
			var audio = this.audioSources[type].getComponent(cc.AudioSource);
			if(audio.isPlaying && flag == false){
				audio.stop();
			}else if(flag == true){
				audio.play();
				audio.loop = true;
			}
		}
	},
	playGameBg(){
		if(GlobalData.GameInfoConfig.audioSupport == 1){
			this.current = cc.audioEngine.play(this.audio_bg, true, 1);
		}
	},
	stopGameBg(){
		if(this.current != null && GlobalData.GameInfoConfig.audioSupport == 1){
			cc.audioEngine.stop(this.current);
		}
	},
	pauseGameBg(){
		if(this.current != null && GlobalData.GameInfoConfig.audioSupport == 1){
			cc.audioEngine.pauseEffect(this.current);
		}
	},
	resumeGameBg(){
		if(this.current != null && GlobalData.GameInfoConfig.audioSupport == 1){
			cc.audioEngine.resumeEffect(this.current);
		}
	}
});
