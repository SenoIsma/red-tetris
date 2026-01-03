import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import socket from '../socket.js'
import { inputProtection } from "../protection.js";
import { useDispatch, useSelector } from "react-redux";
import { setHostId, setPlayers } from "../store/slices/gameSlice.js";

function Game(){
    const {roomName, playerName} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const player = useSelector(state=>state.game.players);
    const host = useSelector(state=>state.game.hostId);
    const playerHost = player.find(p => p.id === host);

    useEffect(() => {
        if (!inputProtection(playerName, roomName)){
            navigate('/');
            return;
        }
    }, [roomName, playerName, navigate]);

    useEffect(() => {
        socket.emit('player:join', {roomName, playerName});
        socket.on('game:players-update', (data) => {
            dispatch(setPlayers(data.players));
            dispatch(setHostId(data.host.id));
        });
        return () => socket.off('game:players-update');
    }, []);

    return(
        <div>
            <h1> {`Game Page - ${playerName} dans ${roomName}`} </h1><br/>
            <h2>Joueurs connectés (host : {playerHost?.name || "En attente..."}):</h2>
            <ul>
                {player.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
        </div>
    )
}

export default Game;