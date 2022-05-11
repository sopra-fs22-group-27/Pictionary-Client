import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/HomePage.scss";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import arrowRight from "resources/arrow-right.svg";
import { useLocation } from "react-router-dom";
import {BsFillUnlockFill, BsFillLockFill} from 'react-icons/bs';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Chatbox from "./Chatbox";

const HomePage = (props) => {  
  const history = useHistory();
  const [games, setGames] = useState(null);
  const [joinableGames, setJoinableGames] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPartial, setIsLoadingPartial] = useState(true);
  const [gameName, setGameName] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [gameToken, setGameToken] = useState(null);
  const [seeAllGames, setSeeAllGames] = useState(true);
  
  const myuser = JSON.parse(localStorage.getItem("user"));
  // console.log(myuser);

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

  const fetchJoinableGames = async () => {
    try {
      const response = await api.get("/joinable-games");
      setJoinableGames(response.data);
      if (response.data.length > 0) {
        setIsLoadingPartial(false);
      }
    } catch (error) {
      console.error(
        `Something went wrong while fetching the joinable Games: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the joinable Games! See the console for details."
      );
    }
  };

  const joinGame = async (gameToken) => {
    try {
      const requestBody = JSON.stringify({password})
      console.log(requestBody)
      const response = await api.put(
        `/games/${gameToken}/player/${localStorage.getItem("token")}`, requestBody
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

  const display = (games) => {
    if (gameName === ""){
      var filteredGames = games;
    }
    else {
      var filteredGames = games.filter((game) =>{
        return game.gameName.toUpperCase().startsWith(gameName.toUpperCase());
      })
    }
    return filteredGames.map((game) => (
            <div
              className="game-container"
              key={`game${game.gameToken}`}
              onClick={() => {
                setGameToken(game.gameToken);
                if(!game.isPublic){
                  setDialogOpen(true);
                }else{
                  joinGame(game.gameToken);
                }
                
              }}
            >
              <div className="game-name">{game.gameName}</div>
              {game.isPublic 
                ? <BsFillUnlockFill title="this game doesn't need password to enter" style={{ marginLeft:"2em", color:"green"}} size={"2.2em"} /> 
                : <BsFillLockFill title="this game needs password to enter" style={{marginLeft: "2em", color:"red"}} size={"2.2em"} />}
              <div className="game-status">{game.gameStatus}</div>
              <div className="game-players-wrapper">
                
                <div className="game-players">
                  
                  {game.numberOfPlayers}/{game.numberOfPlayersRequired}
                </div>
              </div>
              <img className="game-icon" src={arrowRight} alt="arrow-right" />
            </div>
          ))
  }

  useEffect(() => {
    let timer = setTimeout(() => fetchGames(),  1000);
    return () => {
      clearTimeout(timer);
    };
  }, [games]);

  useEffect(() => {
    let timer = setTimeout(() => fetchJoinableGames(),  1000);
    return () => {
      clearTimeout(timer);
    };
  }, [joinableGames]);

  useEffect(() => {
    console.log(gameName);
    console.log(gameToken);
  }, [gameName, gameToken]);

  useEffect(() => {
    if (performance.navigation.type === 1) {
      props.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  return (
    <div>
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
      {!games? <Spinner/> : 
      <div className='games-container'>
        <div className='game-title-container'>
          <div className='games-title'>Join a game</div>
          <button className="select-gametype-button" onClick={() => setSeeAllGames(!seeAllGames)}>{seeAllGames? "All Games" : "Joinable Games"}</button>
          <input label='gameName' className='games-input' placeholder='Search a game by name' 
            onChange={(e) => setGameName(e.target.value)} value={gameName}></input>
        </div>
        {seeAllGames? display(games): display(joinableGames)}
      </div>}
    </BaseContainer>
    <Dialog 
      // onClose={} 
      open={dialogOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"> 
      <DialogTitle id="alert-dialog-title" className="drawing dialogtitle">Enter password for the game</DialogTitle>
      <Typography align="center">
        <input
              className="form-text-input"
              type="password"
              placeholder="Enter password"
              value={password}
              style={{ width: "100%" }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
          />
      </Typography>
      <Typography align="center">
        <Button  variant="outlined" color="secondary" onClick={() => {setDialogOpen(false)}}>Cancel</Button>
        <Button  style={{marginLeft: "5em"}} variant="outlined" color="primary" onClick={() => {setDialogOpen(false); joinGame(gameToken);}}>Confirm</Button>
      </Typography>
      <br />

    </Dialog>
  </div>
  );
};

export default HomePage;
