(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
  

var Game = new function() {                                                                  
  var boards = [];

  // Game Initialization
  this.initialize = function(canvasElementId,sprite_data,callback) {
    this.canvas = document.getElementById(canvasElementId);
	

    this.playerOffset = 10 / Game.canvasMultiplier;
    this.canvasMultiplier= 1;
    this.setupMobile();

    this.width = this.canvas.width;
    this.height= this.canvas.height;

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) { return alert("Please upgrade your browser to play"); }

	
    this.setupInput();

    this.loop(); 

    if(this.mobile) {
      this.setBoard(4,new TouchControls());
    }

    SpriteSheet.load(sprite_data,callback);
	
  };
  

  // Handle Input
  
  this.keys = {};

  this.setupInput = function() {
  };


  var lastTime = new Date().getTime();
  var maxTime = 1/30;
  // Game Loop
  this.loop = function() { 
    var curTime = new Date().getTime();
    myReq = requestAnimationFrame(Game.loop);
    var dt = (curTime - lastTime)/1000;
    if(dt > maxTime) { dt = maxTime; }

    for(var i=0,len = boards.length;i<len;i++) {
      if(boards[i]) { 
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }
    lastTime = curTime;
  };
  
  // Change an active game board
  this.setBoard = function(num,board) { boards[num] = board; };


  this.setupMobile = function() {
    var container = document.getElementById("container"),
        hasTouch =  !!('ontouchstart' in window),
        w = window.innerWidth, h = window.innerHeight;
      
    if(hasTouch) { this.mobile = true; }

    if(screen.width >= 1280 || !hasTouch) { return false; }

    if(w > h) {
      alert("Please rotate the device and then click OK");
      w = window.innerWidth; h = window.innerHeight;
    }

    container.style.height = h*2 + "px";
    window.scrollTo(0,1);

    //h = window.innerHeight + 2;
    container.style.height = h + "px";
    container.style.width = w + "px";
    container.style.padding = 0;

    if(h >= this.canvas.height * 1.75 || w >= this.canvas.height * 1.75) {
      this.canvasMultiplier = 2;
      this.canvas.width = w / 2;
      this.canvas.height = h / 2;
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";
    } else {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    this.canvas.style.position='absolute';
    this.canvas.style.left="0px";
    this.canvas.style.top="0px";

  };

};



var SpriteSheet = new function() {
  this.map = { }; 
  
  this.sources = {
        image: 'images/sprites.png',
        health: 'images/heart.png',
	    rand: 'images/rand.png',
	    exit: 'images/exit.png'
      };

  this.load = function(spriteData,callback) { 
    this.map = spriteData;
	console.log(this.map);
	this.images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of source
	for(var src in this.sources) {
      numImages++;
    }
	for(var src in this.sources) {
      this.images[src] = new Image();
      this.images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(this.images);
        }
      };
      this.images[src].src = this.sources[src];
    };
    
  };

  this.draw = function(ctx,sprite,x,y,frame) {
	if((roundNumber % 2) == 0) {
  	  var spriteNull = "";
    } else {
   	  var spriteNull = roundNumber % 2;
    }
    var s = this.map['sprite' + spriteNull][sprite];
    if(!frame) frame = 0;
    ctx.drawImage(this.images.image,
                     s.sx + frame * s.w, 
                     s.sy, 
                     s.w, s.h, 
                     Math.floor(x), Math.floor(y),
                     s.w, s.h);
  };

  return this;
};

var TitleScreen = function(title,subtitle,callback) {
  Game.keys['fire'] = false;
  Game.canvas.addEventListener('touchstart',function(e) {
  	touchBool = true;
	console.log(e);
	TitleScreen.pageX = e.targetTouches[0].pageX;
	TitleScreen.pageY = e.targetTouches[0].pageY;
  });

  this.fillTextMultiLine = function(ctx, text, x, y) {
    var lineHeight = ctx.measureText("M").width * 1.4;
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; ++i) {
      ctx.fillText(lines[i], x - ctx.measureText(lines[i]).width/2, y);
      y += lineHeight;
    }
   }
  
  this.step = function(dt) {
    if(Game.keys['fire'] && TitleScreen.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft > Game.width/2 - 40 && TitleScreen.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft < Game.width/2 + 40 && TitleScreen.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft > Game.height/2 -10 && TitleScreen.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft < Game.height/2 + 30 && callback) { 
	  Game.points = 0;
	  roundNumber = 0;
	  roundBegin = 0;
	  callback();
	} else if(TitleScreen.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft > Game.width/2 - 70 && TitleScreen.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft < Game.width/2 + 70 && TitleScreen.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft > Game.height/2 + 60 && TitleScreen.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft < Game.height/2 + 100) {
		var confirmation = confirm('You will now be redirected to a browser outside of the app to complete your donation.');
    if (confirmation == 1) {
          var confirmation = null;
          TitleScreen.pageX = null;
          TitleScreen.pageY = null;
          window.open("https://secure.randpaul.com/", '_system', 'location=yes');
    } else if (confirmation == 0) {
          var confirmation = null;
          window.scrollTo(0,1);
          TitleScreen.pageX = null;
          TitleScreen.pageY = null;
    }
	} else if(TitleScreen.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft > Game.width - 60 && TitleScreen.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft < Game.width - 10 && TitleScreen.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft > 10 && TitleScreen.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft < 60) {
		window.location.href = 'index.html';
		window.cancelAnimationFrame(myReq);
	}
  };

  this.draw = function(ctx) {
    ctx.fillStyle = "#FFFFFF";

    ctx.font = "bold 24px Arial";
    var measure = ctx.measureText(title);  
    this.fillTextMultiLine(ctx,title,Game.width/2,Game.height/2-140);

    ctx.font = "bold 17px Arial";
    var measure2 = ctx.measureText(subtitle);
    this.fillTextMultiLine(ctx,subtitle,Game.width/2,Game.height/2-70);
	
	ctx.fillStyle = "#C0C0C0";
	ctx.fillRect(Game.width/2 - 50,Game.height/2 - 10,100,40);
	ctx.fillStyle = "#FFFFFF";
	ctx.font = '14px Arial';
  var playAgainMeasure = ctx.measureText("PLAY AGAIN");
	ctx.fillText("PLAY AGAIN!",Game.width/2 - playAgainMeasure.width/2,Game.height/2 + 15);
	  
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(Game.width/2 - 70,Game.height/2 + 60,140,40);
	ctx.fillStyle = "#000000";
	ctx.font = 'bold 18px Arial';
  var donateMeasure = ctx.measureText("DONATE NOW!");
	ctx.fillText("DONATE NOW!",Game.width/2 - donateMeasure.width/2,Game.height/2 + 85);
	  
	ctx.drawImage(SpriteSheet.images.rand,
                     	Game.width/2 - 51,
	  				    Game.height - 100);
	  
	
	
  };
};


var GameBoard = function() {
  var board = this;

  // The current list of objects
  this.objects = [];
  this.cnt = {};

  // Add a new object to the object list
  this.add = function(obj) { 
    obj.board=this; 
    this.objects.push(obj); 
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
    return obj; 
  };

  // Mark an object for removal
  this.remove = function(obj) { 
    var idx = this.removed.indexOf(obj);
    if(idx == -1) {
      this.removed.push(obj); 
      return true;
    } else {
      return false;
    }
  };

  // Reset the list of removed objects
  this.resetRemoved = function() { this.removed = []; };

  // Removed an objects marked for removal from the list
  this.finalizeRemoved = function() {
    for(var i=0,len=this.removed.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed[i]);
      if(idx != -1) {
        this.cnt[this.removed[i].type]--;
        this.objects.splice(idx,1);
		
      }
    }
  };

  // Call the same method on all current objects 
  this.iterate = function(funcName) {
     var args = Array.prototype.slice.call(arguments,1);
     for(var i=0,len=this.objects.length;i<len;i++) {
       var obj = this.objects[i];
       obj[funcName].apply(obj,args);
     }
  };

  // Find the first object for which func is true
  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  // Call step on all objects and them delete
  // any object that have been marked for removal
  this.step = function(dt) { 
    this.resetRemoved();
    this.iterate('step',dt);
    this.finalizeRemoved();
  };

  // Draw all the objects
  this.draw= function(ctx) {
    this.iterate('draw',ctx);
  };

  // Check for a collision between the 
  // bounding rects of two objects
  this.overlap = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  // Find the first object that collides with obj
  // match against an optional type
  this.collide = function(obj,type) {
    return this.detect(function() {
      if(obj != this) {
       var col = (!type || this.type & type) && board.overlap(obj,this);
       return col ? this : false;
      }
    });
  };


};

var Sprite = function() { };

Sprite.prototype.setup = function(sprite,props) {
  if((roundNumber % 2) == 0) {
  	var spriteNull = "";
  } else {
  	var spriteNull = roundNumber % 2;
  }
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map['sprite' + spriteNull][sprite].w;
  this.h =  SpriteSheet.map['sprite' + spriteNull][sprite].h;
};

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
};

Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
};

Sprite.prototype.hit = function(damage) {
  this.board.remove(this);
};


var Level = function(levelData,callback) {
  this.levelData = [];
  levelData = shuffle(levelData);
  for(var i =0; i<levelData.length; i++) {
    this.levelData.push(Object.create(levelData[i]));
  }
  this.t = 0;
  this.callback = callback;
};

Level.prototype.step = function(dt) {
  var idx = 0, remove = [], curShip = null;

  // Update the current time offset
  this.t += dt * 1000;

  //   Start, End,  Gap, Type,   Override
  // [ 0,     4000, 500, 'step', { x: 100 } ]
  while((curShip = this.levelData[idx]) && 
        (curShip[0] < this.t + 2000)) {
    // Check if we've passed the end time 
    if(this.t > curShip[1]) {
      remove.push(curShip);
    } else if(curShip[0] < this.t) {
      // Get the enemy definition blueprint
      var enemy = enemies[curShip[3]],
          override = curShip[4];

      // Add a new enemy with the blueprint and override
      this.board.add(new Enemy(enemy,override));

      // Increment the start time by the gap
      curShip[0] += curShip[2];
    }
    idx++;
  }

  // Remove any objects from the levelData that have passed
  for(var i=0,len=remove.length;i<len;i++) {
    var remIdx = this.levelData.indexOf(remove[i]);
    if(remIdx != -1) this.levelData.splice(remIdx,1);
  }

  // If there are no more enemies on the board or in 
  // levelData, this level is done
  if(this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
    if(this.callback) this.callback();
  }

};

Level.prototype.draw = function(ctx) { };


var TouchControls = function() {

  var gutterWidth = 10;
  var unitWidth = Game.width/5;
  var blockWidth = (unitWidth-gutterWidth);

  this.drawSquare = function(ctx,x,y,txt,on) {
    ctx.globalAlpha = on ? 0.9 : 0.6;
    ctx.fillStyle =  "#CCC";
    ctx.fillRect(x,y,blockWidth,blockWidth);

    ctx.fillStyle = "#FFF";
    ctx.globalAlpha = 1.0;
    ctx.font = "bold " + (3*unitWidth/4) + "px arial";

    var txtSize = ctx.measureText(txt);

    ctx.fillText(txt, 
                 x+blockWidth/2-txtSize.width/2, 
                 y+3*blockWidth/4+5);
  };

  this.draw = function(ctx) {
    ctx.save();

    yLoc = Game.height - unitWidth;
    
    //this.drawSquare(ctx,4*unitWidth,yLoc,"A",Game.keys['fire']);

    ctx.restore();
  };

  this.step = function(dt) { };

  this.trackTouch = function(ctx) {
    var touch, x, y;
  };


  // For Android
  

  Game.playerOffset = (unitWidth + 20) / Game.canvasMultiplier;
};


var GamePoints = function() {
  var pointsLength = 8;
  
  if(!Game.points) {
  	Game.points = 0;
  }

  this.draw = function(ctx) {
    ctx.save();
    ctx.font = "bold 18px arial";
    ctx.fillStyle= "#FFFFFF";

    var txt = "" + Game.points;
    var i = pointsLength - txt.length, zeros = "";
    while(i-- > 0) { zeros += "0"; }

    ctx.fillText(zeros + txt,10,20);
    ctx.restore();

	ctx.drawImage(SpriteSheet.images.exit,
                     	Game.width - 25,
	  				    5);
	
  };

  this.step = function(dt) { };
};

var ShipHealth = function() {
	
	this.draw = function(ctx) {
      var numOfLives = health/10;	
	    for(var i=0; i<numOfLives;i++) {
		  ctx.drawImage(SpriteSheet.images.health, Game.width - 55 - (i*30), 10);
	    };
	};

    this.step = function(dt) { };
};

var shuffle = function(array) {
  var m = array.length-2, t, i;

  var moveStyles = [
		"step",
		"ltr",
		"circle",
		"straight"
		];
	
  var moveStylesLength = moveStyles.length, tmp, tmp1;
  while (moveStylesLength)  {

    // Pick a remaining element…
    tmp = Math.floor(Math.random() * moveStylesLength--);

    // And swap it with the current element.
    tmp1 = moveStyles[moveStylesLength];
    moveStyles[moveStylesLength] = moveStyles[tmp];
    moveStyles[tmp] = tmp1;
  }
  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  
  for(var i=0; i<array.length-2; i++) {
  	var timeDiff = array[i][1] - array[i][0];
	
	if(i == 0) {
		array[i][0] = 0;
		array[i][1] = timeDiff;
	} else {
		array[i][0] = array[i-1][1];
		array[i][1] = array[i-1][1] + timeDiff + 1000;
	} 
  }
  
  var wiggleStart = array[array.length-3][1];
  var wiggleDiff = array[array.length-2][1] - array[array.length-2][0];
  
  array[array.length-2][0] = wiggleStart;
  array[array.length-2][1] = wiggleStart + wiggleDiff;
  array[array.length-1][0] = wiggleStart;
  array[array.length-1][1] = wiggleStart + wiggleDiff;
  
  return array;
}
