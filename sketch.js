//this is a simple sketch of fish swimming made in p5.js.

function random(min, max) {
    return Math.random() * (max - min) + min;
}

let width = 1500;
let height = 1000;
let initialFishAmount = 50;
let fishes;


//-------------------------------------------SETUP--------------------------------------------------

function setup() {
    angleMode(DEGREES);
    createCanvas(width, height);
    fishes = new Fishes(initialFishAmount);
}

//-------------------------------------------DRAW--------------------------------------------------
function draw() {
    background(20, 100, 200);
    fishes.draw();
    fishes.move();
    fishes.moveToStart();
    
}


//----------------------------------------KlASSER--------------------------------------------
class Fish {

    constructor(xpos, ypos, size, direction) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.size = size;
        this.direction = direction;
        this.speed = 2;
    }

    draw() {

        fill("orange");
        //push/pop bruges til at tegne hver fisk baseret på deres rotation i stedet for at rotere hele canvaset.
        push();
        translate(this.xpos, this.ypos);
        rotate(this.direction);
        triangle(0, 0, -this.size, -this.size/2, -this.size, this.size/2);
        pop();
    }

    move() {
      //flytter fiskene fremad baseret på deres retning of hastighed
        this.xpos += cos(this.direction) * this.speed;
        this.ypos += sin(this.direction) * this.speed;
    }

    

} 

class Fishes {
    

    fishArray = [];

    constructor(amount) {
        for (let i = 0; i < amount; i++) {
            let xpos = random(0, width);
            let ypos = random(0, height);
            let size = 10;
            let direction = random(0, 360);
            this.fishArray.push(new Fish(xpos, ypos, size, direction));
        }
    }

    draw() {        
        for (let i = 0; i < this.fishArray.length; i++) {
            this.fishArray[i].draw();
        }
    }

    move() {
        for (let i = 0; i < this.fishArray.length; i++) {
            this.fishArray[i].move();
        }
    }

    //move fish to the opposite side of the canvas when they go off the edge
    moveToStart() {
        for (let i = 0; i < this.fishArray.length; i++) {
            if (this.fishArray[i].xpos > width + this.fishArray[i].size) {
                this.fishArray[i].xpos = 0 - this.fishArray[i].size;
            }
            if (this.fishArray[i].xpos < 0 - this.fishArray[i].size) {
                this.fishArray[i].xpos = width + this.fishArray[i].size;
            }
            if (this.fishArray[i].ypos > height + this.fishArray[i].size) {
                this.fishArray[i].ypos = 0 - this.fishArray[i].size;
            }
            if (this.fishArray[i].ypos < 0 - this.fishArray[i].size) {
                this.fishArray[i].ypos = height + this.fishArray[i].size;
            }
        }
    }

}