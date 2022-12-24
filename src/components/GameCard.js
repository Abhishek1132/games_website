import { Link } from "react-router-dom";

export default function GameCard(props) {
  const card = props.data;
  return (
    <div
      className="card m-2 shadow text-center text-white bg-dark"
      style={{ width: "18rem", overflow: "hidden" }}
    >
      <img
        src={card.imgurl}
        style={{ width: "18rem", height: "16rem" }}
        className="card-img-top"
        alt={"img_not_found"}
      />
      <div className="card-body">
        <h5 className="card-title">{card.title}</h5>
        <p className="card-text">{card.desc}</p>
        <Link
          className="btn btn-danger text-white"
          to={"/game/" + card.pathid.toLowerCase()}
        >
          Play Game
        </Link>
      </div>
    </div>
  );
}
