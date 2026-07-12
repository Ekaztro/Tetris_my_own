let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let levelUp =20;
let speed=1;
let timer;
let person = " ";
let fperson =" ";
let sperson=" ";
let hperson=" ";
if (localStorage.getItem('fperson')){ fperson = localStorage.getItem('fperson');} else {localStorage.setItem('fperson'," ");}
if (localStorage.getItem('sperson')){ sperson = localStorage.getItem('sperson');} else {localStorage.setItem('sperson'," ");}
if (localStorage.getItem('hperson')){ hperson = localStorage.getItem('hperson');} else {localStorage.setItem('hperson'," ");}
let winOrLose = "Playing";
let isPaused =false;
let highscore =0;
let secondscore=0;
let harmadikscore =0;
if (localStorage.getItem('highscore')){ highscore = localStorage.getItem('highscore');} else {localStorage.setItem('highscore',0);}
if (localStorage.getItem('secondscore')){ secondscore = localStorage.getItem('secondscore');} else {localStorage.setItem('secondscore',0);}
if (localStorage.getItem('harmadikscore')){ harmadikscore = localStorage.getItem('harmadikscore');} else {localStorage.setItem('harmadikscore',0);}
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let curTetromino = [[1,0], [0,1], [1,1], [2,1]];
let tetrominos = [];
let tetrominoColors = ['purple','cyan','blue','yellow','pink','green','red'];
let curTetrominoColor;
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;
let Keys={
    LEFT: 65,
    RIGHT: 68,
    DOWN: 83,
    ROTATE: 87,
    PAUSE: 80,
    MUTE: 77
}
function playAudio() {
    document.getElementById("audio").play();
}

class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

function KordinatArrayLetre(){
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas(key){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;
    ctx.scale(2, 2);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("HIGHSCORE",300,40);
    ctx.strokeRect(300,50,160,25);
    ctx.fillText(highscore.toString(),305,70);

    ctx.fillText("SCORE", 300, 100);
    ctx.strokeRect(300, 110, 160, 25);
    ctx.fillText(score.toString(), 305, 130);

    ctx.fillText("LEVEL", 300, 160);
    ctx.strokeRect(300, 170, 160, 25);
    ctx.fillText(level.toString(), 305, 190);

    ctx.fillText("WIN / LOSE", 300, 220);
    ctx.strokeRect(300, 230, 160, 25);
    ctx.fillText(winOrLose, 305, 250);


    ctx.fillText("CONTROLS", 300, 280);
    ctx.strokeRect(300, 290, 160, 74);
    ctx.font = '10px Arial';
    ctx.fillText("A : Move Left", 305, 300);
    ctx.fillText("D : Move Right", 305, 312);
    ctx.fillText("S : Move Down", 305, 324);
    ctx.fillText("E : Rotate Right", 305, 336);
    ctx.fillText("P : Pause", 305, 348);
    ctx.fillText("M : Mute", 305, 360);


    ctx.font = '21px Arial';
    ctx.fillText("TOPLISTA", 300, 390);
    ctx.strokeRect(300, 400, 160, 70);
    ctx.fillText("1. "+highscore+" "+fperson,305,420);
    ctx.fillText("2. "+secondscore+" "+sperson,305,443);
    ctx.fillText("3. "+harmadikscore+" "+hperson,305,465);



    document.addEventListener('keydown', gombNyomasKezeles);
    TetromokLetrehoz();
    TetromLetrehoz();
    KordinatArrayLetre();
    ElemRajz();
}

function ElemRajz(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function gombNyomasKezeles(key){
    if(winOrLose !== "Game Over"){
        if(key.keyCode === 65 && !isPaused){
            direction = DIRECTION.LEFT;
            if(!fallUtes() && !VizszintesUtkozes()){
                TetromTorles();
                startX--;
                ElemRajz();
            }
        } else if(key.keyCode === 68 && !isPaused){
            direction = DIRECTION.RIGHT;
            if(!fallUtes() && !VizszintesUtkozes()){
                TetromTorles();
                startX++;
                ElemRajz();
            }
        } else if(key.keyCode === 83 && !isPaused){
            TetromMozgasLe();
        } else if(key.keyCode === 69 && !isPaused){
            forgatas();
        } else if(key.keyCode === Keys.PAUSE){
            isPaused = !isPaused;


        }
    }
    if (key.keyCode === Keys.MUTE){
        document.getElementById("audio").pause();
    }


}

function TetromMozgasLe(){
    direction = DIRECTION.DOWN;
    if(!FuggolegesUtkozes()){
        TetromTorles();
        startY++;
        ElemRajz();
    }
}

function setSpeed(speed) {
    timer = window.setInterval(() => {
        if (!isPaused){
            if (winOrLose !=="Game Over"){
                TetromMozgasLe();
            }
        }
    },1000/speed);
}
setSpeed(speed);

function TetromTorles(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}
function TetromokLetrehoz(){
    // T
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Kocka
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function TetromLetrehoz(){
    let randomTetrom = Math.floor(Math.random() * tetrominos.length);
    curTetromino = tetrominos[randomTetrom];
    curTetrominoColor = tetrominoColors[randomTetrom];
}

function fallUtes(){
    for(let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }
    }
    return false;
}

function FuggolegesUtkozes(){
    let tetromCopy = curTetromino;
    let utkozes = false;
    for(let i = 0; i < tetromCopy.length; i++){
        let kocka = tetromCopy[i];
        let x = kocka[0] + startX;
        let y = kocka[1] + startY;
        if(direction === DIRECTION.DOWN){
            y++;
        }
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            TetromTorles();
            startY++;
            ElemRajz();
            utkozes = true;
            break;
        }
        if(y >= 20){
            utkozes = true;
            break;
        }
    }
    if(utkozes){
        if(startY <= 2){
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(300, 230, 160, 25);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 305, 250);
            person = prompt("Adja meg a nevét:", "anonymus");
            if (score > highscore){

                localStorage.setItem("fperson",person);
                localStorage.setItem("sperson",fperson);
                localStorage.setItem("hperson",sperson);
            }
            if (score <= highscore && score > secondscore){

                localStorage.setItem("sperson",person);
                localStorage.setItem("hperson",sperson);
            }
            if (score <= secondscore && score > harmadikscore){

                localStorage.setItem("hperson",person);
            }
        } else {
            for(let i = 0; i < tetromCopy.length; i++){
                let kocka = tetromCopy[i];
                let x = kocka[0] + startX;
                let y = kocka[1] + startY;
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
            KeszSor();
            TetromLetrehoz();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            ElemRajz();
        }

    }
}

function VizszintesUtkozes(){
    var tetromCopy = curTetromino;
    var utkozes = false;
    for(var i = 0; i < tetromCopy.length; i++)
    {
        var kocka = tetromCopy[i];
        var x = kocka[0] + startX;
        var y = kocka[1] + startY;
        if (direction === DIRECTION.LEFT){
            x--;
        }else if (direction === DIRECTION.RIGHT){
            x++;
        }
        var stopdErtek = stoppedShapeArray[x][y];
        if (typeof stopdErtek === 'string')
        {
            utkozes=true;
            break;
        }
    }

    return utkozes;
}

function KeszSor(){
    let sorTorles = 0;
    let TorlesKezdes = 0;
    for (let y = 0; y < gBArrayHeight; y++)
    {
        let kesz = true;
        for(let x = 0; x < gBArrayWidth; x++)
        {
            let kocka = stoppedShapeArray[x][y];
            if (kocka === 0 || (typeof kocka === 'undefined'))
            {
                kesz=false;
                break;
            }
        }
        if (kesz)
        {
            if(TorlesKezdes === 0) TorlesKezdes = y;
            sorTorles++;
            for(let i = 0; i < gBArrayWidth; i++)
            {
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(sorTorles > 0){
        score += 10;
        if (score > localStorage.getItem('highscore')) {
            localStorage.setItem('highscore', score);
            localStorage.setItem("secondscore",highscore);
            localStorage.setItem("harmadikscore",secondscore);
            ctx.fillStyle = 'white';
            ctx.fillRect(300, 50, 160, 25);
            ctx.fillStyle = 'black';
            ctx.fillText(score.toString(), 305, 70);
        }
        if (score > secondscore && score <= highscore){
            localStorage.setItem("secondscore",score);
            localStorage.setItem("harmadikscore",secondscore);
        }
        if (score <= secondscore && score > harmadikscore){
            localStorage.setItem("harmadikscore",score);
        }
        ctx.fillStyle = 'white';
        ctx.fillRect(300, 110, 160, 25);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 305, 130);
        MindenSorLejebb(sorTorles, TorlesKezdes);

        if (score % levelUp === 0) {
            speed++;
            level++;
            ctx.fillStyle = 'white';
            ctx.fillRect(300, 170, 160, 25);
            ctx.fillStyle = 'black';
            ctx.fillText(level.toString(), 305, 190);
            clearInterval(timer);
            setSpeed(speed);
        }
    }
}

function MindenSorLejebb(sorTorles, TorlesKezdes){
    for (var i = TorlesKezdes-1; i >= 0; i--)
    {
        for(var x = 0; x < gBArrayWidth; x++)
        {
            var y2 = i + sorTorles;
            var kocka = stoppedShapeArray[x][i];
            var koviKocka = stoppedShapeArray[x][y2];

            if (typeof kocka === 'string')
            {
                koviKocka = kocka;
                gameBoardArray[x][y2] = 1; // Put block into GBA
                stoppedShapeArray[x][y2] = kocka; // Draw color into stopped
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = koviKocka;
                ctx.fillRect(coorX, coorY, 21, 21);
                kocka = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in GBA
                stoppedShapeArray[x][i] = 0; // Clear the spot in SSA
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}
function forgatas()
{
    let ujForgatas = [];
    let tetromCopy = curTetromino;
    let jelenTetromBU;
    for(let i = 0; i < tetromCopy.length; i++)
    {
        jelenTetromBU = [...curTetromino];
        let x = tetromCopy[i][0];
        let y = tetromCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        ujForgatas.push([newX, newY]);
    }
    TetromTorles();
    try{
        curTetromino = ujForgatas;
        ElemRajz();
    }
    catch (e){
        if(e instanceof TypeError) {
            curTetromino = jelenTetromBU;
            TetromTorles();
            ElemRajz();
        }
    }
}
function GetLastSquareX()
{
    let lastX = 0;
    for(let i = 0; i < curTetromino.length; i++)
    {
        let kocka = curTetromino[i];
        if (kocka[0] > lastX)
            lastX = kocka[0];
    }
    return lastX;
}
