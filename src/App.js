import React, { Fragment, useState } from 'react';

function Square({ value, onSquareClick, isWinner }) {
  const className = `square ${isWinner ? 'winner' : ''}`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export function Board({ xIsNext, squares, currentMove, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = 'X') : (nextSquares[i] = 'O');
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner ${winner}`;
    console.log(winningSquares);
  } else {
    if (currentMove < 9) status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    else status = `It's a draw!`;
  }

  return (
    <Fragment>
      <div className='status'>{status}</div>
      <div className='board'>
        {[0, 1, 2].map((row) => (
          <div key={row} className='board-row'>
            {[0, 1, 2].map((col) => {
              const i = row * 3 + col;
              const isWinner = winningSquares.includes(i);
              return (
                <Square
                  key={i}
                  value={squares[i]}
                  onSquareClick={() => handleClick(i)}
                  isWinner={isWinner}
                />
              );
            })}
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Move #${move}`;
    } else {
      description = 'Move #0';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className='game'>
      <div className='hame-board'>
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          currentMove={currentMove}
          onPlay={handlePlay}
        />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

let winningSquares = [];
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winningSquares = lines[i];
      return squares[a];
    }
  }

  return null;
}

/*
TODO:
1. For the current move only, show “You are at move #…” instead of a button.
2. Rewrite Board to use two loops to make the squares instead of hardcoding them. //--DONE
3. Add a toggle button that lets you sort the moves in either ascending or descending order.
4. When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw). //--DONE
5. Display the location for each move in the format (row, col) in the move history list.
*/
