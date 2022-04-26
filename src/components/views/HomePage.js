import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/HomePage.scss";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import arrowRight from "resources/arrow-right.svg";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();
  const [games, setGames] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const myuser = JSON.parse(localStorage.getItem("user"));
  console.log(myuser);

  const fetchGames = async () => {
    try {
      const response = await api.get("/games");
      setGames(response.data);
      if (response.data.length > 0) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(
        `Something went wrong while fetching the Games: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the Games! See the console for details."
      );
    }
  };

  const joinGame = async (gameToken) => {
    try {
      const response = await api.put(
        `/games/${gameToken}/player/${localStorage.getItem("token")}`
      );
      console.log(response);

      history.push({ pathname: `/lobby/${gameToken}` });
    } catch (error) {
      alert(
        `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <BaseContainer>
      <div className="create-game-container">
        <div className="create-game-banner">
          <div className="create-game-text-container">
            <div className="create-game-title">CONFIGURE YOUR OWN GAME!</div>
            <div className="create-game-text">
              {" "}
              Want to be the game master? Customize and host your own game!
            </div>
          </div>
          <div
            className="create-game-button"
            onClick={() =>
              history.push({
                pathname: `/creategame`,
                state: { myuser: myuser },
              })
            }
          >
            {" "}
            Start Now{" "}
          </div>
        </div>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="games-container">
          <div className="games-title">Join a game</div>
          {games.map((game) => (
            <div
              className="game-container"
              key={`game${game.gameToken}`}
              onClick={() => {
                joinGame(game.gameToken);
              }}
            >
              <div className="game-name">{game.gameName}</div>
              <div className="game-players-wrapper">
                <div className="game-players">
                  {game.numberOfPlayers}/{game.numberOfPlayersRequired}
                </div>
              </div>
              <img className="game-icon" src={arrowRight} alt="arrow-right" />
            </div>
          ))}
        </div>
      )}
    </BaseContainer>
  );
};

export default HomePage;
