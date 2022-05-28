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

var randomPictionaryWords = require('word-pictionary-list');

const Game = () => {
  const gameToken = window.location.pathname.split("/")[2];
  const userToken = localStorage.getItem("token");
  
  const canvasRef = useRef(null);
  const canvas = () => canvasRef.current;
  const canvasContext = () => canvas()?.getContext("2d");
  
  const [words, setWords] = useState(JSON.parse(localStorage.getItem("words")));
  const [selectedWord, setSelectedWord] = useState(localStorage.getItem("selectedWord"));

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
  const [aiDrawingRating, setAIDrawingRating] = useState(null);
  const [guessedWord, setGuessedWord] = useState(""); 
  const [guessed, setGuessed] = useState(null); //if true the guesser guessed the correct word
  const [users, setUsers] = useState(null); //for the score during the game
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

  const isLoaded = Boolean(game && gameRound)
  const isDrawer = gameRound?.drawerToken === userToken;

  const secondsPassed = !isLoaded 
    ? null
    : gameRound.roundStartingTime === 0
    ? 0
    : Math.min(game.roundLength, Math.floor((Date.now() - gameRound.roundStartingTime) / 1000));

  const secondsRemaining = isLoaded ? Math.max(0, game.roundLength - secondsPassed) : null;
  const isTicking = isLoaded ? gameRound.roundStartingTime !== 0 : null;
  const canDraw = isLoaded ? isDrawer && !!selectedWord && secondsRemaining > 0 : null;
  const canFetchClassifications = isLoaded ? !isCanvasBlank() : null;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isDrawer) {
      if (words) {
        setSelectedWord(null);
        setWords(null);
      }
      return;
    }
    if (words) return;
    const nrOfWords = 3;
    const newWords = [];
    for (let i = 0; i < nrOfWords; i++) {
      newWords.push( randomPictionaryWords({exactly:1, wordsPerString:1, formatter: (word)=> word.toLowerCase()}));
    }
    setWords(newWords);
  }, [isLoaded, isDrawer, words]);


  useEffect(async () => {
    if (!isLoaded) return;
    if (secondsRemaining === 0) {
      await finishDrawing();
    }
  }, [isLoaded, secondsRemaining])

  useEffect(() => {
    if (!isLoaded) return;
    setOpenModal(isDrawer && !selectedWord);
  }, [isLoaded, isDrawer, selectedWord]);

  const history = useHistory();

  useEffect(async() => {
    const user_score = await api.get("/games/"+gameToken+"/scoreboard")
    var arr = [];
    for (const [key, value] of Object.entries(user_score.data)) {
      arr.push(`${key}: ${value}`)
    }
    setUsers(arr);
  }, [guessed]);

  useEffect(() => {
    if (!isLoaded) return;
    console.log(canFetchClassifications)
    fetchClassification();
      if (isDrawer){
        sendImage();
        fetchAIDrawingRating();
      } else {
        getImage();
      }
    const interval = setInterval(() => {
      fetchClassification();
      if (isDrawer){
        sendImage();
        fetchAIDrawingRating();
      } else {
        getImage();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isLoaded, isDrawer, canFetchClassifications]);
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

  const fetchAIDrawingRating = async() =>{
    if(canFetchClassifications && !!selectedWord){
      try{
        const response = await api.get('/vision/' + gameToken + '/drawerPoints');
        if(response !== null){
          setAIDrawingRating(response.data);
        }
      }
      catch (error) {
        console.error(`Something went wrong while getting the AI Drawing Rating: \n${handleError(error)}`);
        console.error("Details:", error);
        // Don't alert, because this is called every second
        //alert("Something went wrong while sending the images! See the console for details.");
      }
    }
  }

  const fetchClassification = async() => {
    if(canFetchClassifications){
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
  }

  const sendImage = async() => {
    const img = canvasRef.current.toDataURL();

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
    img.onload = function() {
      canvasContext()?.clearRect(0, 0, canvas()?.width, canvas()?.height);
      canvasContext()?.drawImage(this, 0, 0);
    }
    img.src = String(img2.data);
    }
    catch (error) {
    console.error(`Something went wrong while fetching the images: \n${handleError(error)}`);
    console.error("Details:", error);
    }
  }

  //returns true if blank
  function isCanvasBlank() {
    return !canvasContext()
      .getImageData(0,0, canvas()?.width, canvas()?.height).data
      .some(channel => channel !==0);
  }

  const draw = useCallback((x, y) => {
    if (mouseDown && canDraw) {
      const ctx = canvasContext();
      if (!ctx) return;
      ctx.beginPath();
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = selectedWidth;
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.stroke();

      setPosition({ x, y })
    }
  }, [lastPosition, mouseDown, selectedColor, setPosition])

  const changeWidth = (e) =>{
    setSelectedWidth(e)
  }

  const finishDrawing = async() => {
    setGuessed(false);
    setGuessedWord('');
    try{
        canvasContext()?.clearRect(0, 0, canvas()?.width, canvas()?.height)
        await sendImage();
    } catch(error) {
    }
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
        history.push("/homepage");
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
      canvasContext()?.clearRect(0, 0, canvas()?.width, canvas()?.height)
      setUndoArray([]);
      setUndoArray([]);
      setUndoIndex(-1);
      setRedoIndex(-1);
    } 
  }
  
  const erase = () => {
    setIsDrawing("outset")
    setIsErasing("inset")
    canvasContext().globalCompositeOperation = 'destination-out'
  }

  const paint = () => {
    setIsDrawing("inset")
    setIsErasing("outset")
    canvasContext().globalCompositeOperation = 'source-over'
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
        setUndoArray([...undoArray, canvasContext()?.getImageData(0, 0, canvas()?.width, canvas()?.height)]);
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
          canvasContext()?.clearRect(0, 0, canvas()?.width, canvas()?.height)
        }
      } else{
        setRedoArray([...redoArray, undoArray.pop()]);
        canvasContext()?.putImageData(undoArray[undoIndex - 1], 0, 0);
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
        
        canvasContext()?.putImageData(redoArray[redoIndex], 0, 0);
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
    if (reason && reason === "backdropClick") 
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
  }  

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

  const [score, setScore] = useState(<Spinner />);
  useEffect (() => {
  if (users!==null) {
    setScore(
      users.map((item) =>
      <p>{item}</p>)
    );
  };
  }, [guessed, users]);

  let classification = <Spinner />;

  if (drawingClassification!==null && canFetchClassifications) {
    classification = (
      drawingClassification.slice(0,5).map((item) =>
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
        <Box textAlign='center' className="word-to-guess-wrapper" sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "35vw", boxShadow: 24, p: 5,}}>
          <Typography id="modal-modal-title" className="word-to-guess-title" variant="h6" component="h2">
            Choose one word:
          </Typography>
          {words && words.map((word) => (
            <Button key={word} variant="text" color="secondary" className="word-to-guess" onClick={pickWord(word)}>
            {word}
          </Button>
          ))}
        </Box>
    </Modal>
    
    <div className="game-container">
      <div className="canvas-container">
      {isDrawer && selectedWord !== null ? (
        <div className="drawing h1">Draw the Word: <span className="drawing underline">{selectedWord}</span></div>
      ) : (
     <div className="drawing h1">Guess the Word:</div>
      )}
        {isDrawer &&
        <>
        <div className="drawing icons">
            <FaUndo display={isDrawer} className="drawing icon"  title="click to undo last stroke" style={{border:isUndoing}} size={"2.2em"} onClick={undoLast}/>
            <FaRedo display={isDrawer} className="drawing icon"  title="click to redo last stroke" style={{border:isRedoing}} size={"2.2em"} onClick={redoLast}/>
            <FaTrashAlt display={isDrawer} className="drawing icon"  title="click to erase all" style={{border:isDeleting}} size={"2.2em"} onClick={clear}/>
            <FaPen className="drawing icon" title="click to draw" style={{color:selectedColor, border:isDrawing}} size={"2.2em"} onClick={paint}/>
            <BsBorderWidth className="drawing icon" title="click to change linewidth" style={{border:isSelectingWidth}} size={"2.2em"} onClick={() => {setOpenWidthPicker(true); setIsSelectingWidth("inset")}}/>
          
            {/* <StrokeWidthSelection onChange={changeWidth}  title="click to change linewidth" selectedWidth={selectedWidth}/> */}
            <FaEraser className="drawing icon" title="click to erase" style={{border:isErasing}} size={"2.2em"} onClick={erase}/>
            <FaPalette className="drawing icon" style={{color:selectedColor, border:isSelectingColor}} title="click to choose color" size={"2.2em"} onClick={() => {setOpenColorPicker(true); setIsSelectingColor("inset")}}/>
        </div>
      
       <Dialog 
          onClose={closeColorPicker} 
          open={openColorPicker}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"> 
          <DialogTitle id="alert-dialog-title" className="drawing dialog-title">Choose your preferred color</DialogTitle>
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
        <br /></>
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
        </div>
        <br />
        {
          canFetchClassifications && isDrawer?
          <div className="drawing h1">{aiDrawingRating}</div>
          :null
        }
        {!isDrawer && 
          <form onSubmit={makeGuess} className="guessing-wrapper">
            <label>Enter your guess:           
              <input 
              className="drawing-guess"
                type="text" 
                value={guessedWord.toLowerCase()}
                onChange={(e) => setGuessedWord(e.target.value)}
              />
            </label>
            <Button className="submit-button" type="submit" disabled={guessed || !guessedWord} >submit</Button>         
          </form>}
        </div>
        <div className="sidebar-container">
        <div className="drawing timer">
         {isLoaded && isTicking && <CountdownCircleTimer
            className="timer"
            size="100"
            strokeWidth="10"
            isPlaying={isTicking}
            initialRemainingTime={secondsRemaining}
            duration={game.roundLength} //here we can add the time which is selected
            colors={['#f06464', '#f277d0', '#9489db', '#37d1e5']}
            colorsTime={[game.roundLength, ~~(game.roundLength/2), ~~(game.roundLength/4), 0]}
            >
            {() => {return secondsRemaining;}}       
          </CountdownCircleTimer>}
        </div>
          <div className="drawing boxes">
            <h4>Points:</h4>  
            {score} 
          </div>
          <div className="drawing boxes">
            <h4>I see</h4>  
            {classification} 
          </div>
        </div>
      </div>
    </BaseContainer>
  );
}

export default Game;