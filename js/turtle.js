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
    this.origFrame = jQuery.extend({}, rect);
    this.canvasBounds = canvasRect;
    this.angle = 0;
    this.color = 'red';
    this.speed = 2.0;
    this.turningSpeed = 5;
    this.fabricTriangle = null;
    this.path = [['M', this.x, this.y]];
    this.fabricPath = null;
    this.length = 50;
    this.draw = function(canvas) 
    {
        canvas.remove(this.fabricTriangle);
        this.fabricTriangle = new fabric.Triangle({
            left: this.frame.x+this.frame.width/2,
            top: this.frame.y+this.frame.width/2,
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
        this.path.push(['L', this.frame.x+this.frame.width/2, this.frame.y+this.frame.height/2]);
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

    this.hitTestPath = function(path)
    {
        for (var i = 0; i < path.length-20; i++)
        {
            var a = {x:path[i][1], y:path[i][2]};
            var b = {x:path[i+1][1], y:path[i+1][2]};

            if (this.hitTestPoint(a) || this.hitTestPoint(b))
            {
                return true;
            }
        }

        return false;
    }
    this.hitTestPoint = function(a)
    {
        return  a.x >= this.frame.x 
                && a.x <= this.frame.x+this.frame.width 
                && a.y >= this.frame.y 
                && a.y <= this.frame.y+this.frame.height;
    }

    this.reset = function() 
    {
        this.frame.x = this.origFrame.x;
        this.frame.y = this.origFrame.y;
        this.path = [['M', this.frame.x+this.frame.width/2, this.frame.y+this.frame.width/2]];
        this.angle = 0;
        this.length = 50;
        this.speed = 2.0;
    }
}

function Square (frame, canvasBounds) 
{
    this.frame = frame;
    this.canvasBounds = canvasBounds;
    this.color = 'black';
    this.fabricImage = null;
    this.img = document.getElementById('stevii');
    this.draw = function (canvas) 
    {
        canvas.remove(this.fabricImage);
        this.fabricImage = new fabric.Image(this.img, {
          left: this.frame.x+this.frame.width/2,
          top: this.frame.y+this.frame.width/2
        });
        canvas.add(this.fabricImage);
    }

    this.reposition = function() 
    {
        this.frame.x = Math.round(Math.random()*(this.canvasBounds.width-this.frame.width));
        this.frame.y = Math.round(Math.random()*(this.canvasBounds.height-this.frame.width));
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
        player.speed += 0.1;
        square.reposition();
        score += 1;
    }
    if (player.hitTestPath(player.path)) {
        clearInterval(timer);
        clearKeyboardState();
        alert("Your score is: "+score);
        player.reset();
        score = 0;
        timer = setInterval(main, 20);
    }

    $("#score").text(score);
    
    square.draw(canvas);
    player.draw(canvas);
}

var canvas;
var player;
var square;
var keyboardState = new Object();
var score = 0;
var timer;

function clearKeyboardState() {
    keyboardState.leftDown = false;
    keyboardState.rightDown = false;
    keyboardState.upDown = false;
}
clearKeyboardState();

$(document).ready(function() 
{
    canvas = new fabric.StaticCanvas('c');
    player = new Player(new Rect(400,300,20,20), new Rect(0,0,canvas.width, canvas.height));
    square = new Square(new Rect(0,0,40,40), new Rect(0,0,canvas.width, canvas.height));
    square.reposition();

    timer = setInterval(main, 20);
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