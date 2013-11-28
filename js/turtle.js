function Player (x, y, width, height, canvas) 
{
    this.x = x;
    this.y = y;
    this.xOrig = x;
    this.yOrig = y;
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.color = 'red';
    this.speed = 2;
    this.turningSpeed = 5;
    this.fabricTriangle = null;
    this.canvas = canvas;
    this.path = [['M', this.x, this.y]];
    this.fabricPath = null;
    this.length = 50;
    this.draw = function() 
    {
        this.canvas.remove(this.fabricTriangle);
        this.fabricTriangle = new fabric.Triangle({
            left: this.x,
            top: this.y,
            angle: this.angle,
            fill: this.color,
            width:this.width,
            height:this.height
        });
        this.canvas.add(this.fabricTriangle);
        
        this.canvas.remove(this.fabricPath);           
        this.fabricPath = new fabric.Path(this.path);
        this.fabricPath.set({stroke: this.color, fill:'none'});
        this.canvas.add(this.fabricPath);
    };
    this.turnRight = function() 
    {
        this.angle += this.turningSpeed;
    }
    this.turnLeft = function() 
    {
        this.angle -= this.turningSpeed;
    }
    this.move = function() 
    {                
        this.path.push(['L', this.x, this.y]);
        if (this.path.length > this.length) {
            this.path.shift();
        }                
        this.y -= this.speed*Math.sin(this.angle*Math.PI/180+Math.PI/2); 
        this.x -= this.speed*Math.cos(this.angle*Math.PI/180+Math.PI/2);
        
        this.positionInBounds();
    }
    this.positionInBounds = function()
    {
        var updated = false;
        if (this.y + this.height < 0) {
            this.y = this.canvas.height;
            updated = true;
        }
        else if (this.y > this.canvas.height) {
            this.y = -this.height;
            updated = true;
        }
        if (this.x + this.width < 0) {
            this.x = this.canvas.width;
            updated = true;
        }
        else if(this.x > this.canvas.width) {
            this.x = -this.width;
            updated = true;
        }

        if (updated) {
            this.path.push(['M', this.x, this.y]);
        }
    }
    this.reset = function() 
    {
        this.x = this.xOrig;
        this.y = this.yOrig;
        this.path = [['M', this.x, this.y]];
        this.angle = 0;
    }
}

function main() 
{
    if (keyboardState.rightDown) {
        player.turnRight();
    }
    if (keyboardState.leftDown) {
        player.turnLeft();
    }
    player.move();
    
    player.draw(canvas);
}

var canvas;
var player;
var keyboardState = new Object();
keyboardState.leftDown = false;
keyboardState.rightDown = false;
keyboardState.upDown = false;

$(document).ready(function() 
{
    canvas = new fabric.StaticCanvas('c');
    player = new Player(400,300,20,20, canvas);

    setInterval(main, 20);
});

$(document).keydown(function(event) 
{
    if (event.which == 38) {
        // move
        keyboardState.upDown = true;
    }
    else if (event.which == 39) {
        //right
        keyboardState.rightDown = true;
    }
    else if (event.which == 37) {
        //left
        keyboardState.leftDown = true;
    }
});

$(document).keyup(function(event) 
{
    if (event.which == 38) {
        // move
        keyboardState.upDown = false;
    }
    else if (event.which == 39) {
        //right
        keyboardState.rightDown = false;
    }
    else if (event.which == 37) {
        //left
        keyboardState.leftDown = false;
    }
});

$(function() {
    $("#reset").click(function() 
    {
        player.reset();            
    });
});