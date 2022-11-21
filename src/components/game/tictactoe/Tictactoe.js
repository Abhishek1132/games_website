import "../../../styles/tictactoe.css";

import { useState, useEffect } from "react";
import { StyleRoot, keyframes } from "radium";
import { fadeIn, zoomIn } from "react-animations";
import { Link } from "react-router-dom";

const zoomInAnimation = {
  animation: ".5s 0s 1",
  animationName: keyframes(zoomIn, "zoomIn")
};

const fadeInAnimation = {
  animation: "1s 0s 1",
  animationName: keyframes(fadeIn, "fadeIn")
};

const copy = (arr) => {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    let temp = [];
    for (let j = 0; j < arr[i].length; j++) {
      temp[j] = arr[i][j];
    }
    newArr[i] = temp;
  }

  return newArr;
};

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const checkDraw = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 0) {
        return false;
      }
    }
  }

  return true;
};

const checkWin = (grid) => {
  //horizontal
  for (let i = 0; i < grid.length; i++) {
    if (
      grid[i][0] === grid[i][1] &&
      grid[i][2] === grid[i][1] &&
      grid[i][0] !== 0
    ) {
      return grid[i][1];
    }
  }

  //vertical
  for (let j = 0; j < grid.length; j++) {
    if (
      grid[0][j] === grid[1][j] &&
      grid[0][j] === grid[2][j] &&
      grid[0][j] !== 0
    ) {
      return grid[0][j];
    }
  }

  //diagonal-1
  if (
    grid[0][0] === grid[1][1] &&
    grid[0][0] === grid[2][2] &&
    grid[0][0] !== 0
  ) {
    return grid[0][0];
  }

  //diagonal-2
  if (
    grid[0][2] === grid[1][1] &&
    grid[0][2] === grid[2][0] &&
    grid[0][2] !== 0
  ) {
    return grid[0][2];
  }

  return -1;
};

const scores = {
  "1": -1,
  "2": 1
};

const minimax = (grid, depth, maxiPlayer) => {
  let result = checkWin(grid);
  if (result !== -1) {
    return scores[result];
  }
  if (checkDraw(grid)) {
    return 0;
  }

  if (maxiPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 0) {
          grid[i][j] = 2;
          let score = minimax(grid, depth + 1, false);
          grid[i][j] = 0;
          bestScore = Math.max(bestScore, score);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 0) {
          grid[i][j] = 1;
          let score = minimax(grid, depth + 1, true);
          grid[i][j] = 0;
          bestScore = Math.min(bestScore, score);
        }
      }
    }
    return bestScore;
  }
};

const initGrid = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

export default function Tictactoe() {
  const [grid, setGrid] = useState([[]]);
  const [player, setPlayer] = useState(1);
  const [count, setCount] = useState(0);
  const [gameMode, setGameMode] = useState(3);
  const [win, setWin] = useState(false);
  const [draw, setDraw] = useState(false);
  const [tid, setTid] = useState(null);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  const changeGameMode = (event) => {
    const mode = parseInt(event.target.value, 10);
    setGameMode(mode);
  };

  const restartGame = () => {
    clearTimeout(tid);
    setDraw(false);
    setWin(false);
    setGrid(copy(initGrid));
    setPlayer(1);
    setCount(0);
  };

  const checkGameStatus = (newGrid) => {
    let winner = checkWin(newGrid);
    if (winner !== -1) {
      setWin(true);
      if (winner === 1) {
        setScoreX(scoreX + 1);
      } else {
        setScoreO(scoreO + 1);
      }
      return;
    }

    if (checkDraw(newGrid)) {
      setDraw(true);
      return;
    }

    if (player === 1) {
      setPlayer(2);
    } else {
      setPlayer(1);
    }

    setCount(count + 1);
  };

  const cpuVeryEasy = () => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 0) {
          let newGrid = copy(grid);
          newGrid[i][j] = 2;
          setGrid(newGrid);

          checkGameStatus(newGrid);

          return;
        }
      }
    }
  };

  const cpuEasy = () => {
    let avail = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 0) {
          avail.push([i, j]);
        }
      }
    }

    let x = getRandom(0, avail.length - 1);

    let newGrid = copy(grid);
    newGrid[avail[x][0]][avail[x][1]] = player;
    setGrid(newGrid);

    checkGameStatus(newGrid);
  };

  const cpuMedium = () => {
    const ran = getRandom(1, 100);
    if (count <= 3) {
      cpuImpossible();
    } else if (ran <= 50) {
      cpuImpossible();
    } else {
      cpuEasy();
    }
  };

  const cpuHard = () => {
    const ran = getRandom(1, 100);
    if (count <= 5) {
      cpuImpossible();
    } else if (ran <= 50) {
      cpuImpossible();
    } else {
      cpuEasy();
    }
  };

  const cpuImpossible = () => {
    let temp = copy(grid);
    let bestScore = -Infinity;
    let bestMove = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 0) {
          temp[i][j] = 2;
          let score = minimax(temp, 0, false);
          temp[i][j] = 0;
          if (score > bestScore) {
            bestScore = score;
            bestMove = [i, j];
          }
        }
      }
    }

    let newGrid = copy(grid);
    newGrid[bestMove[0]][bestMove[1]] = 2;
    setGrid(newGrid);

    checkGameStatus(newGrid);
  };

  const cpuPlay = () => {
    if (win || draw) {
      return;
    }

    //Very Easy Mode
    if (gameMode === 1) {
      cpuVeryEasy();
    }

    //Easy Mode
    else if (gameMode === 2) {
      cpuEasy();
    }

    //Medium Mode
    else if (gameMode === 3) {
      cpuMedium();
    }

    //Hard Mode
    else if (gameMode === 4) {
      cpuHard();
    }

    //Impossible Mode
    else if (gameMode === 5) {
      cpuImpossible();
    }
  };

  const userPlay = (event) => {
    if (win || draw) {
      return;
    }

    if (gameMode > 0 && player === 2) {
      return;
    }

    const blockid = event.target.id;

    const rowNo = parseInt(blockid[1], 10);
    const colNo = parseInt(blockid[2], 10);

    if (grid[rowNo][colNo] !== 0) {
      return;
    }

    let newGrid = copy(grid);
    newGrid[rowNo][colNo] = player;
    setGrid(newGrid);

    checkGameStatus(newGrid);
  };

  let playerSymb = player === 1 ? "X" : "O";

  useEffect(() => {
    setGrid(copy(initGrid));
    setPlayer(1);
  }, []);

  useEffect(() => {
    if (gameMode > 0 && player === 2) {
      let temp = setTimeout(cpuPlay, 400);
      setTid(temp);
    }
  }, [player, win, draw]);

  useEffect(() => {
    restartGame();
  }, [gameMode]);

  return (
    <StyleRoot>
      <div className="g1-main-container">
        <div className="g1-game-title" style={fadeInAnimation}>
          Tic-Tac-Toe
        </div>
        <select
          className="g1-game-mode"
          name="gamemode"
          value={gameMode}
          onChange={changeGameMode}
        >
          <option value="0">2 Players</option>
          <option value="1">CPU (Very Easy)</option>
          <option value="2">CPU (Easy)</option>
          <option value="3">CPU (Medium)</option>
          <option value="4">CPU (Hard)</option>
          <option value="5">CPU (Impossible)</option>
        </select>
        <div className="g1-game-container" style={zoomInAnimation}>
          <div className="g1-player-turn">
            <div
              className={
                "g1-scorex " + (player === 1 ? "g1-score-highlight" : "")
              }
            >
              <span>X</span>{" "}
              <span style={{ color: "white" }}>
                {scoreX === 0 ? "-" : scoreX}
              </span>
            </div>{" "}
            <div
              className={
                "g1-scoreo " + (player === 2 ? "g1-score-highlight" : "")
              }
            >
              <span>O</span>{" "}
              <span style={{ color: "white" }}>
                {scoreO === 0 ? "-" : scoreO}
              </span>
            </div>
          </div>
          {grid.map((row, i) => {
            return (
              <div key={i} className="g1-row">
                {row.map((ele, j) => (
                  <span
                    key={i * 10 + j}
                    id={"b" + i + "" + j}
                    className={
                      "g1-block " + (!win && ele === 0 ? "g1-block-hover" : "")
                    }
                    style={[
                      zoomInAnimation,
                      ele === 1 ? { color: "red" } : { color: "orange" }
                    ]}
                    onClick={userPlay}
                  >
                    {" "}
                    {ele === 0 ? " " : ele === 1 ? "X" : "O"}
                  </span>
                ))}
              </div>
            );
          })}
          <div
            className={win || draw ? "g1-game-status" : "hide"}
            style={
              draw
                ? { backgroundColor: "var(--g1draw)" }
                : win && player === 2 && gameMode > 0
                ? { backgroundColor: "var(--g1failure)" }
                : {}
            }
          >
            <span
              className="g1-player-symbol"
              style={player === 1 ? { color: "red" } : { color: "orange" }}
            >
              {win && playerSymb}
            </span>{" "}
            &nbsp;
            {win && "Won!"}
            {draw && "Match Draw!"}
          </div>
          <div className="g1-controls">
            <Link to="/">
              <button id="g1-home-btn">Home</button>
            </Link>

            <button id="g1-restart-btn" onClick={restartGame}>
              Restart
            </button>
          </div>
        </div>
      </div>
    </StyleRoot>
  );
}
