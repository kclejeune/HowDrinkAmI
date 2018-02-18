var sprites = { sprite: {
 ship: { sx: 0, sy: 0, w: 51, h: 26, frames: 1 },
 missile: { sx: 0, sy: 37, w: 12, h: 28, frames: 1 },
 enemy_1040: { sx: 51, sy: 0, w: 35, h: 50, frames: 1 },
 enemy_28: { sx: 86, sy: 0, w:51, h: 26, frames: 1 },
 enemy_tape: { sx: 136, sy: 0, w: 50, h: 34, frames: 1 },
 enemy_396: { sx: 186, sy: 0, w: 49, h: 17, frames: 1 },
 enemy_IRS: { sx: 235, sy: 0, w: 42, h: 50, frames: 1 },
 explosion: { sx: 0, sy: 68, w: 64, h: 64, frames: 12 },
 enemy_missile: { sx: 26, sy: 42, w: 20, h: 20, frame: 1 }
},
sprite1: {
 ship: { sx: 0, sy: 0, w: 51, h: 26, frames: 1 },
 missile: { sx: 0, sy: 37, w: 12, h: 28, frames: 1 },
 enemy_1040: { sx: 277, sy: 0, w: 49, h: 28, frames: 1 },//JEB
 enemy_28: { sx: 376, sy: 0, w: 25, h: 39, frames: 1 }, //CRUZ
 enemy_tape: { sx: 376, sy: 0, w: 25, h: 39, frames: 1 },//CRUZ
 enemy_396: { sx: 403, sy: 0, w: 60, h: 22, frames: 1 },//TRUMP
 enemy_IRS: { sx: 327, sy: 0, w: 50, h: 42, frames: 1 },//Hillary
 explosion: { sx: 0, sy: 68, w: 64, h: 64, frames: 12 },
 enemy_missile: { sx: 28, sy: 42, w: 20, h: 20, frame: 1 }
}
};

var enemies = {
  straight: { x: 0,   y: -50, sprite: 'enemy_396', health: 10, 
              E: 100 },
  ltr:      { x: 0,   y: -100, sprite: 'enemy_28', health: 10, 
              B: 75, C: 1, E: 100, missiles: 1  },
  circle:   { x: 350,   y: -50, sprite: 'enemy_tape', health: 10, 
              A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
  wiggle:   { x: 100, y: -50, sprite: 'enemy_IRS', health: 10, 
              B: 50, C: 4, E: 75, firePercentage: 0.001, missiles: 1},
  step:     { x: 0,   y: -50, sprite: 'enemy_1040', health: 10,
              B: 150, C: 1.2, E: 75 }
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

  // Only 1 row of stars
  if(ua.match(/android/)) {
    Game.setBoard(0,new Starfield(50,0.6,100,true));
  } else {
    Game.setBoard(0,new Starfield(20,0.4,100,true));
    Game.setBoard(1,new Starfield(50,0.6,100));
    Game.setBoard(2,new Starfield(100,1.0,50));
  }  
  
  playGame();
};

var level1 = [
 // Start,   End, Gap,  Type,   Override
  [ 0,      4000,  500, 'step' ],
  [ 6000,   13000, 800, 'ltr' ],
  [ 10000,  16000, 400, 'circle' ],
  [ 17800,  20000, 500, 'straight', { x: 60 } ],
  [ 18200,  20000, 500, 'straight', { x: 110 } ],
  [ 18200,  20000, 500, 'straight', { x: 10 } ],
  [ 22000,  30000, 800, 'wiggle', { x: 150 }],
  [ 22000,  30000, 800, 'wiggle', { x: 100 }]
];



var playGame = function() {
  var board = new GameBoard();
  board.add(new PlayerShip());
  board.add(new Level(level1,NextRound));
  if(roundBegin == 1){
	  Game.setBoard(3,board);
  } else {
  	Game.setBoard(3, new NextRound());
	roundbegin = 0;
  }
  Game.setBoard(5,new GamePoints(0));
  Game.setBoard(6,new ShipHealth());
};

var loseGame = function() {
  if(roundNumber % 2 == 1) {
    Game.setBoard(3,new TitleScreen("YOU HAVE NOT DEFEATED \n YOUR INFERIORS!", 
                                  "Assuage your guilt by making \n a donation to the campaign!",
                                  playGame));
  } else if(roundNumber % 2 == 0) {
    Game.setBoard(3,new TitleScreen("YOU HAVE NOT DESTROYED \n THE TAX CODE!", 
                                  "Assuage your guilt by making \n a donation to the campaign!",
                                  playGame));
  }
};

var advanceRound = function() {
  
  Game.setBoard(3, new NextRound());
}

var NextRound = function() {
	var timeLeft = 3;
	
	if(!roundNumber){
      roundNumber = 1;
    } else {
      roundNumber += 1;
    }

	
	this.step = function(dt) {
	  timeLeft -= dt;
	  if(timeLeft < 0) {
	  	roundBegin = 1;
		playGame();
	  }
	};
	
	this.draw = function(ctx) {
	  var round = "Round " + roundNumber;
	  Game.ctx.fillStyle = "#FFFFFF";
	  Game.ctx.font = "bold 30px Arial";
      Game.ctx.fillText(round,Game.width/2 - Game.ctx.measureText(round).width/2,Game.height/2);
	  if(roundNumber == 1){
	  	var instructions = "Tap to move and shoot!";
		Game.ctx.fillStyle = "#FFFFFF";
	    Game.ctx.font = "bold 25px Arial";
        Game.ctx.fillText(instructions,Game.width/2 - Game.ctx.measureText(instructions).width/2,Game.height/2 + 50);
	  }
	}
}

var Starfield = function(speed,opacity,numStars,clear) {

  // Set up the offscreen canvas
  var stars = document.createElement("canvas");
  stars.width = Game.width; 
  stars.height = Game.height;
  var starCtx = stars.getContext("2d");

  var offset = 0;

  // If the clear option is set, 
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#FFF";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*stars.width),
                     Math.floor(Math.random()*stars.height),
                     2,
                     2);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(stars,
              0, 0,
              stars.width, remaining,
              0, intOffset,
              stars.width, remaining);
    }
  };

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  };
};

var PlayerShip = function() { 
  this.setup('ship', {vx: 0, reloadTime: 0.25, maxVel: 200 });
  health = 30;
  this.reload = this.reloadTime;
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height - Game.playerOffset - this.h;
	
  

  this.step = function(dt) {
	
	if (!touchBool) {
		Game.canvas.addEventListener('touchstart',function(event) {
		  touchBool = true;
		  touchMove(event);
		  },true);
    }
	
	var touchMoveX;
	  
	var touchMove = function(evt) {
    
    var ScreenTouch = evt.targetTouches[0];
    if(ScreenTouch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft > Game.width - 60 && ScreenTouch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft < Game.width - 10 && ScreenTouch.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft > 10 && ScreenTouch.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft < 60) {
      window.location.href = 'index.html';
      window.cancelAnimationFrame(myReq);
    }
	  Game.keys['fire'] = true;
      touch = evt.changedTouches[0];
	  touch1 = evt.targetTouches[0];
    }
	
	if(typeof touch !== 'undefined') {
	  
	  if(touch1.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft > Game.width - 60 && touch1.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft < Game.width - 10 && touch1.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft > 10 && touch1.pageY / Game.canvasMultiplier - Game.canvas.offsetLeft < 60) {
		window.location.href = index.html;
		window.cancelAnimationFrame(myReq);
	  }
	  touchMoveX = touch.pageX;
	  var rawX = touchMoveX / Game.canvasMultiplier - Game.canvas.offsetLeft;
	  rawX = Math.round(rawX) - (this.w/2);
	  
		
	  if(rawX < Math.round(this.x)) {
	  	vx = -400;
	  } else if(rawX > Math.round(this.x)) {
	  	vx = 400;
	  }
	  
	  if ((Math.round(this.x) - rawX < 10 && Math.round(this.x) - rawX > -10) || ((rawX - Math.round(this.x) < 10 && rawX - Math.round(this.x) > -10) )) {
	  	vx = 0;
		
		if(Game.keys['fire'] && this.reload < 0) {
          Game.keys['fire'] = false;
          this.reload = this.reloadTime;

          this.board.add(new PlayerMissile(this.x+(this.w/2),this.y+this.h/2));
         
        }
	  }
	  
	  this.x += vx * dt;
	  	
	  
	  if(this.x < 0) { 
	    this.x = 0;
	  } else if(this.x > Game.width - this.w) { 
      	this.x = Game.width - this.w;
      }
	  
	  
	  
	} else {
      
	  this.x = Game.width/2 - this.w / 2;
	}
	

    this.reload-=dt;
    
  };
};

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function() {
  if(this.board.remove(this)) {
    if(health > 0){
	  health -= 10;
	  this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
	} else {
		this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
		loseGame();
	}
  }
};


var PlayerMissile = function(x,y) {
  this.setup('missile',{ vy: -700, damage: 10 });
  this.x = x - this.w/2;
  this.y = y - this.h; 
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_ENEMY);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y < -this.h) { 
      this.board.remove(this); 
  }
};


var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
};

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, reloadTime: 0.75, 
                                   reload: 0 };

Enemy.prototype.step = function(dt) {
  this.t += dt;

  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;
  this.y += this.vy * dt;

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
	health -= 10;
	if(health > 0){
	  this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
      this.board.remove(this);
	} else {
		this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
		loseGame();
	}
  }

  if(Math.random() < (0.003*roundNumber) && this.reload <= 0) {
    this.reload = this.reloadTime;
    if(this.missiles == 2) {
      this.board.add(new EnemyMissile(this.x+this.w-2,this.y+this.h));
      this.board.add(new EnemyMissile(this.x+2,this.y+this.h));
    } else {
      this.board.add(new EnemyMissile(this.x+this.w/2,this.y+this.h));
    }

  }
  this.reload-=dt;

  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }
};

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      Game.points += this.points || 100;
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }
};

var EnemyMissile = function(x,y) {
  this.setup('enemy_missile',{ vy: 200, damage: 10 });
  this.x = x - this.w/2;
  this.y = y;
};

EnemyMissile.prototype = new Sprite();
EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

EnemyMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_PLAYER)
  if(collision) {
	health -= 10;
    if(health > 0){
	  this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
      this.board.remove(this);
	} else {
		this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
		loseGame();
	}
  } else if(this.y > Game.height) {
      this.board.remove(this); 
  }
};



var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame++;
  if(this.frame >= 12) {
    this.board.remove(this);
  }
};

window.addEventListener("load", function load(event){
  touchBool = false;
  window.removeEventListener("load", load, false);
  roundNumber = 0;
  roundBegin = 0;
  Game.initialize("game",sprites,startGame);
});
