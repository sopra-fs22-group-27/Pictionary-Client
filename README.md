![Pictionary_logo](https://user-images.githubusercontent.com/45404885/168472154-48f812ac-7ab4-4b09-8586-1145cedabcc3.png)


## Infromation about the project

https://pictionary-client-22.herokuapp.com/login

## Current project status

[![Deploy Project](https://github.com/sopra-fs22-group-27/Pictionary-Client/actions/workflows/deploy.yml/badge.svg)](https://github.com/sopra-fs22-group-27/Pictionary-Client/actions/workflows/deploy.yml)

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=sopra-fs22-group-27_Pictionary-Client&metric=coverage)](https://sonarcloud.io/summary/new_code?id=sopra-fs22-group-27_Pictionary-Client)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=sopra-fs22-group-27_Pictionary-Client&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=sopra-fs22-group-27_Pictionary-Client)


## Introduction: 
The game Pictionary is an interactive drawing game. The rules of this game are amazingly simple. A game consists of custom number of rounds where someone must draw an offered word and the others must guess it. If someone guesses the word correctly, the player gets 10 points. The player with the most points at the end wins the game and receive ranking points. One difference between our application and other Pictionary games is that the drawer can also get points. This is possible because we use the Google Vision API which recognizes what the player is drawing.

## Technologies
Cloudinary,
Spring,
SonarQube,
React,
npm,
JSX,
Java,
Java Persistence,
heroku,
gradle,
GitHub Projects,
GitHub Actions,
HTML Canvas

## High-level components

[Game](https://github.com/sopra-fs22-group-27/Pictionary-Client/blob/master/src/components/views/Game.js)
This is the most crucial component, as it is here that the game takes place. This component is used by both the drawers and the guessers to show the game interface. When the game begins, players are sent to this component from the component WaitingScreen. Depending on the role of the player different tools are shown (eg. palette for drawers, canvas, the drawing word and more) or (eg. canvas for guessers, and the input box).

[Homepage](https://github.com/sopra-fs22-group-27/Pictionary-Client/blob/master/src/components/views/HomePage.js)
After logging in, the Player can interact with the program using this component. They can view all of the Lobbies and join them (which will take them to the WaitingScreen), or they can make their own game (which will take them to Create-Game), or they can go to the scoreboard and look at the scores or their profile.

[Scoreboard](https://github.com/sopra-fs22-group-27/Pictionary-Client/blob/master/src/components/views/ScoreBoard.js)
On the scoreboard, logged in users are able to view their and others overall scores. From the scoreboard users are able to look at their profile and change their information. 

~~[Chat](https://github.com/sopra-fs22-group-27/Pictionary-Client/blob/master/src/components/views/Chatbox.js)
The chat is made to send messages during the game. In the chat the player is able to message a single person or the whole lobby. This brings another interaction component to the application.~~ Since chatbox can only work locally, and always fail when being deployed to heroku, so we remove it.

[Create Game](https://github.com/sopra-fs22-group-27/Pictionary-Client/blob/master/src/components/views/CreateGame.js)
In the create game component the user is able to customize a game. The user can set different parameters like: name, roundlength, maximal playercount, round quantity, and a password to make a private game with friends. 

## Launch and Deployment
For your local development environment, you will need Node.js. You can download it [here](https://nodejs.org). All other dependencies, including React, get installed with:

```
npm install
```

Run this command before you start your application for the first time. Next, you can start the app with:

```
npm run dev
```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use Google Chrome).

### Build
Finally, `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Illustrations

### Drawer
![Pictionary](https://github.com/sopra-fs22-group-27/Pictionary-Client/blob/master/src/resources/second_gif.gif)

### Guesser
![Pictionary](https://github.com/sopra-fs22-group-27/Pictionary-Client/blob/master/src/resources/first_gif.gif)


## Roadmap

- Add a different game mode  where the users can play some kind of drinking game.
- Create shapes which could be used by drag & drop during drawing.
- Make the application more secure. 

## Acknowledgements

This project was started using this template -> [Client](https://github.com/HASEL-UZH/sopra-fs22-template-client)

## Team Members

- [Rafael Dubach](https://github.com/radubauzh)
- [Raphael Wäspi](https://github.com/sumsumcity)
- [Dylan Baumgartner](https://github.com/mrspacerobot)
- [Solveig Helland](https://github.com/hellasol)
- [Shaoyan Li](https://github.com/SyLi9527)

## License

[MIT license](https://github.com/sopra-fs22-group-27/Pictionary-Client/blob/master/LICENSE)


