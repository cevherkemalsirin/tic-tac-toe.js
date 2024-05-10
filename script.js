const startBtn = document.querySelector(".StartGame");
const replayBtn = document.querySelector(".replayBtn");
const container = document.querySelector(".Container");
const boardContainer = document.querySelector(".boardContainer");
const alertText  = document.querySelector(".alert");
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

replayBtn.addEventListener("click", ()=>{
    GameController.Replay();
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
    let board = [];
//fill the board
    const ResetBoard = () =>{
        board = [];
        for (let r = 0; r < gridNum; r++) {
            const row = [];
            for (let c = 0; c < gridNum; c++) {
                row.push(Cell());
            }
            board.push(row);
        }
    };

    ResetBoard();

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
        ResetBoard,
    };

})();
 

 function Player(name, mark)
{
    this.name = name;
    this.mark = mark;
};

const GameController = (function(){

    const players = [];
    let board = Gameboard.GetBoard();
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
            const winnerIndex = [];
            if(board[r][c].GetValue() === " ") continue;

            for(let x = 0; x < n; x++)
            {
                if(mark === board[r][c].GetValue())
                {
                    winnerIndex.push((r*n + c) + 1);
                    count++;
                    r += rd;
                    c += cd;
                }
                else
                {
                    break;
                }
            }
            console.log(count);
            if(count ===  n)
            {  
                for(let i = 0; i <n; i++)
                    {
                        const wonCell = document.querySelector(`.square[data-num="${winnerIndex[i]}"]`);
                        ScreenController.ChangeCellBackground(wonCell,"rgb(0, 158, 8)");
                    }
                return true;
            }
            //whole grid is full

        }
        return false;
    }; 


    const PlayTurn = (index) =>{
        let row = Math.floor(index / n);
        let col = index % n;
       
        if(board[row][col].GetValue()  === " ")
        {
            steps++;
            Gameboard.MarkBoard(currentPlayer, row, col);
            if(CheckWin())
            {
                alertText.textContent = `${currentPlayer.name} has won!!!`;
                ScreenController.SetCanClick(false);
            }
            else if(steps === n*n)
            {
                alertText.textContent = `TIE, Noone Won !!!`;
                ScreenController.SetCanClick(false);
            }
            SwitchPlayers();
            return true;
        }
        else
        {
            return false;
        }
    };


    const Replay = () => {
        steps = 0;
        Gameboard.ResetBoard();
        board = Gameboard.GetBoard();
        ScreenController.ResetScreen();
        ScreenController.SetCanClick(true);
        alertText.textContent = "";
    };

    return {InitGame, GetCurrentPlayer, SwitchPlayers, PlayTurn, Replay};

})();


const ScreenController = (function ()
{
    let board = Gameboard.GetBoard();
    let currentCellElement = null;
    let canClick = true;

    const SetCanClick = (isClickable) =>
    {
        canClick = isClickable;
    };


    const PlaceMark = (theSquare) =>
    {
        if(canClick)
        {
            currentCellElement = theSquare;
            let index = Number(currentCellElement.getAttribute("data-num")) - 1;
        //returns true if we were able to put a mark there

            if(!GameController.PlayTurn(index))
            {
                AlertScreen("The Place is Already Taken!!!", 1000);
            }
        }


    }

    const ResetScreen = () =>{
        let n = Gameboard.GetGridNum();
        for(let r = 0; r<n; r++)
            {
                for(let c=0; c<n; c++)
                    {
                        board = Gameboard.GetBoard();
                        let index = (r * n) + c + 1;
                        currentCellElement = document.querySelector(`.square[data-num="${index}"`);
                        console.log(board[r][c].GetValue());
                        MarkCellWith(board[r][c].GetValue());
                    }
            }
    };

    const ChangeCellBackground = (cell,color) =>
    {
        cell.style.backgroundColor = color;
    };
    
    const AlertScreen = (message, miliSecondsText) => {
            ChangeCellBackground(currentCellElement,"rgb(158, 0, 8)");
            setTimeout(()=>{ currentCellElement.style.backgroundColor = "transparent";}, 200);   
            alertText.textContent = message;
            setTimeout(()=>{ alertText.textContent = "";}, miliSecondsText);   
    };

    const MarkCellWith = (mark) =>
    {
       
        if(mark === "X")
        {
            
            currentCellElement.style.cssText = 'background-image: url("./images/X.png");background-position: center; background-size:250px 250px;background-repeat: no-repeat;';
           
        }
        else if(mark === "O")
        {
            currentCellElement.style.cssText = 'background-image: url("./images/O.png");background-position: center; background-size:150px 150px;background-repeat: no-repeat;';
        }
        else{
            currentCellElement.style.cssText = "";
        }
    };

    return {ResetScreen,
            PlaceMark,
            MarkCellWith,
            ChangeCellBackground,
            SetCanClick,
    };
})();




