class Fish {
	constructor(position, velocity, sm, acceleration, maxForce, maxSpeed, from, to) {
		this.position = position
		this.velocity = velocity//p5.Vector.random2D();
        this.sm = sm
        this.velocity.setMag(sm)//(random(2, 4));
        this.acceleration = acceleration//createVector();
        this.maxForce = maxForce//0.2;
        this.maxSpeed = maxSpeed//5;
		this.from = from
		this.to = to
        this.isCaught = false
	}
	
	edges(attractor) {
		let force = p5.Vector.sub(attractor, this.position)
		force.setMag(this.maxSpeed)
		force.sub(this.velocity)
		force.limit(this.maxForce)
		force.mult(3)
		
    if (this.position.x + 90 > width) {
      //this.position.x = 0;
			this.acceleration.add(force);
    } else if (this.position.x - 90 < 0) {
      //this.position.x = width;
			this.acceleration.add(force);
    }
    if (this.position.y + 90> height) {
      //this.position.y = 0;
			this.acceleration.add(force);
    } else if (this.position.y -90 < 0) {
      //this.position.y = height;
			this.acceleration.add(force);
    }
  }

  align(boids) {
    let perceptionRadius = 40//25;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 70//24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 70;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }
	inArea() {
		return (this.position.x+90<width && this.position.x-90>0 && this.position.y+90<height && this.position.y-90>0)
	}

	separateCenter(attractor) {
    let force = p5.Vector.sub(attractor.position, this.position)
    let distance = force.mag()
    if (distance < 130 && this.inArea() ) {
			//if (random()<0.7) {
				this.maxSpeed = 15;
				force.setMag(-15)
				//return force
			//} else {
				//this.maxSpeed = 5;
				//force.mult(0)
				//return force
			//}
    } 
		else {
			this.maxSpeed = 5;
      force.mult(0)
    }
    return force
  }
	
  flock(boids, attractor) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);
		let runForce = this.separateCenter(attractor)
		
		alignment.mult(alignSlider);
    cohesion.mult(cohesionSlider);
    separation.mult(separationSlider);

    // alignment.mult(alignSlider.value());
    // cohesion.mult(cohesionSlider.value());
    // separation.mult(separationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
		this.acceleration.add(runForce);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }
	
	show() {
		const from = this.from
		const to = this.to
		let theta = this.velocity.heading() //+ radians(90);
		push()
			translate(this.position.x, this.position.y)
			rotate(theta)
			// push()
			// //translate(-2,0)
			// //rotate(map(sin(frameCount/20), -1,1, radians(-30), radians(30)) )
			// for(let i=0; i>-50; i-=2) {
			// 	let y = sin(frameCount/10+i/8) * 4
			// 	let sw = map(sin(frameCount/15 + i/10), -1, 1, 2, 8)
			// 	let ratio = map(sin(i/10), -1, 1, 1,0)
			// 	//let sw = map(ratio, 1,0, 10,3)
			// 	//let sw = map(sin(i/20), -1,1,20,3)
			// 	let clr = lerpColor(to, from, (i*-1)/50)
			// 	stroke(clr)
			// 	strokeWeight(sw)
			// 	point(i,y)
			// }
			// pop()
	
			// push()
			// rotate(radians(-15))
			// for(let i=0; i>-20; i-=2) {
			// 	let y = sin(frameCount/10+i/8) * 4
			// 	let sw = map(sin(frameCount/15 + i/10), -1, 1, 2, 8)
			// 	let clr = lerpColor(to, from, (i*-1)/20)
			// 	stroke(clr)
			// 	strokeWeight(sw)
			// 	point(i,y)
			// }
			// pop()
	

      
	
			push()
			for(let i=0; i<20; i+=2) {
				let x = i
				let sw = (map(sin(i/8), -1, 1, 0,1)+0.01) * 20
				let y = sin(frameCount/10+i/20) * 3
				let clr = lerpColor(from, to, i/20)
				stroke(clr)
				strokeWeight(sw)
				point(x, y)
        strokeWeight(map(sin(frameCount/15 + i/10), -1, 1, 2, 8))
        point(x*-1,y)
			}
			pop()
		pop()
	}
}