import React, { useState, useEffect } from "react";
import firebase from "../firebaseConfig";

const WantToPlayList = () => {
  const [wantToPlayGames, setWantToPlayGames] = useState([]);

  useEffect(() => {
    // Fetch the games from the "wantToPlay" list in Firebase
    const fetchWantToPlayGames = async () => {
      const ref = firebase.database().ref("wantToPlay");
      const snapshot = await ref.once("value");
      const games = snapshot.val() || [];
      setWantToPlayGames(games);
    };

    fetchWantToPlayGames();
  }, []);

  const addToWantToPlayList = (game) => {
    // Add the game to the "wantToPlay" list in Firebase
    const ref = firebase.database().ref("wantToPlay");
    ref.push(game);
  };

  return (
    <div>
      <h2>I Want to Play</h2>
      <div>
        {wantToPlayGames.map((game) => (
          <div key={game.id} className="game-card">
            <h3>{game.name}</h3>
            {/* Additional game details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WantToPlayList;
