import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { inputProtection } from "../protection";


function Home(){
  const [player, setPlayer] = useState("")
  const [roomName, setRoomName] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputProtection(player, roomName, (msg) => alert(msg)))
      return;

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
          onChange={(e) => setRoomName(e.target.value)}
          /><br/><br/>

        <button type="submit">Rejoindre</button>
      </form>

    </div>
  )
}

export default Home;