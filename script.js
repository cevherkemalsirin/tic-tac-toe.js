const startBtn = document.querySelector(".StartGame");
const container = document.querySelector(".Container");
const boardContainer = document.querySelector(".boardContainer");
const nameInput1 = document.querySelector("#player1");
const nameInput2 = document.querySelector("#player2");

startBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(nameInput1.value && nameInput2.value)
    {
        container.classList.toggle("hidden");
        boardContainer.classList.toggle("hidden");
        GameController.InitGame();
    }

});

boardContainer.addEventListener("click", (e)=>{
    if(e.target.classList.contains("square"))
    {
        GameController.PlayTurn();
    }
})


 function Cell()
{
    /*
    const cellType = Object.freeze({
        X : "X",
        O : "O",
        empty : " "
    });*/

    const cellValue = " ";

    const GetValue = () => {cellValue;};

    const AssignValue = (mark) =>{ cellValue = mark;};

    return {GetValue, AssignValue}
}; 


const Gameboard = (function(){ 

    const board = new Array(3).fill().map(()=> new Array(3).fill(Cell().GetValue()));

    const gridNum = 3;

    const MarkBoard = (player, row, collumn) => {
        board[row][collumn].AssignValue(player.GetMark());
    };

//doin this way in case We need more than 3x3 grid otherwise we could just write 8 checks (2n+2) 2*3+2
    const checks = {
        rowStart : [],
        colStart : [],
        rowDirection:[],
        colDirection:[]
    };
    
    const FillChecks = () => {
        
        let checkNum = 0;
        // each Rows Checks from left to right
        for(let r = 0; r < gridNum; r++)
        {
            checks.rowStart[checkNum] = r;
            checks.colStart[checkNum] = 0;
            checks.rowDirection[checkNum] = 0;
            checks.colDirection[checkNum] = 1;
            checkNum++;
        }
        //each col checks from top to bottom
        for(let c = 0; c < gridNum; c++)
        {
            checks.rowStart[checkNum] = 0;
            checks.colStart[checkNum] = c;
            checks.rowDirection[checkNum] = 1;
            checks.colDirection[checkNum] = 0;
            checkNum++;
        }
        // right diagnol check
            checks.rowStart[checkNum] = 0;
            checks.colStart[checkNum] = 0;
            checks.rowDirection[checkNum] = 1;
            checks.colDirection[checkNum] = 1;
            checkNum++;
        // right diagnol check
            checks.rowStart[checkNum] = 0;
            checks.colStart[checkNum] = gridNum-1;
            checks.rowDirection[checkNum] = 1;
            checks.colDirection[checkNum] = -1;
            checkNum++;

        checks.checkNum = checkNum;
    };

    FillChecks();

    const GetBoard = () =>{board};

    return {
        GetBoard,
        MarkBoard,
        checks,
    };

})();
 

 function Player(name, mark)
{
    this.name = name;
    this.mark = mark;
};

const GameController = (function(){

    const players = [];
    const board = Gameboard.GetBoard();

    const InitPlayers = ()=>{
        const Player1 = new Player(nameInput1.value, "X");
        const Player2 = new Player(nameInput2.value, "O");
        players.push(Player1,Player2);
    };


    const InitGame = () =>{
        InitPlayers();
    };

    let currentPlayer = players[0];

    const GetCurrentPlayer = ()=>{
        currentPlayer;
    };
    
    const SwitchPlayers = () =>{
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const CheckWin = () => {
        const mark = currentPlayer.GetMark();
        const checks = board.checks;
        for (let c = 0; c < checks.checkNum; c++ )
        {
            //write checks here
        }

    };

    const PlayTurn = (row, col) =>{
        if(board[row][col] === " ")
        {
            board.MarkBoard(currentPlayer, row, col);
            CheckWin();
            SwitchPlayers();
        }
        else
        {

        }
    };

    return {InitGame, GetCurrentPlayer, SwitchPlayers, PlayTurn};

})();


function PlaceMark(theSquare)
{
    if(Game.currentPlayer)
    {
        theSquare.style.cssText = 'background-image: url("./images/X.png");background-position: center; background-size:250px 250px;background-repeat: no-repeat;';
    }
    else
    {
        theSquare.style.cssText = 'background-image: url("./images/O.png");background-position: center; background-size:150px 150px;background-repeat: no-repeat;';
    }
}

