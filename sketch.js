
function random(min, max) {
    return Math.random() * (max - min) + min;
}

let width = 1500;
let height = 1000;
let initialFishAmount = 50;
let fishes;


//-------------------------------------------SETUP--------------------------------------------------

function setup() {
    createCanvas(width, height);
    fishes = new Fishes(initialFishAmount);
}

//-------------------------------------------DRAW--------------------------------------------------
function draw() {
    background(20, 100, 200);
    fishes.move();
    fishes.moveToStart();
    fishes.draw();
}


//----------------------------------------KlASSER--------------------------------------------
class Fish {

    constructor(xpos, ypos, size) {
        this.position = createVector(xpos, ypos);
        this.size = size;
        
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.acceleration = createVector(0, 0);
        this.direction = this.velocity.heading();

        this.maxSpeed = 4;
        this.maxSteeringForce = 0.5;

        //creating allignment force
        this.allignmentForce = createVector(0, 0);
    }

    draw() {
        /*
        fill("orange");
        //push/pop bruges til at tegne hver fisk baseret på deres rotation i stedet for at rotere hele canvaset.
        push();
        translate(this.xpos, this.ypos);
        rotate(this.direction);
        triangle(0, 0, -this.size, -this.size/2, -this.size, this.size/2);
        pop();*/
       
    
    //tyvstjålet fra https://p5js.org/examples/classes-and-objects-flocking/ 
    //tegner trekanter baseret på deres position og retning, så de ser ud som om de svømmer i den retning de peger.
    let theta = this.velocity.heading() + radians(90);
    fill("orange");
    stroke(255);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.size * 2);
    vertex(-this.size, this.size * 2);
    vertex(this.size, this.size * 2);
    endShape(CLOSE);
    pop();
    }


    move() {
      //flytter fiskene fremad baseret på deres retning of hastighed
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    school(boids) { 
        let allignment = this.allign(boids);
        allignment.mult(1.0); //justerer styrken af allignment kraften
        this.acceleration.add(allignment);
    }

    //For hver fisk tæt på, berægner vi den gennemsnitlige hastighed af de andre fisk og justerer vores hastighed for at matche den gennemsnitlige hastighed.
    allign(boids) {
        let distanceThreshold = 50;
        let totalForce = createVector();
        let count = 0;

        //for hver boid i arrayet, hvis den er inden for distanceThreshold, tilføj dens hastighed til total og øg count.
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.position, boids[i].position);
            if (d > 0 && d < distanceThreshold) {
                totalForce.add(boids[i].velocity);
                count++;
            }
        }
        //Hvis der er nogen boids inden for distanceThreshold, beregn den gennemsnitlige hastighed og juster denne fisks
        //  hastighed for at matche den.
        if (count > 0) {
            totalForce.div(count);
            totalForce.setMag(this.maxSpeed);
            let steering = p5.Vector.sub(totalForce, this.velocity);
            steering.limit(this.maxSteeringForce);
            return steering;
        } else {
            return createVector(0, 0);
        }
    }



} 

class Fishes {
    

    fishArray = [];

    constructor(amount) {
        for (let i = 0; i < amount; i++) {
            let xpos = random(0, width);
            let ypos = random(0, height);
            let size = 3;
            this.fishArray.push(new Fish(xpos, ypos, size));
        }
    }

    draw() {        
        for (let i = 0; i < this.fishArray.length; i++) {
            this.fishArray[i].draw();
        }
    }

    move() {
        for (let i = 0; i < this.fishArray.length; i++) {
            this.fishArray[i].school(this.fishArray);
            this.fishArray[i].move();
        }
    }

    //move fish to the opposite side of the canvas when they go off the edge
    moveToStart() {
        for (let i = 0; i < this.fishArray.length; i++) {
            if (this.fishArray[i].position.x > width + this.fishArray[i].size) {
                this.fishArray[i].position.x = 0 - this.fishArray[i].size;
            }
            if (this.fishArray[i].position.x < 0 - this.fishArray[i].size) {
                this.fishArray[i].position.x = width + this.fishArray[i].size;
            }
            if (this.fishArray[i].position.y > height + this.fishArray[i].size) {
                this.fishArray[i].position.y = 0 - this.fishArray[i].size;
            }
            if (this.fishArray[i].position.y < 0 - this.fishArray[i].size) {
                this.fishArray[i].position.y = height + this.fishArray[i].size;
            }
        }
    }

}