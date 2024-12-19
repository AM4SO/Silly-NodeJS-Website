var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y : 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    audio: {
        disableWebAudio: true
    },
    scale: {
        //mode: Phaser.Scale.FIT,
        //autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};
class scoreLogger {
    constructor(scene){
        this.scene = scene;
        let roundsSurvived = 0;
        let highScore = 0;

        this.getHighScore = function() {
            var x = localStorage.getItem("SpaceInvadersScoreBoard");
            if (x){
                highScore = JSON.parse(x)[0];
            }
        }
        this.get = function() {
            return highScore;
        }
        this.setHighScore = function () {
            if (highScore < roundsSurvived){
                highScore = roundsSurvived;
                localStorage.setItem("SpaceInvadersScoreBoard", JSON.stringify([highScore]))
            }
        }
        this.step = function () {
            if(scene.p){
                roundsSurvived += 1;
                scene.p = false;
            }
        }
        this.resetScore = function(){
            roundsSurvived = 0;
        }
    }
}
var game = new Phaser.Game(config);

game.scale.onFullScreenChange =  function ()
    {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.mozFullScreenElement)
        {
            this.fullscreenSuccessHandler();
        }
        else
        {
            //  They pressed ESC while in fullscreen mode
            this.stopFullscreen();
            $("canvas").css("width", "800");
            $("canvas").css("height", "600");
        }
    }

function preload ()
{
    this.load.image("background", "assets/background.png");
    this.load.spritesheet('enemy', 
        'assets/enemy.png',
        { frameWidth: 32, frameHeight: 32 }
    );
    this.load.audio("Shoot", ["assets/shoot.wav"]);
    this.load.audio("explosion", ["assets/explode.wav"]);
    this.load.audio("playerDie", ["assets/playerDie.wav"]);
    this.load.audio("start", ["assets/startGame.wav"]);
    this.load.audio("win", ["assets/win.wav"]);
    this.load.spritesheet("bullet", "assets/bullet.png", {frameWidth: 4, frameHeight:20})
    this.load.spritesheet("player", "assets/player.png", {frameWidth: 80, frameHeight:80})
    loadFont("Arcade", "assets/arcade/ARCADE_I.TTF");
}


function setEnemyVelocity(enemies, velocityX,velocityY){
    enemies.forEach(element => {
        element.children.iterate(function(child){
            child.setVelocityX(velocityX);
            child.setVelocityY(velocityY);
            child.setCollideWorldBounds(true);
            child.setBounce(1);
        })
    });

    return enemies;
}
readyToShoot = true;
function create ()
{
    this.add.image(400,300, "background");
    

    this.restarting = false;
    this.gameStarted = false;


    this.score = new scoreLogger(this);
    this.score.getHighScore();
    this.enemyVelocity = 0;
    this.shootBullet = shootBullet;
    this.getOverlap = getOverlap;
    this.round = 1;
    this.enemyBullets = [];
    this.chanceToShoot = 0.0005;
    this.enemyBulletSpeed = 100;
    this.bulletSpeed = 0;
    this.moveSpeed = 0;
    this.texts = [];
    this.p = false;
    this.waveText = this.add.text(100, 350, "", {fontFamily: "Arcade", fontSize: "25px"})
    showStartText(this);
}

////////////////////////////////// YANK
function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}
/////////////////////////////////////
function showStartText(scene, show=true, waveText = false){
    if(show){
        var text = scene.add.text(60, 250, "Space Invaders", {fontFamily: "Arcade", fontSize: "50px"})
        scene.texts.push(text);
        text = scene.add.text(100, 350, "Click To Play", {fontFamily: "Arcade", fontSize: "25px"})
        scene.texts.push(text);
        text = scene.add.text(550, 10, "Highscore: " + scene.score.get() + " waves", {fontFamily: "Arcade", fontSize: "13px"})
        scene.texts.push(text);
    }else{
        scene.texts.forEach(text => {
            text.destroy();
        })
    }
}
bullet = null;
function shootBullet(player, shooter="player"){
    if (shooter == "player"){
        scene.sound.play("Shoot");
        bullet = scene.physics.add.sprite(player.x,player.y - player.height/2 ,"bullet")//player.x[0] + 50, player.y[1] + 50, "bullet");
        bullet.setVelocityY(-scene.bulletSpeed);//200
        readyToShoot = false;
    }
    else{
        var enemyBullet = scene.physics.add.sprite(player.x, player.y + player.height / 2, "bullet");
        enemyBullet.setVelocityY(scene.enemyBulletSpeed);
        scene.enemyBullets.push(enemyBullet);
    }
}
var getOverlap = function(bullet, enemies){
    var x = false;
    enemies.forEach(enemyGroup => {
        enemyGroup.children.iterate(function(child){
            if(game.scene.scenes[0].physics.overlap(bullet, child)){
                x = child;
            }
        });
    });
    return x;
}
function killAll(enemies){
    scene = game.scene.scenes[0];
    scene.gameStarted = false;
    enemies.forEach(enemyGroup => {
        for (var i = 0; i < 4; i++){
            enemyGroup.children.iterate(function(child){
                if(child){child.destroy();}
            })
        }
    })
    scene.enemyBullets.forEach(enemyBullet => {
        if (enemyBullet){
            enemyBullet.destroy();
        }
    })
    scene.enemyBullets = [];
    if (bullet) bullet.destroy();
    bullet = null;
    scene.enemies = [];
    if (scene.player) scene.player.destroy();
    scene.player = null;
}

function setEnemyParams(level){
    scene.chanceToShoot = (0.00036 + 0.0001 * (level-1)) * 36;
    scene.enemyBulletSpeed = 180 + 20 * (level-1);
    scene.enemyVelocity = 132 + 20 * (level-1);
    scene.bulletSpeed = 360 + 50 * (level-1);
    scene.moveSpeed = 192 + 20 * (level-1);
}
function startRound(level){
    scene = game.scene.scenes[0];
    readyToShoot = true;
    scene.enemies = [];
    for(var i = 0; i < 4; i++){
        scene.enemies[i] = scene.physics.add.group({
            key: "enemy",
            repeat: 8,
            setXY: {x: 200, y: i * 50 + 40, stepX: 50}
        })
    }
    scene.enemiesLeft = 36;
    setEnemyParams(level);

    setEnemyVelocity(scene.enemies, scene.enemyVelocity, scene.enemyVelocity * 0.08);
    
    

    scene.player = scene.physics.add.sprite(400, 750, 'player');
    scene.player.setBounce(0);
    scene.player.setCollideWorldBounds(true);
    scene.gameStarted = true;
    scene.restarting = false;
}
function gameOver(endType, enemies){
    scene.gameStarted = false;
    if (endType == "lose"){
        scene.score.setHighScore();
        scene.score.resetScore();
        killAll(enemies);
        scene.round = 1;
        scene.sound.play("playerDie");
        showStartText(scene);
    }else if(endType == "win"){
        killAll(enemies);
        scene.sound.play("win");
        scene.round++;
    }
}
function enemyShoot(){
    scene.enemies.forEach(enemyList => {
        enemyList.children.iterate(function(child){
            if(child && Math.random() <= scene.chanceToShoot/scene.enemiesLeft){
                shootBullet(child, "enemy");
            }
        })
    });
}
function checkEnemyBulletHit(player, enemyBullets){
    var x = false;
    enemyBullets.forEach(enemyBullet => {
        if(scene.physics.overlap(player, enemyBullet)) {
            x = true;
        }
    })
    return x;
}
function start(scene) {
    showStartText(scene, false);
    startRound(1);
}
function update() {

    //if(!game.scale.isFullscreen && game.scale.scaleMode == 3) game.scale.scaleMode = 0; 

    cursors = this.input.keyboard.createCursorKeys();
    this.input.on("pointerdown",function(event){
        if (!this.gameStarted && !this.restarting){
            this.restarting = true;
            this.sound.play("start");
            asyncWait(2000, 1, start, [this]);
        }
    }, this)
    this.p = false;
    if (this.enemiesLeft == 0 && !this.restarting){
        this.restarting = true;
        this.gameStarted = false;
        gameOver("win", this.enemies);
        this.p = true;
        this.score.step();
        asyncWait(2000, 1, startRound, [this.round+1]);
    }

    if(this.gameStarted && !this.restarting){
        if(this.getOverlap(this.player, this.enemies) || checkEnemyBulletHit(this.player, this.enemyBullets)){
            gameOver("lose", this.enemies)
        }else{
            enemyShoot();
            if(bullet){
                var x = this.getOverlap(bullet,this.enemies);
                if (x != false){
                    x.destroy();
                    this.enemiesLeft -= 1;
                    this.sound.play("explosion");
                }
                if (bullet.y < - bullet.height/2 || x){
                    bullet.destroy();
                    bullet = null;
                    readyToShoot = true;
                }
            }
            if (cursors.space.isDown && readyToShoot){
                this.shootBullet(this.player);
            }
            var mov = 0
            if (cursors.left.isDown)
            {
                mov-=1

            }
            if (cursors.right.isDown)
            {   
                mov+=1
            }
            this.player.setVelocityX(this.moveSpeed*mov);
        }
    }
}
$(document).ready(function () {
    $(".fullScreenBtn").click(function () {
        //game.scale.scaleMode = 3;
        //game.scale.refresh();
        $("canvas").css("width", "100%")
        $("canvas").css("height", "100%")
        game.scale.startFullscreen();
    });
});