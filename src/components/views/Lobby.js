import React, { useState, useEffect } from "react";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";

const CreateGame = () => {
  const history = useHistory();
  const [totalPlayers, setTotalPlayers] = useState(null);
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const gameToken = window.location.pathname.split("/")[2];

  const getGame = async () => {
    try {
      const response = await api.get(`/games/${gameToken}`);
      const full = await api.get(`/games/${gameToken}/full`);
      console.log(full);
      setCurrentPlayers(response.data.numberOfPlayers);
      setTotalPlayers(response.data.numberOfPlayersRequired);

      if(full.data){
        //const players = response.data.playerTokens;
        history.push({ pathname: `/game/${gameToken}`});
        //const firstDrawer = Math.floor(Math.random() * players.length);
        //history.push({ pathname: `/game/${gameToken}/drawer/${players[firstDrawer]}`});
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
    const intervalId = setInterval(() => {
      getGame(gameToken);
    }, 2000);
    return () => clearInterval(intervalId);
  },[]);

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
