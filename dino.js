//board /A área de jogo onde tudo será desenhado.
let board;
let boardWidth = 750; //- Define a largura da area de jogo em 750 pixels.
let boardHeight = 250; //- Define a altura da area de jogo em 250 pixels.
let context; //- Declara a variavel context, que será usada para desenhar elementos.

//dino / O personagem principal do jogo, que pode saltar para evitar obstáculos.
let dinoWidth = 88; //- Largura do dino.
let dinoHeight = 94; //- Altura do dino.
let dinoX = 50; //- Posição horizontal do dino inicialmente.
let dinoY =  boardHeight - dinoHeight; //- Posição vertical do dino inicialmente, garantindo que ele fique no chão.
let dinoImg; //- Declaração da variavel que armazena a imagem do dinossauro.

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//-cactus /Obstáculos gerados aleatoriamente que se movem para a esquerda.
let cactusArray = []; //- Um array vazio é criado para armazenar os cactos que irão aparecer na tela.

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70; //- Todos tem a mesma altura de 70 pixels.
let cactusX = 700; //- Os cactos começam na posição horizontal, longe do dinossauro.
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //- Velocidade horizontal dos cactos.
let velocityY = 0; //- Velocidade vertical do dinossauro, usada no salto.
let gravity = .4; //- Adiciona efeito de gravidade, puxando o dino para o chão.

let gameOver = false; //- Indica que o jogon ainda não acabou
let score = 0; //- Inicia a pontuação em 0.

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //- Usado para desenhar no quadro.

    //desenhe o dinossauro inicial
    // context.fillStyle="green"
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/dino.png?raw=true&quot";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    } 

    cactus1Img = new Image();
    cactus1Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/big-cactus1.png?raw=true&quot";

    cactus2Img = new Image();
    cactus2Img.src= "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/big-cactus2.png?raw=true&quot";

    cactus3Img = new Image();
    cactus3Img = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/big-cactus3.png?raw=true&quot";

    requestAnimationFrame(update); //- Inicio do loop de atualização.

    setInterval(placeCactus, 1000);
    document.addEventListener("keydown", moveDino);
}

function update() { //- Mantém o jogo em funcionamento.
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if(detectCollision(dino, cactus)) {
            gameOver = true; //- Se houver colisão, o jogo é encerrado, "true" afirma que o jogo terminou.
            dinoImg.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/dino-dead.png?raw=true&quot";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {

        return;
    }

    if((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {

        //jump
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height : cactusHeight
    }

    let placeCactusChance = Math.random();

    if (placeCactusChance > .90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray,length > 5) {
        cactusArray.shift();
     }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
