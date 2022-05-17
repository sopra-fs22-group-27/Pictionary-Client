import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/HomePage.scss";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import arrowRight from "resources/arrow-right.svg";
import {BsFillUnlockFill, BsFillLockFill} from 'react-icons/bs';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

const HomePage = (props) => {  
  const history = useHistory();
  const [games, setGames] = useState(null);
  const [joinableGames, setJoinableGames] = useState(null);
  const [gameName, setGameName] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [gameToken, setGameToken] = useState(null);
  const [seeAllGames, setSeeAllGames] = useState(true);
  
  const myuser = JSON.parse(localStorage.getItem("user"));

  const fetchGames = async () => {
    try {
      const response = await api.get("/games");
      setGames(response.data);
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
      await api.put(`/games/${gameToken}/player/${localStorage.getItem("token")}`, requestBody);
      history.push({ pathname: `/lobby/${gameToken}` });
    } catch (error) {
      alert(
        `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
      window.location.reload();
    }
  };

  const display = (games) => {
    let filteredGames = "";
    if (gameName === ""){
      filteredGames = games;
    }
    else {
      filteredGames = games.filter((game) =>{
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
              {game.gameStatus === "waiting" ?
              <div className="game-players-wrapper">
                <div className="game-players">
                  {game.numberOfPlayers}/{game.numberOfPlayersRequired}
                </div>
              </div>:
              <div className="game-players-none">
                </div>
              }
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
      {!games? <div className="spinner-container" align="center"><Spinner/></div> : 
      <div className='games-container'>
        <div className='game-title-container'>
          <div className='games-title'>Join a game</div>
          <button className="select-gametype-button" onClick={() => setSeeAllGames(!seeAllGames)}>{seeAllGames? "All Games" : "Joinable Games"}</button>
          <input label='gameName' className='games-input' placeholder='Search Game' 
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
