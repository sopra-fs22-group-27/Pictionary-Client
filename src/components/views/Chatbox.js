import React, { useEffect, useRef} from "react";
import useState from 'react-usestateref';
import { api, handleError } from "helpers/api";
import "styles/views/Chatbox.scss";
import Badge from '@mui/material/Badge';

import {over} from 'stompjs';
import SockJS from 'sockjs-client';


var stompClient = null;
const Chatbox = ({gameToken, user}) => {
    const [privateChats, setPrivateChats] = useState(new Map());    
    const [publicChats, setPublicChats] = useState([]);
    const [unread, setUnread, unreadRef] = useState(new Map());
    const [tab, setTab, tabRef] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: user.username,
        receiverUsername: '',
        connected: false,
        message: ''
    });
    
    useEffect(() => {
      console.log(userData);
    }, [userData]);

    useEffect(() => {
        console.log(unread);
        console.log(unreadRef.current)
      }, [unread]);

    useEffect(() => {
        console.log(tab);
      }, [tab]);


    useEffect(() => {
        registerUser();
    }, [])

    const getUsernamesInGame = async() => {
        try{
            const response = await api.get('/games/' + gameToken + '/usernames');
            const usernames = response.data;
            usernames.forEach((playerUsername, index) => {
                if (playerUsername !== userData.username){
                    // initilize playerUsernames
                    privateChats.set(playerUsername, []);
                    setPrivateChats(new Map(privateChats));
                    // initilize number of unread messages of users
                    let munread = unread.set(playerUsername, 0);
                    setUnread(new Map(munread));
                    // console.log(unread);
                }
            // initilize number of unread messages of public chatroom
            let munread = unread.set("CHATROOM", 0)
            setUnread(munread);
            });
        } catch (error) {
            console.error(`Something went wrong while fetching the usernames: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the usernames! See the console for details.");
        }
    }

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
        getUsernamesInGame();
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        // get public message
        stompClient.subscribe('/chatroom/public', onPublicMessage);
        // get private message
        stompClient.subscribe('/user/' + userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin= () => {
          var chatMessage = {
            senderUsername: userData.username,
            chatStatus:"JOIN"
          };
          // connected
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onPublicMessage = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        console.log(tab);
        console.log(payloadData);
        switch(payloadData.chatStatus){
            case "JOIN":
                // if(!privateChats.get(payloadData.senderUsername)){
                //     privateChats.set(payloadData.senderUsername,[]);
                //     setPrivateChats(new Map(privateChats));
                // }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                if (payloadData.senderUsername !== userData.username && tabRef.current !== "CHATROOM") {
                    // console.log(unread.get("CHATROOM"));
                    let msg = unreadRef.current.get("CHATROOM");
                    let munread = unreadRef.current.set("CHATROOM", msg + 1);
                    setUnread(new Map(munread));

                } else if (tabRef.current === "CHATROOM"){
                    let munread = unreadRef.current.set("CHATROOM", 0);
                    setUnread(new Map(munread));
                }
                // console.log(tab);

                break;
        }
    }

    const onPrivateMessage = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        console.log(tab);
        console.log(tabRef.current)
        if(privateChats.get(payloadData.senderUsername)){
            privateChats.get(payloadData.senderUsername).push(payloadData);
            setPrivateChats(new Map(privateChats));
            if (userData.username !== payloadData.senderUsername && tabRef.current !== payloadData.senderUsername && userData.username === payloadData.receiverUsername) {
                let msg = unreadRef.current.get(payloadData.senderUsername);
                let munread = unreadRef.current.set(payloadData.senderUsername, msg + 1);
                console.log("munread:", munread)
                setUnread(new Map(munread));
            } else if (tabRef.current === payloadData.senderUsername){
                let munread = unreadRef.current.set(payloadData.senderUsername, 0);
                setUnread(new Map(munread));
            }else{
                console.log("dsfsdddddddddddddddddddddddddddddddddddddddddddd");
            }
        }else{
            // let list = [];
            // list.push(payloadData);
            // privateChats.set(payloadData.senderUsername, []);
            // setPrivateChats(new Map(privateChats));
            console.log("dsfsdddddddddddddddddddddddddddddddddddddddddddd");
        }
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData, "message": value});

    }

    const sendPublicMessage = () => {
        if (userData.message === null || userData.message === "") {
        
        } else if (stompClient) {
            var chatMessage = {
            senderUsername: userData.username,
            message: userData.message,
            chatStatus:"MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    }

    const sendPrivateMessage = () => {
        if (userData.message === null || userData.message === "") {
         
        } else if (stompClient) {
          var chatMessage = {
            senderUsername: userData.username,
            receiverUsername: tab,
            message: userData.message,
            chatStatus:"MESSAGE"
          };
          setTab(tab);
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }

          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const clearUnreadMessages = (name) => {
        unread.set(name, 0);
        setUnread(new Map(unread));

    }

    const registerUser = () => {
        // if (!localStorage.getItem('tab')) {
        //     localStorage.setItem('tab', "CHATROOM");
        // }
        connect();
    }
    
    return (
    <div className="c-container">
        {userData.connected?
        <div className="chat-box">
            <div className="member-list">
                <ul>
                    
                    <li onClick={()=>{ setTab("CHATROOM"); clearUnreadMessages("CHATROOM"); }} className={`member ${tab==="CHATROOM" && "active"}`}>Public Chatroom
                        <Badge sx={{
                            float: "right",
                            marginTop: "1em",
                        }} color="error" badgeContent={tabRef.current === "CHATROOM"? 0: unread.get("CHATROOM")} showZero={false}>
                        </Badge>
                    </li>

                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{ setTab(name); clearUnreadMessages(name); }} className={`member ${tab===name && "active"}`} key={index}>User {name}
                            <Badge sx={{
                                float: "right",
                                marginTop: "1em",
                            }} color="error" badgeContent={tabRef.current === name? 0: unread.get(name)} showZero={false}>
                            </Badge>
                        </li>
                    ))}
                </ul>
            </div>
            {tab==="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat, index)=>(
                        <li className={`message ${chat.senderUsername === userData.username && "self"}`} key={index}>
                            {chat.senderUsername !== userData.username && <div className="avatar">{chat.senderUsername}</div>}
                            {chat.senderUsername === userData.username && <div className="avatar self">{chat.senderUsername}</div>}
                            <div className="message-data">{chat.message}</div>
                            
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendPublicMessage}>send</button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={`message ${chat.senderUsername === userData.username && "self"}`} key={index}>
                            {chat.senderUsername !== userData.username &&<div className="avatar">{chat.senderUsername}</div>}
                            {chat.senderUsername === userData.username && <div className="avatar self">{chat.senderUsername}</div>}
                            <div className="message-data">{chat.message}</div>
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendPrivateMessage}>send</button>
                </div>
            </div>}
        </div>
        :
        <div className="register-text">
            {/* <input
                id="user-name"
                placeholder="Enter your name"
                name="username"
                value={userData.username}
                onChange={handleUsername}
                margin="normal"
              /> */}
              {/* <button type="button" onClick={registerUser}>
                    connect
              </button>  */}
        </div>}
    </div>
    )
}

export default Chatbox;