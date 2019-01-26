//blokz 2.0

//Game loop: user-click1 -> user-click2 -> check swap, swap -> clear -> fall -> re-check (update matrix)

//GLOB:
var curr_blok, curr_blok_color;
var board, move_matrix;
var p_list = [[[0, 0], [0, 1], [0, 3]], [[0, 2], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 2]], [[0, 0], [1, 1], [1, 2]], [[0, 0], [0, 2], [0, 3]], [[0, 1], [0, 2], [1, 0]], [[0, 1], [1, 0], [1, 2]], [[0, 0], [0, 2],[1, 1]]];
var size = 8;
var score = 0;
var xyInc = 40;
var colors = ["blue", "yellow", "red", "brown", "purple", "green", "hotpink", "lime"];

//Setting up DOM elements
var bod = document.body;
var back = document.createElement("div");
var stylBlok = document.createElement("style");

//var stylScore = document.createElement("style");
var stylBack = document.createElement("style");
var scoreBoard = document.createElement("div"); scoreBoard.id = "score";

bod.appendChild(back);
var button = document.createElement("button");
button.style.width = "80px"; button.style.height = "60px";
button.textContent = "Click me!";
bod.appendChild(button);

//row, col => destination x and y indices
function match_check(color, row, col, checkable_copy){
    //Optimization: There might be one direction we don't have to check
    //  ->Also, check for redundant patterns
    var blok1, blok2, blok3;
    for(patt = 0; patt < 8; patt++){
        blok1 = checkable_copy[col+patternz[patt][0][1]][row+patternz[patt][0][0]].style.backgroundColor;
        blok2 = checkable_copy[col+patternz[patt][1][1]][row+patternz[patt][1][0]].style.backgroundColor;
        blok3 = checkable_copy[col+patternz[patt][2][1]][row+patternz[patt][2][0]].style.backgroundColor;
        if(blok1 == blok2 && blok1 == blok3 && blok1 != "white" && blok2 != "white" && blok3 != "white"){
            move_matrix[col+patternz[patt][0][1]][row+patternz[patt][0][0]] = 2;
        }else{
            blok1 = checkable_copy[col+patternz[patt][0][0]][row + patternz[patt][0][1]].style.backgroundColor;
            blok2 = checkable_copy[col+patternz[patt][1][0]][row + patternz[patt][1][1]].style.backgroundColor;
            blok3 = checkable_copy[col+patternz[patt][2][0]][row + patternz[patt][2][1]].style.backgroundColor;
            if(blok1 == blok2 && blok1 == blok3 && blok1 != "white" && blok2 != "white" && blok3 != "white"){

            }
        }
    }
}

//UTIL:
function swap(b1, b2){
    var b1_color = b1.style.backgroundColor;
    //if(b1_color == b2.style.backgroundColor) return false;
    
    //Do swap check (check rows and columns), do the symbolic swap, then do pattern check
    
    //Optimization: Embed indices in HTML
    var b1_yIndex = (parseInt(b1.style.top.slice(0, -2)) - 40) / xyInc;
    var b1_xIndex = (parseInt(b1.style.left.slice(0, -2)) - 40) / xyInc;
    var b2_yIndex = (parseInt(b2.style.top.slice(0, -2)) - 40) / xyInc;
    var b2_xIndex = (parseInt(b2.style.left.slice(0, -2)) - 40) / xyInc;
    var isSameCol = ((b1_yIndex + 1) == b2_yIndex || b1_yIndex - 1 == b2_yIndex);
    var isSameRow = ((b1_xIndex + 1) == b2_xIndex || b1_xIndex - 1 == b2_xIndex);
    if ((isSameCol || isSameRow) && (b1_yIndex == b2_yIndex || b1_xIndex == b2_xIndex)) {
        var board_copy = make_checkable_copy(true, b1_xIndex, b1_yIndex, b2_xIndex, b2_yIndex);
        var mc_return = match_check(b1_color, b1_xIndex, b1_yIndex, board_copy);
        if(mc_return != []){
            //Do swap if all checks return true
            var temp = board[b1_yIndex][b1_xIndex];//Again, let?
            board[b1_yIndex][b1_xIndex] = board[b2_yIndex][b2_xIndex];
            board[b2_yIndex][b2_xIndex] = temp;
        }
    } else {
        return false;
    }
}

function do_fall(){
    //omit animation
}

//
function update_move_matrix(){}

//
function game_over(){}

//c_blok: clicked "blok"
function user_click(c_blok){
    console.debug("user_click");
    c_blok.style.backgroundColor = "white";
}

function setup(newSize) {
    //Setup function vars
    var validXBlok = false; var validYBlok = false;
    var posx = 40; var posy = 40;
    var blokRow = []; var mat_row = [];
    var color, blok;
    //size = newSize;
    var backSize = 70 + (xyInc * size);

    //Checkability
    var blank_row = [];
    var blankBlok = document.createElement("div");
    blankBlok.hidden = false;
    blankBlok.style.backgroundColor = "white";
    blankBlok.style.width = xyInc + 'px';
    blankBlok.style.height = xyInc + 'px';
    for(inc = 0; inc < size+3; inc++){
        blank_row.push(blankBlok);
    }
    
    console.debug("setting DOM...");
    
    //Start the game (DOM elems)
    button.remove();
    scoreBoard.innerHTML = "Score: " + score;
    bod.appendChild(stylBlok);
    bod.appendChild(stylBack);
    bod.appendChild(back);
    back.id = "background";
    stylBlok.innerHTML = "#blok{width: 30px; height: 30px; position: absolute;}";
    stylBack.innerHTML = "#background{width: " + backSize + "px; height: " + backSize + "px; position: relative; background-color: black;}";
    
    //Setup the board
    board = [];
    move_matrix = [];

    console.debug("making the board...");

    for (col = 0; col < size; col++) {
        for (row = 0; row < size; row++) {
            blok = document.createElement("div");
            while (!validXBlok || !validYBlok) {
                color = colors[Math.floor((Math.random()) * 8)];
                if (row >= 2 && !validXBlok) {
                    if (blokRow[row - 1].style.backgroundColor != color) {
                        validXBlok = true;
                    } else if (blokRow[row - 2].style.backgroundColor != color) {
                        validXBlok = true;
                    }
                } else {
                    validXBlok = true;
                }
                if (col >= 2 && !validYBlok) {
                    if (board[col - 1][row].style.backgroundColor != color) {
                        validYBlok = true;
                    } else if (board[col - 2][row].style.backgroundColor != color) {
                        validYBlok = true;
                    }
                } else {
                    validYBlok = true;
                }
            }
            validXBlok = false;
            validYBlok = false;
            back.appendChild(blok);
            blok.id = "blok";
            blok.style.backgroundColor = color;
            blok.style.left = posx + 'px';
            blok.style.top = posy + 'px';
            posx += xyInc;
            blok.addEventListener("click", function () { user_click(this); });
            blokRow.push(blok);

            mat_row.push(0); //Matrix
        }
        //Checkable row
        blokRow.push(blankBlok); blokRow.push(blankBlok); blokRow.push(blankBlok);
        
        board.push(blokRow);
        blokRow = [];
        posy += xyInc;
        posx = 40;

        move_matrix.push(mat_row); //Matrix
        mat_row = [];
    }
    //Add extra invisible row with no "click"
    board.push(blank_row); board.push(blank_row); board.push(blank_row);

    bod.appendChild(scoreBoard);
    console.debug("all done!");
}

button.onclick = setup;