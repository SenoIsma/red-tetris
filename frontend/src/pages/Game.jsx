import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import socket from '../socket.js'
import { inputProtection } from "../protection.js";

function Game(){
    const {roomName, playerName} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!inputProtection(playerName, roomName))
            navigate('/');
            return;
    }, [roomName, playerName, navigate]);

    useEffect(() => {
        socket.emit('player:join', {roomName, playerName});
        socket.on('game:players-update', (data) => {
            console.log('Joueurs mis à jour: ', data);
        });
        return () => socket.off('game:players-update');
    }, []);

    return(
        <div>
            <h1> {`Game Page - ${playerName} dans ${roomName}`} </h1>
        </div>
    )
}

export default Game;