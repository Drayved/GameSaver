import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-btns">
        <Link className="games-saved" to="/games-saved">
          <img src="./images/computer-game.png" alt="" />
        </Link>
        <Link to="/" className="games-search">
          <img  src="./images/search.png" alt="" />
        </Link>
        <Link className="games-played" to="/games-played">
          <img src="./images/game-over.png" alt="" />
        </Link>
      </div>
    </footer>
  );
}
