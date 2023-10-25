//
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//
const height = 800;
const width = 800;
const cellSize = 100;
//
canvas.height = 800;
canvas.width = 800;
//
var step = 0;

var cellColor = ["#33CC33", "#FFFFCC"];

const ChestUnitSrc = [
    '',
    './ChessUnit/Vua-Trang.png',
    './ChessUnit/Hau-Trang.png',
    './ChessUnit/Tuong-Trang.png',
    './ChessUnit/Ngua-Trang.png',
    './ChessUnit/Xe-Trang.png',
    './ChessUnit/Tot-Trang.png',

    './ChessUnit/Vua-Den.png',
    './ChessUnit/Hau-Den.png',
    './ChessUnit/Tuong-Den.png',
    './ChessUnit/Ngua-Den.png',
    './ChessUnit/Xe-Den.png',
    './ChessUnit/Tot-Den.png'
];

//////////
function createNewMapArr() {
    var ChessArr = [
        [11, 10,  9,  7,  8,  9, 10, 11],
        [12, 12, 12, 12, 12, 12, 12, 12],
        [ 0,  0,  0,  0,  0,  0,  0,  0],
        [ 0,  0,  0,  6,  0,  0,  5,  0],
        [ 0,  5,  0,  0,  6,  0,  0,  0],
        [ 0,  0,  0,  0,  0,  0,  0,  0],
        [ 6,  6,  6,  0,  0,  6,  6,  6],
        [ 0,  4,  3,  2,  1,  3,  4,  0],
    ];
    return ChessArr;
}
var ChessArr = createNewMapArr();

function drawPlayGround(ChessArr) {
    for(let countRow in ChessArr) {
        cellColor = cellColor.reverse();
        
        for(let countCol in ChessArr[countRow]) {
            if(countCol % 2 == 0) ctx.fillStyle = cellColor[0];
            else ctx.fillStyle = cellColor[1];

            ctx.beginPath();
            ctx.rect(countCol*cellSize, countRow*cellSize, cellSize, cellSize);
            ctx.fill();
            drawUnit(countRow, countCol, ChessArr);
        }
    }
}
///
function drawUnit(row, col, Arr) {
    const img = new Image()

    if(Arr[row][col] != 0) {
        img.src = ChestUnitSrc[Arr[row][col]]; 
    } else return 0;

    img.onload = () => {
        ctx.drawImage(img, col*cellSize, row*cellSize, 100, 100);
    }
}




function checkMove(unit, x1, y1, x2, y2) {
    var max = [x1, y1], min = [x2, y2], lastCell, count;
    if(x1 < x2) {
        max[0] = x2;
        min[0] = x1;
    } 
    if(y1 < y2) {
        max[1] = y2;
        min[1] = y1;
    }

    switch(unit) {
        case 5:
            if(x1 - x2 != 0 && y1 - y2 == 0) {
                for(count = min[0] + 1; count < max[0]; count++) {
                    if(ChessArr[y1][count] != 0) {
                        return {move: false};
                    }
                    lastCell = ChessArr[y1][count + 1];
                }
                if(lastCell != 0) return {move: true, kill: true};
                return {move: true, kill: false};
            }
            if(x1 - x2 == 0 && y1 - y2 != 0) {
                for(count = min[1] + 1; count < max[1]; count++) {
                    if(ChessArr[count][x1] != 0) {
                        return {move: false};
                    }
                    lastCell = ChessArr[count + 1][x1];
                }
                if(lastCell != 0) return {move: true, kill: true};
                return {move: true, kill: false};
            } 
            return {move: false};

        case 6:
            if(y1 - y2 == 1) {
                if((x1 - x2 == 1 || x1 - x2 == -1) && ChessArr[y2][x2] != 0) {
                    return {move: true, kill: true};
                } else 
                if(x1 - x2 == 0 && ChessArr[y2][x2] == 0) {

                    return {move: true, kill: false};
                } else return {move: false};

            }
            return {move: false};
        default:
            return {move: false};
    }
}




function swap(x1, y1, x2, y2, kill) {
    let temp = ChessArr[y1][x1];

    if(kill) ChessArr[y1][x1] = 0
    else ChessArr[y1][x1] = ChessArr[y2][x2];

    ChessArr[y2][x2] = temp;
}



var unitSelected;
var PositionTarget = [null, null];
////////////
function targetUnit(x, y) {
    let cellRow = Math.ceil(y/100) - 1;
    let cellCol = Math.ceil(x/100) - 1;

    const unit = ChessArr[cellRow][cellCol];
    if(step == 0) {
        if(unit != 0) {
            unitSelected = unit;
            PositionTarget= [cellCol, cellRow];
        }
        step = 1;
    } else if( step == 1) {
        let result = checkMove(unitSelected, PositionTarget[0], PositionTarget[1], cellCol, cellRow);
        
        if(result.move) swap(PositionTarget[0], PositionTarget[1], cellCol, cellRow, result.kill);

        
        step = 0;
        drawPlayGround(ChessArr);
    }
}




canvas.onclick = (event) => {
    const xPosition = Math.floor(window.innerWidth/2 - width/2);
    const yPosition = Math.floor(window.innerHeight/2 - height/2);

    const x = event.clientX - xPosition;
    const y = event.clientY - yPosition + 10;

    targetUnit(x, y);
}








///////main////////
function newGame() {
    drawPlayGround(ChessArr);
}
newGame();