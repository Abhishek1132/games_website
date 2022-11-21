import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Tictactoe from "./components/game/tictactoe/Tictactoe";
import Jigsawpuzzle from "./components/game/jigsawpuzzle/Jigsawpuzzle";
import Snake from "./components/game/snake/Snake";
import Minesweeper from "./components/game/minesweeper/Minesweeper";
import Game2048 from "./components/game/2048/Game2048";

export default function MyRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/game/tictactoe" exact element={<Tictactoe />} />
        <Route path="/game/minesweeper" exact element={<Minesweeper />} />
        <Route path="/game/jigsawpuzzle" exact element={<Jigsawpuzzle />} />
        <Route path="/game/snake" exact element={<Snake />} />
        <Route path="/game/2048" exact element={<Game2048 />} />
      </Routes>
    </div>
  );
}
