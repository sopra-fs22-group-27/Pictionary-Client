import React, { useState, useEffect } from "react";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";

const CreateGame = () => {
  const history = useHistory();
  const [totalPlayers, setTotalPlayers] = useState(null);
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const [allowedToCancelLobby, setAllowedToCancelLobby] = useState(false);
  const gameToken = window.location.pathname.split("/")[2];

  const deleteGame = async () => {
    try {
      await api.delete(`/games/${gameToken}`);
      history.push("/homepage");
      localStorage.removeItem("createdGame");
    } catch (error) {
      console.log(handleError(error));
      alert(
        `Something went wrong during the game deletion: \n${handleError(error)}`
      );
      localStorage.removeItem("createdGame");
    }
  }

  const getGame = async () => {
    try {
      const response = await api.get(`/games/${gameToken}`);
      const full = await api.get(`/games/${gameToken}/full`);
      console.log(full);
      setCurrentPlayers(response.data.numberOfPlayers);
      setTotalPlayers(response.data.numberOfPlayersRequired);

      if(full.data){
        //const players = response.data.playerTokens;
        localStorage.setItem('drawerToken', null);
        localStorage.setItem('selectedWord', null);
        localStorage.setItem('roundLength', null);
        localStorage.setItem('ticking', false);
        history.push({ pathname: `/game/${gameToken}`});
        //const firstDrawer = Math.floor(Math.random() * players.length);
        //history.push({ pathname: `/game/${gameToken}/drawer/${players[firstDrawer]}`});
      }
    } catch (error) {
      //if 404, game has been deleted, redirect to home
      if(error.response.status === 404){
        alert("Game has been deleted by the creator");
        history.push("/");
      } else {
      alert(
        `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
      }
      window.location.reload();
    }
  };

  useEffect(() => {
    const createdGame = localStorage.getItem("createdGame");
    if (createdGame == gameToken) {
      setAllowedToCancelLobby(true);
    }
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
        {allowedToCancelLobby && (
          <div className="lobby-cancel-button" onClick={() => deleteGame()}>
            Cancel game
            </div>
        )}
      </div>
    </BaseContainer>
  );
};

export default CreateGame;
