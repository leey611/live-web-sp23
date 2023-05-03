class Net {
	constructor(position, clr, id) {
		this.position = position
		this.r = 80
        this.clr = clr
        this.id = id
	}
	update(vec) {
		this.position = vec
	}
	show() {
		let towardCenter = createVector(width/2-this.position.x, height/2-this.position.y)
		//stroke("red")
		//line(this.position.x, this.position.y, width/2, height/2)
		push()
		translate(this.position.x, this.position.y)
		
		
		//rotate(frameCount/20)
		rotate(towardCenter.heading()+radians(90))
		noFill()
		stroke(this.clr)
		strokeWeight(5)
		circle(0,0,this.r)
			push()
			translate(0, this.r/2)
			line(0,40,0,0)
			pop()
		// line(0, this.r/2-40,
		// 		 0, this.r/2)
		
		// line(0, this.r/2,
		// 		 0, this.r/2+40)
		//line(this.position.x, this.position.y+40)
		pop()
	}
}