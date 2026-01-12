import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { inputProtection } from "../protection";
import { useDispatch } from "react-redux";
import { setPlayerName } from "../store/slices/playerSlice";
import { setRoomName } from "../store/slices/gameSlice";
import socket from '../socket.js';

import './Home.css';


function Home(){
  const [player, setPlayer] = useState("")
  const [roomName, setRoom] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputProtection(player, roomName, (msg) => alert(msg)))
      return;

    socket.emit("player:check-username", { roomName, playerName: player }, (response) => {
      if (!response.available) {
        alert(response.error);
        return;
      }

      dispatch(setRoomName(roomName));
      dispatch(setPlayerName(player));
      navigate(`/game/${roomName}/${player}`);
    });
  }

  return(
    <div className="form-container">
      <p className="title">Red Tetris</p>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="username">Pseudo</label>
          <input 
            type="text" 
            id="username" 
            value={player} 
            onChange={(e) => setPlayer(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="room">Room</label>
          <input 
            type="text" 
            id="room" 
            value={roomName} 
            onChange={(e) => setRoom(e.target.value)} />
        </div>
        <button className="sign" type="submit">Rejoindre</button>
      </form>

    </div>
  )
}

export default Home;