import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { CirclePicker } from 'react-color';
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
import { FaPen, FaEraser, FaTrashAlt, FaPalette } from 'react-icons/fa';
import "styles/views/Game.scss";
// import { IconName } from "react-icons/fi";

var randomPictionaryWords = require('word-pictionary-list');
var word1 = randomPictionaryWords({exactly:1, wordsPerString:1, formatter: (word)=> word.toLowerCase()})
var word2 = randomPictionaryWords({exactly:1, wordsPerString:1, formatter: (word)=> word.toLowerCase()})
var word3 = randomPictionaryWords({exactly:1, wordsPerString:1, formatter: (word)=> word.toLowerCase()})


const Game = (props) => {

  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const [gameData, setGameData] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedWidth, setSelectedWidth] = useState(5);
  const [mouseDown, setMouseDown] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [openWidthPicker, setOpenWidthPicker] = useState(false);
  const [isDrawing, setIsDrawing] = useState("inset");
  const [isErasing, setIsErasing] = useState("outset");
  const [isDeleting, setIsDeleting] = useState("outset");
  const [isSelectingColor, setIsSelectingColor] = useState("outset");
  const [isSelectingWidth, setIsSelectingWidth] = useState("outset");
  const [openModal, setOpenModal] = useState(false);
  const [word, setWord] = useState(null);  
  const [ticking, setTicking] = useState(false);
  const [canDraw, setCanDraw] = useState(true);
  const [drawer, setDrawer] = useState(false); //If true then you are the drawer
  const [drawerToken, setDrawerToken] = useState(null); //Token of the drawer
  const [guessedWord, setGuessedWord] = useState(""); 
  const [lastPosition, setPosition] = useState({
    x: 0,
    y: 0
  });
  const gameToken = window.location.pathname.split("/")[2];
  // const [currentGameRound, setCurrentGameRound] = useState(0);
  // const [gameIsOver, setGameIsOver] = useState(false);
  
  const history = useHistory();

  // Only if the page mounts
  useEffect(async() => {
    const response = await api.get('/gameRound/'+window.location.pathname.split("/")[2]);
    //const gameInfo = await api.get('/game/'+window.location.pathname.split("/")[2]);
    //const currentDrawer = window.location.pathname.split("/")[4];
    //const currentUser = localStorage.getItem("token");
        
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext('2d');
    }
/*     setDrawerToken(currentDrawer);

    if (currentUser === currentDrawer) {
      setDrawer(true);
      if (word === null){
        setOpenModal(true)
      }
    } */

    if (drawerToken === null){
      setDrawerToken(response.data.drawerToken);
    }
    if (word===null){
      if (localStorage.getItem("token")===response.data.drawerToken){ 
        setOpenModal(true)
      }
    }

  if (localStorage.getItem("token")===response.data.drawerToken){
    setDrawer(true);
  }
  }, []);

  // Every second --> getting image from backend if guesser
  useEffect(() => {
    const interval = setInterval(() => {
      if (!drawer){
        getImage();
      }
    }, 10);
    return () => clearInterval(interval);
  });

  // Always if there is a change in the drawing --> sending image to backend
  useEffect(() => {
    if(drawer){
      sendImage();
    }
  });

  //
  // useEffect(() => {
  //   if(drawer && ticking){
  //     console.log("dsfsdfsd")
  //     startRound();
  //   }
  // }, [])

  // get current round
  useEffect(() => {
    const interval = setInterval(() => {
      if(!drawer && !ticking){
        fetchRound();
      }
    }, 100);
    return () => clearInterval(interval);
    
  });

  const fetchRound = async() => {
    try{
      const response = await api.get('/games/' + gameToken);
      const game = response.data;
      const round = game.currentGameRound;
      console.log(round);
      // setCurrentGameRound(round);
      if(localStorage.getItem('currentGameRound')===null){
        localStorage.setItem('currentGameRound', 0);
      }else{
        if(!drawer && localStorage.getItem('currentGameRound') != round && round != 0){
          // console.log(localStorage.getItem('currentGameRound'))
          // console.log(round)
          // localStorage.setItem('currentGameRound', round);
          setTicking(true);
        }
      }
    }
    catch (error) {
      console.error(`Something went wrong while fetching the round: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while fetching the round! See the console for details.");
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
      alert("Something went wrong while sending the images! See the console for details.");
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
    alert("Something went wrong while fetching the images! See the console for details.");
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
  // const startRound = async() => {
  //   try{
  //     await api.put('/nextRound/' + gameToken);
      
  //   }
  //   catch (error) {
  //     console.error(`Something went wrong while going to other GameRound: \n${handleError(error)}`);
  //     console.error("Details:", error);
  //     alert("Something went wrong while going to other GameRound! See the console for details.");
  //   }
  // }
  
  const finishDrawing = async() => {
    setCanDraw(false)
    try{
      const response = await api.get('/games/' + gameToken);
      const game = response.data;
      const round = game.currentGameRound;
      // console.log(round);
      localStorage.setItem('currentGameRound', round);
      console.log(game.numberOfRounds);
      if(round === game.numberOfRounds){
        alert("This game is over");
        localStorage.removeItem('currentGameRound');
        history.push({pathname: "/homepage",});
      } else{
        alert("This Round is finished")
        //refresh because of timer
        //also statement because the backend makes 409 if there arent rounds left! we should recognize in the fronted beforehand
      
        //wait for three seconds and refresh
        setInterval(() => {
          console.log("wait for three second");
          window.location.reload();
          window.location.reload();
    }, 3000);
      }
    }
    catch (error) {
      console.error(`Something went wrong while fetching the round: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while fetching the round! See the console for details.");
    }

    
   
    
  }

  const clear = () => {
    setIsDeleting("inset")
    setTimeout(() => {
      setIsDeleting("outset")
    }, 100)
    ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height)
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
    if (drawer){
      setPosition({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      })
      setMouseDown(true)
    }
  }

  const onMouseUp = (e) => {
    if (drawer){
      setMouseDown(false)
    }
  }

  const onMouseMove = (e) => {
    if (drawer){
      draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }
  }

  const changeColor_CirclePicker = (e) => {
    setSelectedColor(e.hex)
    
    // ctx.current.globalCompositeOperation = 'source-over'
  }

  const changeColor_ColorPicker = (e) => {
    setSelectedColor(e)
    setOpenColorPicker(false)
    ctx.current.globalCompositeOperation = 'source-over'
  }

  const closeColorPicker = (event, reason) => {
    if (reason && reason == "backdropClick") 
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

  const pickWord1 = async() => {
    setOpenModal(false);
    setWord(word1.at(0))
    await api.put('/games/'+window.location.pathname.split("/")[2]+"/word/"+word1.at(0));
    setTicking(true)
    await api.put('/nextRound/' + gameToken);
  }  

  const pickWord2 = async() => {
    setOpenModal(false);
    setWord(word2.at(0))
    await api.put('/games/'+window.location.pathname.split("/")[2]+"/word/"+word2.at(0));
    setTicking(true)
    await api.put('/nextRound/' + gameToken);
  }  

  const pickWord3 = async() => {
    setOpenModal(false);
    setWord(word3.at(0))
    await api.put('/games/'+window.location.pathname.split("/")[2]+"/word/"+word3.at(0));
    setTicking(true)
    await api.put('/nextRound/' + gameToken);
  }  

  const makeGuess = async() =>{
    const response = await api.get('/games/'+window.location.pathname.split("/")[2]+"/user/"+localStorage.getItem("token")+"/word/"+guessedWord);
    if (response.data){
      alert("Your guess is correct")
    }
    else{
      alert("Wrong! Try again...")
    }
  }



  return (
    <BaseContainer className="drawing container">

    <Modal
        open={openModal}
        //onClose={handleCloseModal} //would close if you click outside of the modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box textAlign='center' sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "25vw", bgcolor: 'background.paper', boxShadow: 24, p: 5,}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Choose one word:
          </Typography>
          <Button variant="text" color="secondary" onClick={pickWord1}>
            {word1}
          </Button>
          <Button  variant="text" color="secondary" onClick={pickWord2}>
            {word2}
          </Button>
          <Button  variant="text" color="secondary" onClick={pickWord3}>
            {word3}
          </Button>
        </Box>
    </Modal>
  
    <div className="drawing timer">
        {/* referred from https://www.npmjs.com/package/react-countdown-circle-timer */}
       <CountdownCircleTimer
          isPlaying={ticking}
          duration={10} //here we can add the time which is selected
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[60, 30, 10, 0]}
          // need to implement further
          onComplete={finishDrawing}>
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
    </div>

    {
      drawer?
      <div>
        <h1 className="drawing h1">Draw the Word: <h2 className="drawing h2">{word}</h2></h1>
        <div className="drawing settings">      
        <div className="drawing icons">
          <FaTrashAlt display={drawer} className="drawing trash"  title="click to erase all" style={{border:isDeleting}} size={"2.2em"} onClick={clear}/>
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
      :null //hide if not drawer
    }
      
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
     <br />
     {
      !drawer?
      <div align="center">
        <form>
          <label>Enter your guess:
            <input 
              type="text" 
              value={guessedWord}
              onChange={(e) => setGuessedWord(e.target.value)}
            />
          </label>
          <Button onClick={makeGuess}>submit</Button>         
          </form>
      </div>
      :null
      }
    </BaseContainer>

  );
}

export default Game;