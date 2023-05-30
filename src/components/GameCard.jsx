import { useContext } from "react";
import { AuthContext } from "../App";

export default function GameCard(){
    const { games } = useContext(AuthContext)

    const displayedGames = games.slice(0, 3);

    return(
        <div className="games-card-container">
        {displayedGames.map((game) => (
          <div key={game.id} className="games-card">
            <h3 className="game-name">{game.name}</h3>
            <div className="game-info">
              <img
                className="game-img"
                src={game.background_image}
                alt={game.name}
              ></img>
              <div className="game-details">
                <div className="game-release">
                  <p>Released: </p>
                  <p className="text-xs">{game.released}</p>
                </div>
                <div className="game-genres">
                  <p>Genres:</p>
                  <p className="text-xs"> {game.genres.map((genre) => genre.name).join(", ")}</p>
                </div>
                <button className="more-info-btn">More Info</button>
              </div>
            </div>
            <div className="list-btns">
              <button
                onClick={(event) => handleWantToPlay(event, game)}
                className="want-btn"
              >
                I want to play it
              </button>
              <button
                onClick={(event) => handlePlayedIt(event, game)}
                className="played-btn"
              >
                I played it
              </button>
            </div>
          </div>
        ))}
      </div>
    )
}