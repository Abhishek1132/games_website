import { useEffect, useState } from "react";
import "../../../styles/minesweeper.css";

const modeSettings = {
  easy: {
    rows: 8,
    cols: 8,
    mines: 10
  },
  medium: {
    rows: 16,
    cols: 16,
    mines: 40
  },
  hard: {
    rows: 32,
    cols: 16,
    mines: 99
  }
};

// const blockPropsTemp = {
//   visible: false,
//   mine: false,
//   flagged: false,
//   nearMines: 0,
//   defused: false
// };

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const uniqueRandomPositions = (r, c, n) => {
  let ans = [];

  let aval = [];

  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      let t = [i, j];
      aval.push(t);
    }
  }

  while (n > 0) {
    let r = getRandom(0, aval.length - 1);
    ans.push(aval[r]);
    aval.splice(r, 1);
    n--;
  }

  return ans;
};

const checkLeft = (grid, i, j) => {
  if (grid[i][j - 1]["mine"]) {
    return 1;
  }
  return 0;
};

const checkRight = (grid, i, j) => {
  if (grid[i][j + 1]["mine"]) {
    return 1;
  }
  return 0;
};

const checkTop = (grid, i, j) => {
  if (grid[i - 1][j]["mine"]) {
    return 1;
  }
  return 0;
};
const checkBottom = (grid, i, j) => {
  if (grid[i + 1][j]["mine"]) {
    return 1;
  }
  return 0;
};

const checkTopLeft = (grid, i, j) => {
  if (grid[i - 1][j - 1]["mine"]) {
    return 1;
  }
  return 0;
};
const checkTopRight = (grid, i, j) => {
  if (grid[i - 1][j + 1]["mine"]) {
    return 1;
  }
  return 0;
};

const checkBottomLeft = (grid, i, j) => {
  if (grid[i + 1][j - 1]["mine"]) {
    return 1;
  }
  return 0;
};
const checkBottomRight = (grid, i, j) => {
  if (grid[i + 1][j + 1]["mine"]) {
    return 1;
  }
  return 0;
};

const fillNearMines = (grid) => {
  let r = grid.length;
  let co = grid[0].length;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < co; j++) {
      //if mine
      if (grid[i][j]["mine"]) {
        continue;
      }

      let c = 0;

      //top-left
      if (i === 0 && j === 0) {
        c += checkRight(grid, i, j);
        c += checkBottom(grid, i, j);
        c += checkBottomRight(grid, i, j);

        grid[i][j]["nearMines"] = c;
        continue;
      }

      //top-right
      if (i === 0 && j === co - 1) {
        c += checkLeft(grid, i, j);
        c += checkBottom(grid, i, j);
        c += checkBottomLeft(grid, i, j);

        grid[i][j]["nearMines"] = c;
        continue;
      }

      //bottom-left
      if (i === r - 1 && j === 0) {
        c += checkTop(grid, i, j);
        c += checkRight(grid, i, j);
        c += checkTopRight(grid, i, j);

        grid[i][j]["nearMines"] = c;
        continue;
      }

      //bottom-right
      if (i === r - 1 && j === co - 1) {
        c += checkTop(grid, i, j);
        c += checkLeft(grid, i, j);
        c += checkTopLeft(grid, i, j);

        grid[i][j]["nearMines"] = c;
        continue;
      }

      //top
      if (i === 0) {
        c += checkLeft(grid, i, j);
        c += checkRight(grid, i, j);
        c += checkBottom(grid, i, j);
        c += checkBottomLeft(grid, i, j);
        c += checkBottomRight(grid, i, j);

        grid[i][j]["nearMines"] = c;
        continue;
      }

      //left
      if (j === 0) {
        c += checkTop(grid, i, j);
        c += checkRight(grid, i, j);
        c += checkBottom(grid, i, j);
        c += checkTopRight(grid, i, j);
        c += checkBottomRight(grid, i, j);

        grid[i][j]["nearMines"] = c;
        continue;
      }

      //right
      if (j === co - 1) {
        c += checkTop(grid, i, j);
        c += checkLeft(grid, i, j);
        c += checkBottom(grid, i, j);
        c += checkTopLeft(grid, i, j);
        c += checkBottomLeft(grid, i, j);

        grid[i][j]["nearMines"] = c;
        continue;
      }

      //bottom
      if (i === r - 1) {
        c += checkTop(grid, i, j);
        c += checkLeft(grid, i, j);
        c += checkRight(grid, i, j);
        c += checkTopLeft(grid, i, j);
        c += checkTopRight(grid, i, j);

        grid[i][j]["nearMines"] = c;
        continue;
      }

      //middle
      c += checkTop(grid, i, j);
      c += checkLeft(grid, i, j);
      c += checkRight(grid, i, j);
      c += checkBottom(grid, i, j);
      c += checkTopLeft(grid, i, j);
      c += checkTopRight(grid, i, j);
      c += checkBottomLeft(grid, i, j);
      c += checkBottomRight(grid, i, j);

      grid[i][j]["nearMines"] = c;
    }
  }
};

const openMines = (grid, si, sj) => {
  grid[si][sj]["visible"] = true;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j]["mine"]) {
        grid[i][j]["visible"] = true;
        if (grid[i][j]["flagged"]) {
          grid[i][j]["defused"] = true;
        }
      }
    }
  }
};

const blockExists = (grid, i, j) => {
  const lr = grid.length - 1;
  const lc = grid[0].length - 1;
  if (i < 0 || j < 0 || i > lr || j > lc) {
    return false;
  }
  return true;
};

const openBlock = (grid, i, j) => {
  if (grid[i][j]["visible"]) {
    return;
  }

  if (grid[i][j]["nearMines"] > 0) {
    grid[i][j]["visible"] = true;
    return;
  }

  grid[i][j]["visible"] = true;

  //top-left
  if (blockExists(grid, i - 1, j - 1)) {
    openBlock(grid, i - 1, j - 1);
  }

  //top
  if (blockExists(grid, i - 1, j)) {
    openBlock(grid, i - 1, j);
  }

  //top-right
  if (blockExists(grid, i - 1, j + 1)) {
    openBlock(grid, i - 1, j + 1);
  }

  //right
  if (blockExists(grid, i, j + 1)) {
    openBlock(grid, i, j + 1);
  }

  //bottom-right
  if (blockExists(grid, i + 1, j + 1)) {
    openBlock(grid, i + 1, j + 1);
  }

  //bottom
  if (blockExists(grid, i + 1, j)) {
    openBlock(grid, i + 1, j);
  }

  //bottom-left
  if (blockExists(grid, i + 1, j - 1)) {
    openBlock(grid, i + 1, j - 1);
  }

  //left
  if (blockExists(grid, i, j - 1)) {
    openBlock(grid, i, j - 1);
  }
};

const checkGameWon = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (!grid[i][j]["mine"] && !grid[i][j]["visible"]) {
        return 0;
      }
    }
  }
  return 1;
};

const defuseMines = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j]["mine"]) {
        grid[i][j]["defused"] = true;
      }
    }
  }
};

export default function Minesweeper() {
  const [gameMode, setGameMode] = useState("easy");
  const [gameStatus, setGameStatus] = useState(0);
  const [grid, setGrid] = useState([]);
  const [flags, setFlags] = useState(modeSettings[gameMode]["mines"]);

  const initializeGrid = () => {
    const r = modeSettings[gameMode]["rows"];
    const c = modeSettings[gameMode]["cols"];
    const m = modeSettings[gameMode]["mines"];

    let randPos = uniqueRandomPositions(r, c, m);

    let newGrid = Array(r);
    for (let i = 0; i < r; i++) {
      let temp = Array(c);
      for (let j = 0; j < c; j++) {
        let blockProps = {
          visible: false,
          mine: false,
          flagged: false,
          nearMines: 0,
          defused: false
        };

        temp[j] = blockProps;
      }
      newGrid[i] = temp;
    }

    //fill mines
    for (let i = 0; i < randPos.length; i++) {
      const ri = randPos[i][0];
      const cj = randPos[i][1];

      newGrid[ri][cj]["mine"] = true;
    }

    fillNearMines(newGrid);

    setGrid(newGrid);
  };

  const handleClick = (event) => {
    if (gameStatus === -1 || gameStatus === 1) {
      return;
    }
    const { id } = event.target;
    const indexes = id.split("-");
    const i = parseInt(indexes[0], 10);
    const j = parseInt(indexes[1], 10);

    if (grid[i][j]["visible"]) {
      return;
    }

    let newGrid = JSON.parse(JSON.stringify(grid));

    if (event.button === 2 || newGrid[i][j]["flagged"]) {
      if (newGrid[i][j]["flagged"]) {
        newGrid[i][j]["flagged"] = false;
        setFlags(flags + 1);
      } else if (!newGrid[i][j]["flagged"] && flags > 0) {
        newGrid[i][j]["flagged"] = true;
        setFlags(flags - 1);
      }
      setGrid(newGrid);

      return;
    }

    if (grid[i][j]["mine"]) {
      openMines(newGrid, i, j);
      setGrid(newGrid);
      setGameStatus(-1);
      return;
    }

    openBlock(newGrid, i, j);

    if (checkGameWon(newGrid) === 1) {
      defuseMines(newGrid);
      setGameStatus(1);
    }

    setGrid(newGrid);
  };

  const restartGame = () => {
    setGameStatus(0);
    setFlags(modeSettings[gameMode]["mines"]);
    initializeGrid();
  };

  const changeGameMode = (event) => {
    setGameMode(event.target.value);
  };

  useEffect(() => {
    restartGame();
  }, [gameMode]);

  return (
    <div className="g2-game-container">
      <span>
        <select value={gameMode} onChange={changeGameMode}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </span>
      <span>
        {gameStatus === -1 ? "Game Over!" : gameStatus === 1 ? "Game Won!" : ""}
      </span>
      <span>
        <button onClick={restartGame}>Restart</button>
      </span>
      <span>Flags: {flags}</span>
      <div
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      >
        <table border={1} cellSpacing={0} cellPadding={1}>
          <tbody>
            {grid.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((ele, j) => {
                    return (
                      <td key={i * 10 + j}>
                        <div
                          className={!ele["visible"] ? "unknown" : ""}
                          id={i + "-" + j}
                          style={{
                            textAlign: "center",
                            width: "25px",
                            height: "25px",
                            backgroundColor: ele["defused"]
                              ? "green"
                              : ele["flagged"]
                              ? "orange"
                              : ele["mine"] && gameStatus !== 0
                              ? "red"
                              : ""
                          }}
                          onMouseDown={handleClick}
                        >
                          {ele["mine"] && ele["visible"]
                            ? "x"
                            : ele["nearMines"] > 0 && ele["visible"]
                            ? ele["nearMines"]
                            : " "}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
