





/*
	Class for creating animations for entities.

	Let's say you have an entity and you want to move their
	arm by some angle. You can do this by using animation objects.

	Here, numPhases represents the number of phases in the animation.
	Let's say the animation has 3 phases, when phase 1 completes,
	move onto phase 2, when phase 2 completes move onto phase 3.

	You also have the option to repeat the animation.

	To use this class, construct it and then run 
	getOutput() to get the angle or whatever.

*/
class Animation {
	constructor(startValue = 0, repeats = true){
		this.startValue = startValue;
		this.outValue = startValue;
		this.repeats = repeats;

		this.numPhases = 0;
		this.currentPhase = -1;

		this.breakTime = 0;

		this.animFuncs = [];
		this.stopConds = [];
	}

	addBreak(numFrames){
		this.numPhases++;

		

		this.animFuncs.push(null);
		this.stopConds.push(null);
	}


	addPhase(animFunc, stopCond){
		this.numPhases++;

		this.animFuncs.push(animFunc);
		this.stopConds.push(stopCond);
	}

	// Also used to restart.
	startAnimation(){
		this.currentPhase = 0;
		this.outValue = this.startValue;
	}

	/*
		Should just reset the thing to the
		starting value, you can also
		do this manually by using a phase if you
		want more control.
	*/
	returnToStart(){

	}


	// Updates the output value.
	continueAnimation(){
		if(this.currentPhase == -1) return;
		let cp = this.currentPhase;
		// Run animation
		this.outValue = this.animFuncs[cp](this.outValue);
		// Check stopping condition
		if(this.stopConds[cp](this.outValue)){
			//Either stop or move onto the next phase.
			if(this.currentPhase == this.numPhases - 1){
				//Stop or repeat
				if(this.repeats){
					this.startAnimation();
					return;
				}else{
					this.currentPhase = -1;
					return;
				}
			}else{
				//move to the next phase.
				this.currentPhase++;
			}
		}
	}

	getOutput(){
		let out = this.outValue;
		this.continueAnimation();
		return out;
	}

}