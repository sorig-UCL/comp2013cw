function Rect (x, y, width, height) 
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

function Player (rect, canvasRect) 
{
    this.frame = rect
    this.origFrame = rect;
    this.canvasBounds = canvasRect;
    this.angle = 0;
    this.color = 'red';
    this.speed = 2;
    this.turningSpeed = 5;
    this.fabricTriangle = null;
    this.path = [['M', this.x, this.y]];
    this.fabricPath = null;
    this.length = 50;
    this.draw = function(canvas) 
    {
        canvas.remove(this.fabricTriangle);
        this.fabricTriangle = new fabric.Triangle({
            left: this.frame.x,
            top: this.frame.y,
            angle: this.angle,
            fill: this.color,
            width:this.frame.width,
            height:this.frame.height
        });
        canvas.add(this.fabricTriangle);
        
        canvas.remove(this.fabricPath);           
        this.fabricPath = new fabric.Path(this.path);
        this.fabricPath.set({stroke: this.color, fill:'none'});
        canvas.add(this.fabricPath);
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
        this.path.push(['L', this.frame.x, this.frame.y]);
        if (this.path.length > this.length) {
            this.path.shift();
        }                
        this.frame.y -= this.speed*Math.sin(this.angle*Math.PI/180+Math.PI/2); 
        this.frame.x -= this.speed*Math.cos(this.angle*Math.PI/180+Math.PI/2);

        this.positionWithinBounds();
    }
    this.makeLonger = function() 
    {
        this.length += 20;
    }
    this.positionWithinBounds = function()
    {
        var updated = false;
        if (this.frame.y + this.frame.height < 0) {
            this.frame.y = this.canvasBounds.height;
            updated = true;
        }
        else if (this.frame.y > this.canvasBounds.height) {
            this.frame.y = -this.frame.height;
            updated = true;
        }
        if (this.frame.x + this.frame.width < 0) {
            this.frame.x = this.canvasBounds.width;
            updated = true;
        }
        else if(this.frame.x > this.canvasBounds.width) {
            this.frame.x = -this.frame.width;
            updated = true;
        }

        if (updated) {
            this.path.push(['M', this.frame.x, this.frame.y]);
        }
    }
    this.hitTest = function(rect) 
    {
        if (this.frame.x + this.frame.width >= rect.x 
            && this.frame.x <= rect.x+rect.width
            && this.frame.y + this.frame.height >= rect.y
            && this.frame.y <= rect.y+rect.height) {
            return true;
        }
        return false;
    }
    this.reset = function() 
    {
        this.frame.x = this.origFrame.x;
        this.frame.y = this.origFrame.y;
        this.path = [['M', this.frame.x, this.frame.y]];
        this.angle = 0;
    }
}

function Square (frame, canvasBounds) 
{
    this.frame = frame;
    this.canvasBounds = canvasBounds
    this.color = 'black';
    this.fabricSquare

    this.draw = function (canvas) 
    {
        canvas.remove(this.fabricSquare);
        this.fabricSquare = new fabric.Rect({
            left: this.frame.x,
            top: this.frame.y,
            fill: this.color,
            width:this.frame.width,
            height:this.frame.height
        });
        canvas.add(this.fabricSquare);
    }

    this.reposition = function() 
    {
        this.frame.x = Math.round(Math.random()*this.canvasBounds.width);
        this.frame.y = Math.round(Math.random()*this.canvasBounds.height);
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
    if (player.hitTest(square.frame)) {
        player.makeLonger();
        square.reposition();
    }
    
    square.draw(canvas);
    player.draw(canvas);
}

var canvas;
var player;
var square;
var keyboardState = new Object();
keyboardState.leftDown = false;
keyboardState.rightDown = false;
keyboardState.upDown = false;

$(document).ready(function() 
{
    canvas = new fabric.StaticCanvas('c');
    player = new Player(new Rect(400,300,20,20), new Rect(0,0,canvas.width, canvas.height));
    square = new Square(new Rect(0,0,20,20), new Rect(0,0,canvas.width, canvas.height));
    square.reposition();

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