import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GameCard from "./GameCard";
import tictactoeimg from "../static/tictactoeimg.png";

const gamesdata = [
  {
    id: 1,
    title: "Tic Tac Toe",
    desc: "tic tac toe O/X",
    imgurl: tictactoeimg,
    pathid: "tictactoe"
  },
  {
    id: 2,
    title: "Minesweeper",
    desc: "Mine Sweeper",
    imgurl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Minesweeper_9x9_10_example_9.png",
    pathid: "minesweeper"
  },
  {
    id: 3,
    title: "2048",
    desc: "2048 guys",
    imgurl:
      "https://upload.wikimedia.org/wikipedia/commons/6/64/2048_Screenshot.png",
    pathid: "2048"
  },
  {
    id: 4,
    title: "Snake",
    desc: "Snake game",
    imgurl:
      "https://rembound.com/files/creating-a-snake-game-tutorial-with-html5/snake.png",
    pathid: "snake"
  },
  {
    id: 5,
    title: "Jigsaw puzzle",
    desc: "jigsaw puzzle guys",
    imgurl:
      "https://play-lh.googleusercontent.com/anJMXB7_WiTMgzU34qOgdGUTix7kUk-NZs8p2nvVIuzb7wT7w3kl9optJQ9-dnIAwBbf",
    pathid: "jigsawpuzzle"
  }
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(
      gamesdata.filter((gameData) => {
        return (gameData.title + " " + gameData.desc)
          .toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  }, [search]);
  return (
    <>
      <div>
        <nav className="navbar navbar-light bg-dark">
          <div className="container-fluid">
            <Link
              to="/"
              className="navbar-brand text-white"
              style={{ textDecoration: "none" }}
            >
              GamesWebsite
            </Link>

            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
        </nav>
      </div>
      <div className=" text-white">
        {data.length === 0 ? (
          <h1>No results found!</h1>
        ) : (
          <div className="p-4 d-flex justify-content-center flex-wrap">
            {data.map((gameData) => {
              return <GameCard key={gameData.id} data={gameData} />;
            })}
          </div>
        )}
      </div>
    </>
  );
}
