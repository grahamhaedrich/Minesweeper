document.addEventListener('DOMContentLoaded', () => {

const TOTAL_SQUARES = 900;
const BOARD_DIM = 30; //board is 30 by 30 squares
const TOTAL_MINES = 120;

let squares_revealed = 0;

function Square(row, col, surrounding_mines, revealed, flagged, mine)
{
  return {
    row: row,
    col: col,
    surrounding_mines: surrounding_mines,
    flagged: flagged,
    revealed: revealed,
    mine: mine
  };
}

//creating the board
let board = [];
let square_num = 0;
for(let row = 0; row < BOARD_DIM; row++)
{
  for(let col = 0; col < BOARD_DIM; col++)
  {
    board[square_num] = Square(row, col, 0, false, false, false);
    const square = document.createElement("div");
    square.setAttribute("id", square_num);
    document.querySelector(".grid").appendChild(square);

    square.addEventListener("click", function() {
      leftClick(square);
    })

    square.oncontextmenu = function(e) {
      e.preventDefault();
      rightClick(square);
    }

    square_num++;
  }
}

//finding squares around a given square
function surroundingSquares(row, col)
{
  let surrounding = [];
  for(let i = row - 1; i <= row + 1; i++)
  {
    for(let j = col - 1; j <= col + 1; j++)
    {
      if(i >= 0 && i < BOARD_DIM && j >= 0 && j < BOARD_DIM && !(i == row && j == col))
      {
        let index = i * BOARD_DIM + j; //getting index from row and col
        surrounding.push(index);
      }
    }
  }
  return surrounding;
}

//placing mines
let mine_count = 0;
while(mine_count < TOTAL_MINES)
{
  let random_spot = Math.floor(Math.random() * TOTAL_SQUARES);
  if(board[random_spot].mine == false)
  {
    board[random_spot].mine = true;
    mine_count++;

    //increasing the surrounding mines accordingly for each square
    let surrounding_squares = surroundingSquares(board[random_spot].row, board[random_spot].col);
    for(let square = 0; square < surrounding_squares.length; square++)
        board[surrounding_squares[square]].surrounding_mines += 1;
  }
}

function emptySquares(id, empty_squares)
{
  let surrounding_squares = surroundingSquares(board[id].row, board[id].col);
  empty_squares.push(...surrounding_squares);

  for(let square = 0; square < surrounding_squares.length; square++)
  {
    if(board[surrounding_squares[square]].surrounding_mines == 0
      && !board[surrounding_squares[square]].mine
      && !board[surrounding_squares[square]].revealed)
    {
      board[surrounding_squares[square]].revealed = true;
      squares_revealed++;
      emptySquares(surrounding_squares[square], empty_squares);
    }
  }
  return empty_squares;
}

function revealSquares(surrounding_mines, square_num)
{
  if(!board[square_num].revealed)
  {
    board[square_num].revealed = true;
    squares_revealed++;
  }

  if(board[square_num].mine == true)
    document.getElementById(square_num).classList.add("mine");
  else if(surrounding_mines == 0)
    document.getElementById(square_num).classList.add("empty");
  else if (surrounding_mines == 1)
    document.getElementById(square_num).classList.add("one");
  else if (surrounding_mines == 2)
    document.getElementById(square_num).classList.add("two");
  else if (surrounding_mines == 3)
    document.getElementById(square_num).classList.add("three");
  else if (surrounding_mines == 4)
    document.getElementById(square_num).classList.add("four");
  else if (surrounding_mines == 5)
    document.getElementById(square_num).classList.add("five");
  else if (surrounding_mines == 6)
    document.getElementById(square_num).classList.add("six");
  else if (surrounding_mines == 7)
    document.getElementById(square_num).classList.add("seven");
  else
    document.getElementById(square_num).classList.add("eight");
}


function leftClick(square)
{
  let id = square.id;
  let surrounding = board[id].surrounding_mines;
  console.log(squares_revealed);

  if(!board[id].flagged && !board[id].revealed && surrounding == 0)
  {
    document.getElementById(id).classList.add("empty");
    let empty_squares = [];
    emptySquares(id, empty_squares);

    for(let square = 0; square < empty_squares.length; square++)
        revealSquares(board[empty_squares[square]].surrounding_mines, empty_squares[square]);
  }

  revealSquares(surrounding, id);

  if(squares_revealed == TOTAL_SQUARES - TOTAL_MINES)
  {
    gameOver(true); //win
  }
  else if(board[id].mine && !board[id].flagged)
  {
    gameOver(false); //loss
  }
}

function rightClick(square)
{
  let id = square.id;

  if(board[id].flagged == false)
  {
    board[id].flagged = true;
    document.getElementById(id).classList.add("flagged");
  }
  else
  {
    board[id].flagged = false;
    document.getElementById(id).classList.remove("flagged");
  }
}

function gameOver(outcome)
{

  for(let square = 0; square < TOTAL_SQUARES; square++) //reveal whole board
  {
    document.getElementById(square).classList.remove("flagged");
    revealSquares(board[square].surrounding_mines, square);
  }

  if(outcome)
    alert("YOU WIN!");
  else
    alert("YOU LOST!");
}

})
