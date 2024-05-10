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
        console.log(e.target);
        ScreenController.PlaceMark(e.target);
    }
});


 function Cell()
{
    let cellValue = " ";

    const GetValue = () => { return cellValue;};

    const AssignValue = (mark) =>{ cellValue = mark;};

    return {GetValue, AssignValue}
}; 


const Gameboard = (function(){ 

    const gridNum = 3;
    const board = [];
//fill the board
    for (let r = 0; r < gridNum; r++) {
        const row = [];
        for (let c = 0; c < gridNum; c++) {
            row.push(Cell());
        }
        board.push(row);
    }

    const GetGridNum = () => {return gridNum;};

    const MarkBoard = (player, row, collumn) => {
        board[row][collumn].AssignValue(player.mark);
        ScreenController.MarkCellWith(GameController.GetCurrentPlayer().mark);
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

    const GetBoard = () =>{return board};
 
    return {
        GetBoard,
        MarkBoard,
        checks,
        GetGridNum,

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
    let currentPlayer = null;

    let steps = 0;
    const n = Gameboard.GetGridNum(); 
    const InitPlayers = ()=>{
        const Player1 = new Player(nameInput1.value, "X");
        const Player2 = new Player(nameInput2.value, "O");
        players.push(Player1,Player2);
    };


    const InitGame = () =>{
        InitPlayers();
        currentPlayer = players[0];
    };

      

    const GetCurrentPlayer = ()=>{
      return  currentPlayer;
    };
    
    const SwitchPlayers = () =>{
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const CheckWin = () => {
        const mark = currentPlayer.mark;
        const checks = Gameboard.checks;

        for (let x = 0; x < checks.checkNum; x++)
        {
            let r = checks.rowStart[x], c = checks.colStart[x], rd = checks.rowDirection[x], cd = checks.colDirection[x];
            let count = 0;
            if(board[r][c].GetValue() === " ") continue;

            for(let steps = 0; steps < n; steps++)
            {
                if(mark === board[r][c])
                {
                    count++;
                    r += rd;
                    c += cd;
                }
                else
                {
                    break;
                }
            }

            if(count ===  n)
            {
                console.log(currentPlayer + " Has won ");
                return true;
            }
            //whole grid is full
           if(steps === n ** 2)
           {
            console.log( "it is tie ");
            return true;
           }
        }
        return false;
    }; 


    const PlayTurn = (index) =>{
        let row = Math.floor(index / n);
        let col = index % n;
       
        if(board[row][col].GetValue()  === " ")
        {
            steps++;
            console.log("steps");
            Gameboard.MarkBoard(currentPlayer, row, col);
            ScreenController.UpdateScreen();
            if(CheckWin())
            {
                //do winning
            }
            SwitchPlayers();
            return true;
        }
        else
        {
            return false;
        }
    };

    return {InitGame, GetCurrentPlayer, SwitchPlayers, PlayTurn};

})();


const ScreenController = (function ()
{

const board = Gameboard.GetBoard();
let currentCellElement = null;
    const PlaceMark = (theSquare) =>
    {
        currentCellElement = theSquare;
        //returns true if we were able to put a mark there
        let index = Number(currentCellElement.getAttribute("data-num")) - 1;
       // console.log(index);
        if(GameController.PlayTurn(index))
        {
           
        }
        else
        {
            
        }
    }

    const UpdateScreen = (theSquare) =>{
    };

    const MarkCellWith = (mark) =>
    {
        console.log(mark);
        if(mark === "X")
        {
            
            currentCellElement.style.cssText = 'background-image: url("./images/X.png");background-position: center; background-size:250px 250px;background-repeat: no-repeat;';
           
        }
        else
        {
            currentCellElement.style.cssText = 'background-image: url("./images/O.png");background-position: center; background-size:150px 150px;background-repeat: no-repeat;';
        }
    };

    return {UpdateScreen,
            PlaceMark,
            MarkCellWith
    };
})();




