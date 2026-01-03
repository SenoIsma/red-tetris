import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { inputProtection } from "../protection";
import { useDispatch } from "react-redux";
import { setPlayerName } from "../store/slices/playerSlice";
import { setRoomName } from "../store/slices/gameSlice";


function Home(){
  const [player, setPlayer] = useState("")
  const [roomName, setRoom] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputProtection(player, roomName, (msg) => alert(msg)))
      return;

    dispatch(setRoomName(roomName));
    dispatch(setPlayerName(player));
    navigate(`/game/${roomName}/${player}`);
  }

  return(
    <div>
      <h1>Red Tetris</h1>
      <h2>Bienvenue</h2>

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="pseudo" 
          value={player} 
          onChange={(e) => setPlayer(e.target.value)}
          /><br/>

        <input 
          type="text" 
          placeholder="nom de la room" 
          value={roomName} 
          onChange={(e) => setRoom(e.target.value)}
          /><br/><br/>

        <button type="submit">Rejoindre</button>
      </form>

    </div>
  )
}

export default Home;