import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import socket from '../socket.js'
import { inputProtection } from "../protection.js";
import { useDispatch } from "react-redux";
import { setHostId, setPlayers } from "../store/slices/gameSlice.js";

function Game(){
    const {roomName, playerName} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!inputProtection(playerName, roomName))
            navigate('/');
            return;
    }, [roomName, playerName, navigate]);

    useEffect(() => {
        socket.emit('player:join', {roomName, playerName});
        socket.on('game:players-update', (data) => {
            dispatch(setPlayers(data.players));
            dispatch(setHostId(data.host.id));
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