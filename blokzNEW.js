//board 2.0

//Game loop: user-click1 -> user-click2 -> check swap, swap -> clear -> fall -> re-check (update matrix)

//GLOB:
var blok;
var curr_blok = null, curr_pcolor = null;
var board = [];
var move_table=[], table_sum=0; //Update flag for move_table
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

//UTIL:
//Thanks SE!
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function check_for_moves(row, col){
    var blok1, blok2, blok3, mf=false; //mf => move found
    for(patt = 0; patt < 8; patt++){
        blok1 = board[col+p_list[patt][0][1]][row+p_list[patt][0][0]];
        blok2 = board[col+p_list[patt][1][1]][row+p_list[patt][1][0]];
        blok3 = board[col+p_list[patt][2][1]][row+p_list[patt][2][0]];
        if(blok1.gc() == blok2.gc() && blok1.gc() == blok3.gc() &&
         blok1.gc() != "white" && blok2.gc() != "white" && blok3.gc() != "white"){
            mf = true;
        }else{
            blok1 = board[col+p_list[patt][0][0]][row + p_list[patt][0][1]];
            blok2 = board[col+p_list[patt][1][0]][row + p_list[patt][1][1]];
            blok3 = board[col+p_list[patt][2][0]][row + p_list[patt][2][1]];
            mf = (blok1.gc() == blok2.gc() && blok1.gc() == blok3.gc() &&
             blok1.gc() != "white" && blok2.gc() != "white" && blok3.gc() != "white")
        }
        if(mf) return true;
    }
    return false;
}

function do_fall(){
    //omit animation
    //Clear move_table
    // for(c=0;c<size;c++){
    //     for(r=0;r<size;r++){
    //         if(move_table[c][r] == 1){
    //             board[c][r].sc("black");
    //         }
    //     }
    // }
    if(table_sum == 0){return;}
    var temp = true;
    var newCol; //new color
    var top = size;
    var inter = setInterval(goFall, 222);
    //Animate
    function goFall() {
        if (top == 0) {
            //temp = swapCheck();
            clearInterval(inter);
        }
        for (col = 0; col < top; col++) {
            for (row = 0; row < size; row++) {
                if (board[col][row].gc() == "black") {
                    if(move_table[col][row] == 0){
                        table_sum += 1;
                        console.debug(table_sum);
                        move_table[col][row] = 1;
                    }
                    newCol = "";
                    if (col == 0) {
                        //creates new random block and does swap
                        newCol = colors[Math.floor((Math.random()) * 6)];
                    } else {
                        //does swap
                        newCol = board[col - 1][row].gc();
                        board[col - 1][row].sc("black");
                    }
                    board[col][row].sc(newCol);
                }
            }
        }
        top -= 1;
        if(!temp){window.setTimeout(checkGO, 2000);}
    }
    //console.debug("done.");
}

//Checks to see if any >=3 in a row matches occurred
function match_check(row, col) {
    var mf = false;
    for (r = 1; r <= size-2; r++) {
        //console.debug(board[col][r-1].gc() + " " + board[col][r].gc() + " " + board[col][r+1].gc());
        if (board[col][r-1].gc() == board[col][r].gc() && board[col][r].gc() == board[col][r+1].gc()) {
            //move_table[col][r-1]=1; 
            board[col][r-1].sc("black");
            //move_table[col][r]=1; 
            board[col][r].sc("black");
            //move_table[col][r+1]=1;
            board[col][r+1].sc("black");
            mf=true;
        }
    }
    for(c=1;c<=size-2;c++){
        if (board[c-1][row].gc() == board[c][row].gc() && board[c][row].gc() == board[c+1][row].gc()) {
            //move_table[c-1][row]=1; 
            board[c-1][row].sc("black");
            //move_table[c][row]=1; 
            board[c][row].sc("black");
            //move_table[c+1][row]=1; 
            board[c+1][row].sc("black");
            mf=true;
        }
    }
    return mf;
}

function do_swap(b1, b2){
    let c1=b1.gc(),c2=b2.gc();
    b1.sc(c2); b2.sc(c1);
    console.debug("swapped " + c1 + " with " + c2 + ".");
}

//swap(): The function that handles the checks necissary to do blok swapping
//  and it return either false to indicate that a swap was not performed, or true.
//b2 -> swap candidate
function swap(b2){
    
    var b1 = curr_blok; //Too lazy to make the changes
    //if(curr_pcolor == b2.gc()) return false;
    var b1_yIndex = b1.gy(), b1_xIndex = b1.gx(), b2_yIndex = b2.gy(), b2_xIndex = b2.gx(); //Indices
    
    //Checking by storing bools
    var isSameCol = ((b1_yIndex + 1) == b2_yIndex || b1_yIndex - 1 == b2_yIndex);
    var isSameRow = ((b1_xIndex + 1) == b2_xIndex || b1_xIndex - 1 == b2_xIndex);
    if ((isSameCol || isSameRow) && (b1_yIndex == b2_yIndex || b1_xIndex == b2_xIndex)) {
        var mc_return1 = match_check(b2_xIndex, b2_yIndex), mc_return2 = match_check(b1_xIndex, b1_yIndex);
        return (mc_return1 || mc_return2);
    }
    return false;
}

//
function update_move_table(){
    var t;
    for(c=0;c<size;c++){
        for(r=0;r<size;r++){
            if(move_table[c][r] == 1){
                t = match_check(r, c);
                console.debug(c + " " + r);
                if(!t){
                    move_table[c][r]=0; table_sum -= 1;
                }
                
            }
        }
    }
}

//
function game_over(){}

//c_blok: clicked "blok"
function user_click(c_blok){
    console.debug(c_blok.gx() + " " + c_blok.gy());
    if(curr_blok != c_blok && curr_blok != null){   //Second click
        curr_blok.sc(curr_pcolor);
        do_swap(curr_blok, c_blok);
        var swap_ret = swap(c_blok);
        if(swap_ret){
            do_fall();
            while(table_sum > 0){
                update_move_table();
                do_fall();
            }
        }else{
            do_swap(curr_blok, c_blok)
        }
        curr_blok = null; curr_pcolor = null;
    }else if(curr_blok == c_blok){
        curr_blok.sc(curr_pcolor);
        curr_blok = null; curr_pcolor = null;
    }else{
        curr_blok = c_blok;
        curr_pcolor = c_blok.gc();
        c_blok.sc("white");   
    }
}

function setup(newSize) {
    //Setup function vars
    var validXBlok = false; var validYBlok = false;
    var posx = 40; var posy = 40;
    var blokRow = []; var mat_row = [];
    var color;
    //size = newSize;
    var backSize = 70 + (xyInc * size);

    //Checkability
    var blank_row = [];
    var blankBlok = document.createElement("div");
    blankBlok.hidden = false;
    blankBlok.style.backgroundColor = "white";
    blankBlok.style.width = xyInc + 'px';
    blankBlok.style.height = xyInc + 'px';
    blankBlok.gx = function () {return (parseInt(this.style.left.slice(0, -2)) - 40) / xyInc;};
    blankBlok.gy = function () {return (parseInt(this.style.top.slice(0, -2)) - 40) / xyInc;};
    blankBlok.gc = function () {return this.style.backgroundColor;};
    blankBlok.sc = function (c) {this.style.backgroundColor = c;};
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
    move_table = [];

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
            //Set up blok object with getter and setters
            blok.addEventListener("click", function () { user_click(this); });
            blok.gx = function () {return (parseInt(this.style.left.slice(0, -2)) - 40) / xyInc;};
            blok.gy = function () {return (parseInt(this.style.top.slice(0, -2)) - 40) / xyInc;};
            blok.gc = function () {return this.style.backgroundColor;};
            blok.sc = function (c) {this.style.backgroundColor = c;};
            blokRow.push(blok);

        }
        //Checkable row
        blokRow.push(blankBlok); blokRow.push(blankBlok); blokRow.push(blankBlok);
        
        board.push(blokRow);
        blokRow = [];
        posy += xyInc;
        posx = 40;

        move_table.push([0, 0, 0, 0, 0, 0, 0, 0]); //Matrix
        mat_row = [];
    }
    //Add extra invisible row with no "click"
    board.push(blank_row); board.push(blank_row); board.push(blank_row);

    bod.appendChild(scoreBoard);
    console.debug("all done!");
}

button.onclick = setup;