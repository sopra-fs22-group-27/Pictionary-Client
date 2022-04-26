import React, { useState, useEffect } from "react";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import { api, handleError } from "helpers/api";

const CreateGame = () => {
  const [totalPlayers, setTotalPlayers] = useState(null);
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const gameToken = window.location.pathname.split("/")[2];

  const getGame = async () => {
    try {
      const response = await api.get(`/games/${gameToken}`);
      console.log(response);
      setCurrentPlayers(response.data.numberOfPlayers);
      setTotalPlayers(response.data.numberOfPlayersRequired);

      if(totalPlayers == currentPlayers){
        const players = response.data.playerTokens;
        const firstDrawer = Math.floor(Math.random() * players.length);
        window.location.href = `/game/${gameToken}/drawer/${players[firstDrawer]}`;
      }
    } catch (error) {
      alert(
        `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
      window.location.reload();
    }
  };

  useEffect(() => {
    getGame(gameToken);
    setInterval(() => {
      getGame(gameToken);
    }, 5000);
  },);

  return (
    <BaseContainer>
      <div className="lobby-container">
        <div className="lobby-text">Waiting for players</div>
        <div className="lobby-numbers">
          {currentPlayers}/{totalPlayers}
        </div>
      </div>
    </BaseContainer>
  );
};

export default CreateGame;
