import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Link to="/game/tictactoe">Tic Tac Toe</Link>
      <br />
      <Link to="/game/jigsawpuzzle">Jigsaw Puzzle</Link>
      <br />
      <Link to="/game/snake">Snake</Link>
      <br />
      <Link to="/game/minesweeper">Minesweeper</Link>
      <br />
      <Link to="/game/2048">2048</Link>
    </div>
  );
}
