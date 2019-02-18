cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
	},

    fallWater () {
		for(var i = 0;i < 10;i++){
			var ball = cc.instantiate(GlobalData.assets['waterLizi']);
			this.node.addChild(ball);
			ball.setPosition(cc.v2(0,300));
		}
    },
	metaball(radius1, radius2, center1, center2, handleSize){
        const HALF_PI = Math.PI / 2;
        const d = center1.sub(center2).mag();
        const maxDist = radius1 + radius2 * 1.9;

        const v = (maxDist - d) / maxDist * 2.2  + 0.4
        
        let u1, u2;
        // No blob if a radius is 0
        // or if distance between the circles is larger than max-dist
        // or if circle2 is completely inside circle1
        if (radius1 === 0 || radius2 === 0 || d > maxDist || d <= Math.abs(radius1 - radius2)) {
              return null; 
        } 
        
        // Calculate u1 and u2 if the circles are overlapping
        if (d < radius1 + radius2) {
            u1 = Math.acos( (radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d) );
            u2 = Math.acos( (radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d) );
        } else {
            // Else set u1 and u2 to zero
            u1 = 0; u2 = 0; 
        }
        
        // Calculate the max spread
        let angleBetweenCenters = cc.pAngle(center1.sub(center2), cc.v2(-1, 0));
        if (center1.y > center2.y) {
            angleBetweenCenters = -angleBetweenCenters;
        }
        const maxSpread = Math.acos((radius1 - radius2) / d);
        
        // Angles for the points
        const angle1 = angleBetweenCenters + u1 + (maxSpread - u1) * v;
        const angle2 = angleBetweenCenters - u1 - (maxSpread - u1) * v;
        const angle3 = angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - maxSpread) * v;
        const angle4 = angleBetweenCenters - Math.PI + u2 + (Math.PI - u2 - maxSpread) * v;
        // Point locations
        const p1 = this.getVector(center1, angle1, radius1);
        const p2 = this.getVector(center1, angle2, radius1);
        const p3 = this.getVector(center2, angle3, radius2);
        const p4 = this.getVector(center2, angle4, radius2);
        
        // Define handle length by the distance between both ends of the curve
        const totalRadius = radius1 + radius2;
		const p1_p3 = p1.sub(p3).mag();
        const d2Base = Math.min(v * handleSize, p1_p3 / totalRadius);
        
        // Take into account when circles are overlapping
        const d2 = d2Base * Math.min(1, d * 2 / (radius1 + radius2));
        
        // Length of the handles
        const r1 = radius1 * d2;
        const r2 = radius2 * d2;
        
        // Handle locations
        const h1 = this.getVector(p1, angle1 - HALF_PI, r1);
        const h2 = this.getVector(p2, angle2 + HALF_PI, r1);
        const h3 = this.getVector(p3, angle3 + HALF_PI, r2);
        const h4 = this.getVector(p4, angle4 - HALF_PI, r2);
        
        // Generate the connector path
        
        return {
            pos1: p1,
            pos2: p2,
            pos3: p3,
            pos4: p4,
            con1: h1,
            con2: h2,
            con3: h3,
            con4: h4,
        }; 
    },
	getVector(vec, angle, radius) {
        let offX = radius * Math.cos(angle);
        let offY = radius * Math.sin(angle);

        return cc.v2(vec.x + offX, vec.y + offY);
    }
});
