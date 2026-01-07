const config = {
    type: Phaser.AUTO,
    width: 160,
    height: 240,
    zoom: 3,
    pixelArt: true,
    transparent: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

new Phaser.Game(config);

function preload() { }

function create() {
    this.textures.generate("bird", {
        data: [
            " 11 ",
            "1111",
            "1111",
            " 11 "
        ],
        pixelWidth: 2
    });

    this.textures.generate("pipe", {
        data: [
            "1111",
            "1111",
            "1111",
            "1111",
            "1111",
            "1111",
            "1111",
            "1111"
        ],
        pixelWidth: 1
    });

    this.bird = this.physics.add.sprite(50, 120, "bird");
    this.bird.setScale(2);
    this.bird.setTint(0xffff00);
    this.bird.body.setGravityY(400);
    this.bird.setCollideWorldBounds(true);

    this.input.on("pointerdown", () => {
        console.log("CLICK");
        this.bird.body.setVelocityY(-250);
    });


    this.pipes = this.physics.add.group();

    this.time.addEvent({
        delay: 1500,
        callback: () => spawnPipes(this),
        loop: true
    });
    this.physics.add.collider(this.bird, this.pipes, gameOver, null, this);

}
function spawnPipes(scene) {
    const gap = 60;
    const pipeWidth = 16;
    const pipeSpeed = -80;

    const centerY = Phaser.Math.Between(80, 160);

    const topPipe = scene.pipes.create(160, centerY - gap / 2, "pipe");
    topPipe.setScale(4);
    topPipe.setTint(0x00aa00);
    topPipe.body.setVelocityX(pipeSpeed);
    topPipe.body.allowGravity = false;
    topPipe.setOrigin(0.5, 1);

    const bottomPipe = scene.pipes.create(160, centerY + gap / 2, "pipe");
    bottomPipe.setScale(4);
    bottomPipe.setTint(0x00aa00);
    bottomPipe.body.setVelocityX(pipeSpeed);
    bottomPipe.body.allowGravity = false;
    bottomPipe.setOrigin(0.5, 0);
}

function gameOver() {
    if (this.isGameOver) return;

    this.isGameOver = true;

    // Stop physics
    this.physics.pause();

    // Stop pipes
    this.pipes.children.iterate(pipe => {
        if (pipe) pipe.body.setVelocityX(0);
    });

    // Show Game Over text
    this.add.text(40, 120, "GAME OVER", {
        fontSize: "16px",
        fill: "#000"
    }).setScrollFactor(0);
}


function update() {
    this.pipes.children.iterate(pipe => {
        if (pipe && pipe.x < -20) {
            pipe.destroy();
        }
    });
}
