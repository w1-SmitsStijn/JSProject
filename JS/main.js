// Initialize Phaser, and create a 1500x900px game
var game = new Phaser.Game(1150, 700, Phaser.CANVAS, 'gameDiv', {preload: preload, create: create, update: update});

var gameStarted = false;
var zombie = [];
var choosePlayerNumber = 0;
var lives;
var infoboard;
var timers;
var firstTimer = true;
var canRemoveLife = true;

    function preload() {
        game.stage.backgroundColor = '#4DBD33';

        game.load.image('background', './IMAGES/background.png');
        game.load.image('menu', './IMAGES/menu.png');
        game.load.image('button_start', './IMAGES/button_start.png');
        game.load.image('button_right', './IMAGES/button_right.png');
        game.load.image('button_left', './IMAGES/button_left.png');

        game.load.spritesheet('player0', './IMAGES/player0.png', 45, 45);
        game.load.spritesheet('player1', './IMAGES/player1.png', 45, 45);
        game.load.spritesheet('player2', './IMAGES/player2.png', 45, 45);
        game.load.spritesheet('player3', './IMAGES/player3.png', 45, 45);
        game.load.spritesheet('player4', './IMAGES/player4.png', 45, 45);
        game.load.spritesheet('player5', './IMAGES/player5.png', 45, 45);
        game.load.spritesheet('player6', './IMAGES/player6.png', 45, 45);
        game.load.spritesheet('player7', './IMAGES/player7.png', 45, 45);
        game.load.spritesheet('zombie', './IMAGES/zombie.png', 45, 45);
        game.load.image('life', './IMAGES/heart.png');
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.add.image(0, 0, 'background');
        openMenu();
    }

    function update() {
        if (gameStarted == true) {
            playerMove();
            for (var i = 0; i < level; i++) {
                enemyMove(zombie[i]);
            }

            if (game.physics.arcade.overlap(player, zombie) && canRemoveLife == true) {
                removeLife();
            }
        }
    }

    function openMenu() {
        menu = game.add.image(game.world.centerX - 200, game.world.centerY - 150, 'menu');
        buttonStart = game.add.button(game.world.centerX - 75, game.world.centerY - 75, 'button_start');
        buttonRight = game.add.button(game.world.centerX + 32.5, game.world.centerY + 20, 'button_right');
        buttonLeft = game.add.button(game.world.centerX - 57.5, game.world.centerY + 20, 'button_left');
        choosePlayer = game.add.sprite(game.world.centerX - 23, game.world.centerY + 10, 'player' + choosePlayerNumber);
        choosePlayer.animations.add('down', [0, 1, 2], 5, true);
        choosePlayer.animations.play('down');
        buttonStart.events.onInputUp.add(function () {startGame();}, this);
        buttonRight.events.onInputUp.add(function () {
            choosePlayer.kill();
            if (choosePlayerNumber != 7) {
                choosePlayerNumber++;
            }
            else {
                choosePlayerNumber = 0;
            }
            choosePlayer = game.add.sprite(game.world.centerX - 23, game.world.centerY + 10, 'player' + choosePlayerNumber);
            choosePlayer.animations.add('down', [0, 1, 2], 5, true);
            choosePlayer.animations.play('down');
        }, this);
        buttonLeft.events.onInputUp.add(function () {
            choosePlayer.kill();
            if (choosePlayerNumber != 0) {
                choosePlayerNumber--;
            }
            else {
                choosePlayerNumber = 7;
            }
            choosePlayer = game.add.sprite(game.world.centerX - 23, game.world.centerY + 10, 'player' + choosePlayerNumber);
            choosePlayer.animations.add('down', [0, 1, 2], 5, true);
            choosePlayer.animations.play('down');
        }, this);
    }

    function startGame() {
        menu.kill();
        buttonStart.kill();
        buttonLeft.kill();
        buttonRight.kill();
        choosePlayer.kill();
        gameStarted = true;

        zombie[0] = game.add.sprite(game.world.randomX, game.world.randomY, 'zombie');
        zombie[0].frame = 1;
        game.physics.enable(zombie[0], Phaser.Physics.ARCADE);
        zombie[0].body.collideWorldBounds = true;

        player = game.add.sprite(game.world.centerX - 23, game.world.centerY - 23, 'player' + choosePlayerNumber);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;

        game.physics.arcade.collide(player, zombie[0]);
        
        lives = game.add.group();
        lives.create(1070, 10, 'life');
        lives.create(1095, 10, 'life');
        lives.create(1120, 10, 'life');

        score = 0;
        level = 1;
        timer = 30;
        levelText = game.add.text(4, 4, 'Level: ' + level, { fontSize: '25px', fill: 'white', stroke: "black", strokeThickness: 4 });
        timerText = game.add.text(4, 32, 'Timer: ' + timer, { fontSize: '25px', fill: 'white', stroke: "black", strokeThickness: 4 });
        scoreText = game.add.text(game.world.centerX - 75, 4, 'Score: ' + score, { fontSize: '25px', fill: 'white', stroke: "black", strokeThickness: 4 });
        timers = game.time.events.loop(1000, updateInfoboard, this);
        game.time.events.start();

        Animation();
    }

    function removeLife() {
        live = lives.getFirstAlive();

        if (lives.countLiving() <= 1) {
            game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {
                restartGame();
            }, this);
        }

        if (live) {
            canRemoveLife = false;
            game.add.tween(live).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            game.add.tween(player).to( { alpha: 0 }, 275, Phaser.Easing.Linear.None, true, 0, 1, true);

            game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {
                live.kill();
            }, this);

            game.time.events.add(Phaser.Timer.SECOND * 1.5, function () {
                canRemoveLife = true;
            }, this);

        }
    }

    function updateInfoboard() {
        if (timer <= 0) {
            levelUp();
        }
        else {
            timer--;
        }
            
        score = score + (1 * level);
        timerText.setText('Timer: ' + timer);
        scoreText.setText('Score: ' + score);
        levelText.setText('Level: ' + level);
    }

    function levelUp() {
        level++;
        timer = 30;

        zombie[level - 1] = game.add.sprite(game.world.randomX, game.world.randomY, 'zombie');
        zombie[level - 1].frame = 1;
        game.physics.enable(zombie[level - 1], Phaser.Physics.ARCADE);
        zombie[level - 1].body.collideWorldBounds = true;
        game.physics.arcade.collide(player, zombie[level - 1]);
        Animation();
    }

    function restartGame() {
        player.kill();
        for (var i = 0; i < level; i++) {
            zombie[i].kill();
        }
        game.time.events.stop();
        levelText.kill();
        scoreText.kill();
        timerText.kill();
        gameStarted = false;
        canRemoveLife = true;
        openMenu();
    }

    function playerMove() {
        cursors = game.input.keyboard.createCursorKeys();
        ctrl = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (this.ctrl.isDown) {
            if (this.cursors.up.isDown) {
                this.player.body.velocity.y = -170;
                this.player.animations.play('Rup');
            }

            else if (this.cursors.down.isDown) {
                this.player.body.velocity.y = 170;
                this.player.animations.play('Rdown');
            }

            else if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -170;
                this.player.animations.play('Rleft');
            }
            else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 170;
                this.player.animations.play('Rright');
            }

            else if (this.cursors.left.isUp || this.cursors.right.isUp || this.cursors.up.isUp || this.cursors.down.isUp) {
                this.player.animations.stop();
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 0;
            }
        }

        else {
            if (this.cursors.up.isDown) {
                this.player.body.velocity.y = -100;
                this.player.animations.play('up');
            }

            else if (this.cursors.down.isDown) {
                this.player.body.velocity.y = 100;
                this.player.animations.play('down');
            }

            else if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -100;
                this.player.animations.play('left');
            }

            else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 100;
                this.player.animations.play('right');
            }

            else if (this.cursors.left.isUp || this.cursors.right.isUp || this.cursors.up.isUp || this.cursors.down.isUp) {
                this.player.animations.stop();
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 0;
            }
        }
    }

    function enemyMove(enemy) {
        if (((enemy.position.x - player.position.x < 2) && (enemy.position.x - player.position.x > -2)) == false) {
            if (enemy.position.x < player.position.x) {
                enemy.body.velocity.x = 80;
                enemy.body.velocity.y = 0;
                enemy.animations.play('right');
            }
            else if (enemy.position.x > player.position.x) {
                enemy.body.velocity.x = -80;
                enemy.body.velocity.y = 0;
                enemy.animations.play('left');
            }
            else {
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = 0;
                enemy.animations.stop();
            }
        }
        else if (((enemy.position.y - player.position.y < 2) && (enemy.position.y - player.position.y > -2)) == false) {
            if (enemy.position.y < player.position.y) {
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = 80;
                enemy.animations.play('down');
            }
            else if (enemy.position.y > player.position.y) {
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = -80;
                enemy.animations.play('up');
            }
            else {
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = 0;
                enemy.animations.stop();
            }
        }
        else {
           enemy.body.velocity.x = 0;
           enemy.body.velocity.y = 0;
           enemy.animations.stop(); 
        }
    }

    function Animation() {
        this.player.animations.add('down', [0, 1, 2], 5, true);
        this.player.animations.add('left', [3, 4, 5], 5, true);
        this.player.animations.add('right', [6, 7, 8], 5, true);
        this.player.animations.add('up', [9, 10, 11], 5, true);

        this.player.animations.add('Rdown', [0, 1, 2], 10, true);
        this.player.animations.add('Rleft', [3, 4, 5], 10, true);
        this.player.animations.add('Rright', [6, 7, 8], 10, true);
        this.player.animations.add('Rup', [9, 10, 11], 10, true);

        this.zombie[level - 1].animations.add('down', [0, 1, 2], 4, true);
        this.zombie[level - 1].animations.add('left', [3, 4, 5], 4, true);
        this.zombie[level - 1].animations.add('right', [6, 7, 8], 4, true);
        this.zombie[level - 1].animations.add('up', [9, 10, 11], 4, true);
    } 