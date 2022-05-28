import React, { useState, useEffect } from "react";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "react-bootstrap";
import { Alert, IconButton, Collapse, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CreateGame = () => {
  const history = useHistory();
  const [totalPlayers, setTotalPlayers] = useState(null);
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const [allowedToCancelLobby, setAllowedToCancelLobby] = useState(false);
  const [leave, setLeave] = useState(false);
  const gameToken = window.location.pathname.split("/")[2];

  const deleteGame = async () => {
    try {
      await api.delete(`/games/${gameToken}`);
      history.push("/homepage");
      localStorage.removeItem("createdGame");
    } catch (error) {
      alert(
        `Something went wrong during the game deletion: \n${handleError(error)}`
      );
      localStorage.removeItem("createdGame");
    }
  };

  const getGame = async () => {
    try {
      const response = await api.get(`/games/${gameToken}`);
      const full = await api.get(`/games/${gameToken}/full`);

      setCurrentPlayers(response.data.numberOfPlayers);
      setTotalPlayers(response.data.numberOfPlayersRequired);

      if (full.data) {
        localStorage.removeItem("selectedWord");
        localStorage.removeItem("words");
        localStorage.removeItem("createdGame");
        localStorage.removeItem("currentTime");
        history.push({ pathname: `/game/${gameToken}` });
        //const firstDrawer = Math.floor(Math.random() * players.length);
        //history.push({ pathname: `/game/${gameToken}/drawer/${players[firstDrawer]}`});
      }
    } catch (error) {
      //if 404, game has been deleted, redirect to home, only alert to non-creator
      if (!allowedToCancelLobby && error.response.status === 404) {
        alert("Game has been deleted by the creator");
        history.push("/homepage");
      } else {
        alert(
          `Something went wrong while joining the lobby: \n${handleError(
            error
          )}`
        );
      }
      window.location.reload();
    }
  };

  // alert after 10 mins
  useEffect(() => {
    let timer = setTimeout(() => setLeave(true), 600000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  //cancel after 10 mins + 30 secs
  useEffect(() => {
    let timer = setTimeout(() => deleteGame(),  630000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const createdGame = localStorage.getItem("createdGame");
    if (createdGame === gameToken) {
      setAllowedToCancelLobby(true);
    }
    getGame(gameToken);
    const intervalId = setInterval(() => {
      getGame(gameToken);
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Collapse in={leave}>
        <Alert
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setLeave(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Since you waited for about 10 mins but nobody came, so we decide to cancel your game after 30 seconds! Please create a new game if you'd like.
        </Alert>
      </Collapse>
      <BaseContainer>
        <div className="lobby-container">
          <div className="lobby-text">Waiting for players</div>
          <div className="lobby-numbers">
            {currentPlayers}/{totalPlayers}
          </div>
          {allowedToCancelLobby && (
            <div className="cancel-lobby-button"
            onClick={() => deleteGame()}>Cancel game</div>
          )}
        </div>
      </BaseContainer>
    </div>
  );
};

export default CreateGame;