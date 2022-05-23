import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { CirclePicker } from 'react-color';
import { Spinner } from "components/ui/Spinner";
import LineWidthPicker from 'react-line-width-picker'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import 'react-line-width-picker/dist/index.css'
import {BsBorderWidth} from 'react-icons/bs';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { FaUndo, FaRedo, FaPen, FaEraser, FaTrashAlt, FaPalette } from 'react-icons/fa';
import "styles/views/Game.scss";
import Chatbox from "./Chatbox";

var randomPictionaryWords = require('word-pictionary-list');

const Game = () => {
  const gameToken = window.location.pathname.split("/")[2];
  const userToken = localStorage.getItem("token");

  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedWidth, setSelectedWidth] = useState(5);
  const [mouseDown, setMouseDown] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [openWidthPicker, setOpenWidthPicker] = useState(false);
  const [isDrawing, setIsDrawing] = useState("inset");
  const [isErasing, setIsErasing] = useState("outset");
  const [isDeleting, setIsDeleting] = useState("outset");
  const [isUndoing, setIsUndoing] = useState("outset");
  const [isRedoing, setIsRedoing] = useState("outset");
  const [isSelectingColor, setIsSelectingColor] = useState("outset");
  const [isSelectingWidth, setIsSelectingWidth] = useState("outset");
  const [openModal, setOpenModal] = useState(false);
  const [drawingClassification, setDrawingClassification] = useState(null);
  const [guessedWord, setGuessedWord] = useState(""); 
  const [guessed, setGuessed] = useState(null); //if true the guesser guessed the correct word
  const [users, setUsers] = useState(null); //for the score during the game
  const [usernames, setUsernames] = useState([]); // for the usernames of chatbox
  const [lastPosition, setPosition] = useState({
    x: 0,
    y: 0
  });
  const [undoIndex, setUndoIndex] = useState(-1);
  const [redoIndex, setRedoIndex] = useState(-1);
  const [undoArray, setUndoArray] = useState([]);
  const [redoArray, setRedoArray] = useState([]);
  const [game, setGame] = useState(null);
  const [gameRound, setGameRound] = useState(null);
  const [words, setWords] = useState(JSON.parse(localStorage.getItem("words")));
  const [selectedWord, setSelectedWord] = useState(localStorage.getItem("selectedWord"));

  const isDrawer = !!gameRound && gameRound.drawerToken === userToken;

  useEffect(() => {
    if (selectedWord === null) {
      localStorage.removeItem('selectedWord');
    } else {
      localStorage.setItem('selectedWord', selectedWord);
    }
  }, [selectedWord]);

  useEffect(() => {
    if (words === null) {
      localStorage.removeItem('words');
    } else {
      localStorage.setItem('words', JSON.stringify(words));
    }
  }, [words]);

  const secondsPassed = !gameRound 
    ? null
    : gameRound.roundStartingTime === 0
    ? null
    : Math.floor((Date.now() - gameRound.roundStartingTime) / 1000)
  const secondsRemaining = !!game && !!secondsPassed && Math.max(0, game.roundLength - secondsPassed);
  const isTicking = secondsRemaining !== null && secondsRemaining !== false;
  const canDraw = isDrawer && !!selectedWord && secondsRemaining > 0;

  useEffect(() => {
    if (!isDrawer) return;
    const wordsStr = localStorage.getItem("words");
    if (wordsStr) {
      setWords(JSON.parse(wordsStr));
      return
    }
    const nrOfWords = 3;
    const newWords = [];
    for (let i = 0; i < nrOfWords; i++) {
      newWords.push( randomPictionaryWords({exactly:1, wordsPerString:1, formatter: (word)=> word.toLowerCase()}));
    }
    setWords(newWords);
    localStorage.setItem('words', JSON.stringify(newWords));
  }, [game?.currentGameRound, isDrawer]);

  useEffect(() => {
    if (isDrawer && gameRound?.roundStartingTime === 0) {
      setSelectedWord(null)
    }
    if (gameRound?.roundStartingTime === 0) {
      ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height)
    }
  }, [isDrawer, gameRound?.roundStartingTime]);

  useEffect(() => {
    setOpenModal(isDrawer && !selectedWord);
  }, [isDrawer, selectedWord]);

  const history = useHistory();

  useEffect(async() => {
    // if (localStorage.getItem("words") !== 'null' && localStorage.getItem("words") !== null && localStorage.getItem("words") !== '[]') {
    //   console.log("words from local storage");
    //   setWords(JSON.parse(localStorage.getItem("words")));
    // } else {
      // const nrOfWords = 3;
      // const randomWords = [];
      // for (let i = 0; i < nrOfWords; i++) {
      //   randomWords.push( randomPictionaryWords({exactly:1, wordsPerString:1, formatter: (word)=> word.toLowerCase()}));
      // }
      // setWords(randomWords);
      // localStorage.setItem('words', JSON.stringify(words));
    // } 

    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext('2d');
    }

    const user_score = await api.get("/games/"+gameToken+"/scoreboard")
    var arr = [];
    var username_array = [];
    for (const [key, value] of Object.entries(user_score.data)) {
      arr.push(`${key}: ${value}`)
      username_array.push(key);
    }
    setUsers(arr);
    setUsernames(username_array);
  }, []);

  useEffect(() => {
    fetchClassification();
    if (!isDrawer){
      getImage();
    }
    const interval = setInterval(() => {
      fetchClassification();
      if (!isDrawer){
        getImage();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isDrawer]);

  // Always if there is a change in the drawing --> sending image to backend
  useEffect(() => {
    if(isDrawer){
      sendImage();
    }
  });

  useEffect(() => {
    updateGame();
    updateGameRound();
    const interval = setInterval(() => {
      updateGame();
      updateGameRound();
    }, 500);
    return () => clearInterval(interval);
    
    async function updateGame() {
      const response = await api.get('/games/' + gameToken);
      setGame(response.data)
    }
    async function updateGameRound() {
      const response = await api.get('/gameRound/' + gameToken);
      setGameRound(response.data)
    }
  }, []);

  const fetchClassification = async() => {
    try{
      const response = await api.get('/vision/' + gameToken);
      if (response !== null){
        var arr = [];
      var username_array = [];
      for (const [key, value] of Object.entries(response.data.annotations)) {
        arr.push(`${key}: ${value}`)
        username_array.push(key);
      }
        setDrawingClassification(arr);
      }
    }
    catch (error) {
      console.error(`Something went wrong while fetching the round: \n${handleError(error)}`);
      console.error("Details:", error);
    }
  }

  const sendImage = async() => {
    const canvas = document.getElementById("canvas");
    const img = canvas.toDataURL();

    const requestBody = JSON.stringify({img});
    try{
      await api.put('/games/drawing?gameToken=' + gameToken, requestBody);
    }
    catch (error) {
      console.error(`Something went wrong while sending the images: \n${handleError(error)}`);
      console.error("Details:", error);
    }
  }

  const getImage = async() => {
    var img = new Image();
    try{
    const img2 = await api.get("games/drawing?gameToken=" + gameToken) 
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    img.onload = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(this, 0, 0);
    }
    img.src = String(img2.data);
    }
    catch (error) {
    console.error(`Something went wrong while fetching the images: \n${handleError(error)}`);
    console.error("Details:", error);
    }
  }

  const draw = useCallback((x, y) => {
    if (mouseDown && canDraw) {
      ctx.current.beginPath();
      ctx.current.strokeStyle = selectedColor;
      ctx.current.lineWidth = selectedWidth;
      ctx.current.lineJoin = 'round';
      ctx.current.moveTo(lastPosition.x, lastPosition.y);
      ctx.current.lineTo(x, y);
      ctx.current.closePath();
      ctx.current.stroke();

      setPosition({
        x,
        y
      })
    }
  }, [lastPosition, mouseDown, selectedColor, setPosition])

  const changeWidth = (e) =>{
    setSelectedWidth(e)
  }

  const finishDrawing = async() => {
    try{
      if(game.currentGameRound + 1 === game.numberOfRounds){
        if(isDrawer){
          try{
            await api.put(`/games/${gameToken}/updateStatus`);
          } catch(error) {
            console.error(`Something went wrong while updating game status: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while updating game status! See the console for details.");
          }
        }
        alert("This game is over");
        history.push({pathname: "/homepage",});
      }
      // If someone left the game
      else if (game.gameStatus === "finished"){
        try {
          await api.put(`/games/${userToken}/points?points=`+ 2)
        } catch(error) {
          console.error(`Something went wrong while updating game status: \n${handleError(error)}`);
          console.error("Details:", error);
        }
        alert("This game is over because one player left the game. This player gets -100p and all others gets +2p");
        history.push({pathname: "/homepage",});
      } 
      else if (isDrawer) {
        await api.put('/nextRound/' + gameToken);
      }
    }
    catch (error) {
      console.error(`Something went wrong while fetching the round: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while fetching the round! See the console for details.");
    }  
  }

  const clear = () => {
    if(window.confirm("delete all or not?")){
      setIsDeleting("inset")
      setTimeout(() => {
        setIsDeleting("outset")
      }, 100)
      ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height)
      setUndoArray([]);
      setUndoArray([]);
      setUndoIndex(-1);
      setRedoIndex(-1);
    } 
  }
  
  const erase = () => {
    setIsDrawing("outset")
    setIsErasing("inset")
    ctx.current.globalCompositeOperation = 'destination-out'
  }

  const paint = () => {
    setIsDrawing("inset")
    setIsErasing("outset")
    ctx.current.globalCompositeOperation = 'source-over'
  }

  const onMouseDown = (e) => {
    if (isDrawer){
      setPosition({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      })
      setMouseDown(true)
      setRedoArray([]);
      setRedoIndex(-1);
    }
  }

  const onMouseUp = (e) => {
    if (isDrawer){
      setMouseDown(false)
      if (e.type !== 'mouseleave'){
        setUndoArray([...undoArray, ctx.current.getImageData(0, 0, ctx.current.canvas.width, ctx.current.canvas.height)]);
        setUndoIndex(undoIndex + 1);
        
      }
    }
  }

  const undoLast = (e) => {
    if(isDrawer){
      if(undoIndex <= 0){
        setUndoIndex(-1);
        setUndoArray([]);
        if(undoIndex === 0){
          setRedoArray([...redoArray, undoArray.pop()]);
          setUndoArray([]);
          setUndoIndex(-1);
          setRedoIndex(redoIndex + 1);
          ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height)
        }
      } else{
        setRedoArray([...redoArray, undoArray.pop()]);
        ctx.current.putImageData(undoArray[undoIndex - 1], 0, 0);
        setUndoIndex(undoIndex - 1);
        setRedoIndex(redoIndex + 1);
      }
      setIsUndoing("inset")
      setTimeout(() => {
        setIsUndoing("outset")
      }, 100)
    }
  }

  const redoLast = (e) => {
    if(isDrawer){
      if(redoIndex >= 0){
        
        ctx.current.putImageData(redoArray[redoIndex], 0, 0);
        setUndoArray([...undoArray, redoArray.pop()]);
        setUndoIndex(undoIndex + 1);
        setRedoIndex(redoIndex - 1);
      }
      setIsRedoing("inset")
      setTimeout(() => {
        setIsRedoing("outset")
      }, 100)
    }
  }

  const onMouseMove = (e) => {
    if (isDrawer){
      draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }
  }

  const changeColor_CirclePicker = (e) => {
    setSelectedColor(e.hex)
    
  }

  const closeColorPicker = (event, reason) => {
    if (reason && reason === "backdropClick") 
        return;
    setOpenColorPicker(false)
  }

  const closeWidthPicker = (event, reason) => {
    if (reason && reason == "backdropClick") 
        return;
    setOpenWidthPicker(false)
  }

  const invertColor = (color) => {
    var hex = color.substr(1)
    return '#' + (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substring(1).toUpperCase()
  }

  const pickWord = (word) => async () => {
    await api.put('/games/'+gameToken+"/word/"+word);
    setSelectedWord(word);
    setWords(null)
  }  

  useEffect(async () => {
    if (secondsRemaining === 0) {
      await finishDrawing();
    }
  }, [secondsRemaining])

  const makeGuess = async(e) =>{
    e.preventDefault();
    try{
      const response = await api.get('/games/'+gameToken+"/user/"+userToken+"/word/"+guessedWord);
      console.log("makeGuess response:", typeof(response.data), response.data);
      if (response.data){
        alert("Your guess is correct! You get 10p")
        setGuessed(true);
      }
      else{
        alert("Wrong! Try again...")
      }
    } catch (error) {
      console.error(`Something went wrong while sending the guessword: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while sending the guessword! See the console for details.");
    }
  }

  let score = <Spinner />;

  if (users!==null) {
    score = (
      users.map((item) =>
      <p>{item}</p>)
    );
  };

  let classification = <Spinner />;

  if (drawingClassification!==null) {
    classification = (
      drawingClassification.map((item) =>
      <p>{item}</p>)
    );
  };

  return (    
    <BaseContainer className="drawing container">
    <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box textAlign='center' sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "25vw", bgcolor: 'background.paper', boxShadow: 24, p: 5,}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Choose one word:
          </Typography>
          {words && words.map((word) => (
            <Button key={word} variant="text" color="secondary" onClick={pickWord(word)}>
            {word}
          </Button>
          ))}
        </Box>
    </Modal>

    <div className="drawing timer">
       {game && isTicking && <CountdownCircleTimer
          size="150"
          strokeWidth="10"
          isPlaying={isTicking}
          initialRemainingTime={secondsRemaining}
          duration={game.roundLength} //here we can add the time which is selected
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[game.roundLength, ~~(game.roundLength/2), ~~(game.roundLength/4), 0]}
          >
          {() => {return secondsRemaining;}}       
        </CountdownCircleTimer>}
    </div>
    
    {isDrawer ?
      <div>
        {selectedWord !== null && <div className="drawing h1">Draw the Word: <div className="drawing h2">{selectedWord}</div></div>}
        <div className="drawing settings">      
        <div className="drawing icons">
          <FaUndo display={isDrawer} className="drawing undo"  title="click to undo last stroke" style={{border:isUndoing}} size={"2.2em"} onClick={undoLast}/>
          <FaRedo display={isDrawer} className="drawing redo"  title="click to redo last stroke" style={{border:isRedoing}} size={"2.2em"} onClick={redoLast}/>
          <FaTrashAlt display={isDrawer} className="drawing trash"  title="click to erase all" style={{border:isDeleting}} size={"2.2em"} onClick={clear}/>
          <FaPen className="drawing pen" title="click to draw" style={{color:selectedColor, border:isDrawing}} size={"2.2em"} onClick={paint}/>
          <BsBorderWidth className="drawing pen" title="click to change linewidth" style={{border:isSelectingWidth}} size={"2.2em"} onClick={() => {setOpenWidthPicker(true); setIsSelectingWidth("inset")}}/>
         
          {/* <StrokeWidthSelection onChange={changeWidth}  title="click to change linewidth" selectedWidth={selectedWidth}/> */}
          <FaEraser className="drawing eraser" title="click to erase" style={{border:isErasing}} size={"2.2em"} onClick={erase}/>
          <FaPalette className="drawing palette" style={{color:selectedColor, border:isSelectingColor}} title="click to choose color" size={"2.2em"} onClick={() => {setOpenColorPicker(true); setIsSelectingColor("inset")}}/>
        </div>
      
       <Dialog 
          onClose={closeColorPicker} 
          open={openColorPicker}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"> 
          <DialogTitle id="alert-dialog-title" className="drawing dialogtitle">Choose your preferred color</DialogTitle>
          <Typography align='center'>
          <CirclePicker className="drawing circles" title="change color" onChange={ changeColor_CirclePicker } width="600px" colors={ ["#FFFF00", "#FF0000", "#008000", "#0000FF", "#AB149E", "#000000", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39"] }/>
          </Typography>
          <br />
          <Typography align='center'><Button  variant="outlined" onClick={() => {setOpenColorPicker(false); setIsSelectingColor("outset")}}>Confirm</Button></Typography>
          <br />
        </Dialog>

        <Dialog 
          onClose={closeWidthPicker} 
          open={openWidthPicker}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"> 
          <DialogTitle id="alert-dialog-title" className="drawing dialogtitle">Choose your preferred linewidth</DialogTitle>
          <Typography align='center'>
          <LineWidthPicker width="400px" hoverBackground={invertColor(selectedColor)} lineWidths={[2, 4, 6, 8, 10, 15, 20]} 
            opacity="1" colour={selectedColor} onClick={changeWidth}/>
          </Typography>
          <br />
          <Typography align='center'><Button variant="outlined" onClick={() => {setOpenWidthPicker(false); setIsSelectingWidth("outset")}}>Confirm</Button></Typography>
          <br />
        </Dialog>
      </div>
      <br />

      </div>
      :<h1 className="drawing h1">Guess the Word <h2 className="drawing h2">from the drawing</h2></h1> //hide if not drawer
    }
    <div className="drawing canvas-chatbox">
    
        <canvas id="canvas"
            width={window.innerWidth/2}
            height={window.innerHeight/2}
            ref={canvasRef}
            title="draw here"

            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onMouseMove={onMouseMove}
          />
       {usernames && isTicking && <div className="drawing chatbox">
         <Chatbox user={JSON.parse(localStorage.getItem('user'))} usernames={usernames} gameToken={gameToken} />
       </div>}
    </div>
        
     <br />
     {
      !isDrawer?
      <div align="center">
        <form onSubmit={makeGuess}>
          <label>Enter your guess:
            <input 
              type="text" 
              value={guessedWord.toLowerCase()}
              onChange={(e) => setGuessedWord(e.target.value)}
            />
          </label>
          <Button type="submit" disabled={guessed || !guessedWord} >submit</Button>         
          </form>
      </div>
      :null
      }
      <div className="drawing scores">
        <h4>Points:</h4>  
        {score} 
      </div>
      <div className="drawing classification">
        <h4>I see</h4>  
        {classification} 
      </div>
    </BaseContainer>
  );
}

export default Game;