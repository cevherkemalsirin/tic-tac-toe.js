const startBtn = document.querySelector(".StartGame");
const container = document.querySelector(".Container");

startBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    container.classList.toggle("hidden");
});

const Gameboard = (function(){ 
    const square = Object.freeze({
        X : "X",
        O : "O",
        empty : " "
    });
    return {
        board : new Array(3).fill().map(()=> new Array(3).fill(square.X)),
        square
    };
})();
 

function Person(name, marker)
{
    return {name,marker};
}

