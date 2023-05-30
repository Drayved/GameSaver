import React, { useState, useEffect } from "react";

import GameCard from "./GameCard";

const GamesSaved = () => {
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
      {GameCard}
    </div>
  );
};

export default GamesSaved;
