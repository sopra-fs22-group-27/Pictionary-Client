import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import "styles/views/CreateGame.scss";

const CreateGame = () => {
  const history = useHistory();
  const [gameName, setGameName] = useState("");
  const [numberOfPlayersRequired, setnumberOfPlayersRequired] = useState(2);
  const [roundLength, setRoundLength] = useState(60);
  const [numberOfRounds, setNumberOfRounds] = useState(10);
  const numberOfPlayers = 1; //the creator of the game is always in the game
  const gameStatus = "waiting"; //possile values: waiting, started, finished

  const createGame = async () => {
    try {
      const playerTokens = [localStorage.getItem("token")];
      if (!playerTokens) {
        alert(
          "Something went wrong while fetching the user! See the console for details."
        );
        return;
      }
      const requestBody = JSON.stringify({
        gameName,
        numberOfPlayersRequired,
        numberOfPlayers,
        roundLength,
        numberOfRounds,
        gameStatus,
      });
      console.log(requestBody);
      const response = await api.post("/games?userToken=" + playerTokens, requestBody);
      history.push({ pathname: `/lobby/${response.data.gameToken}` });
      localStorage.setItem("createdGame", response.data.gameToken);
    } catch (error) {
      console.log(handleError(error));
      alert(
        `Something went wrong during the game creation: \n${handleError(error)}`
      );
      window.location.reload();
    }
  };

  return (
    <BaseContainer>
      <div className="form-container">
        <div className="form-title">CONFIGURE YOUR OWN GAME!</div>
        <div className="form-text">
          <div className="form-text-title">Game name</div>
          <input
            className="form-text-input"
            type="text"
            placeholder="Enter game name"
            value={gameName}
            style={{ width: "70%" }}
            onChange={(e) => {
              setGameName(e.target.value);
            }}
          />
        </div>
        <div className="form-text">
          <div className="form-text-title">Number of players</div>
          <div className="form-text-input">
            <input
              className="form-text-input"
              type="text"
              placeholder="2"
              value={numberOfPlayersRequired}
              onChange={(e) => {
                setnumberOfPlayersRequired(e.target.value);
              }}
            />
            <button
              className="form-text-button"
              onClick={() => {
                if (numberOfPlayersRequired > 1) {
                  setnumberOfPlayersRequired(numberOfPlayersRequired - 1);
                }
              }}
            >
              -
            </button>
            <button
              className="form-text-button"
              onClick={() => {
                setnumberOfPlayersRequired(numberOfPlayersRequired + 1);
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="form-text">
          <div className="form-text-title">Round length</div>
          <div className="form-text-input">
            <input
              className="form-text-input"
              type="text"
              placeholder="60"
              value={roundLength}
              onChange={(e) => {
                setRoundLength(e.target.value);
              }}
            />
            <button
              className="form-text-button"
              onClick={() => {
                if (roundLength > 5) {
                  setRoundLength(roundLength - 5);
                }
              }}
            >
              -
            </button>
            <button
              className="form-text-button"
              onClick={() => {
                setRoundLength(roundLength + 5);
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="form-text">
          <div className="form-text-title">Number of rounds</div>
          <div className="form-text-input">
            <input
              className="form-text-input"
              type="text"
              placeholder="10"
              value={numberOfRounds}
              onChange={(e) => {
                setNumberOfRounds(e.target.value);
              }}
            />
            <button
              className="form-text-button"
              onClick={() => {
                if (numberOfRounds > 1) {
                  setNumberOfRounds(numberOfRounds - 1);
                }
              }}
            >
              -
            </button>
            <button
              className="form-text-button"
              onClick={() => {
                setNumberOfRounds(numberOfRounds + 1);
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="form-button">
          <button
            className="form-button-start"
            onClick={() => {
              if (
                gameName.length > 0 &&
                numberOfPlayersRequired > 0 &&
                roundLength > 0 &&
                numberOfRounds > 0
              ) {
                createGame();
              } else {
                alert(
                  "Please fill all fields and make sure all numbers are positive"
                );
              }
            }}
          >
            Start
          </button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default CreateGame;
