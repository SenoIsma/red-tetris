
export function inputProtection(playerName, roomName, onError){
    if (!roomName || !playerName){
        if (onError) onError("Veuillez remplir tous les champs");
        return false;
    }
    const isValidName = /^[a-zA-Z0-9_-]+$/.test(roomName) && /^[a-zA-Z0-9_-]+$/.test(playerName);
    if (!isValidName){
        if (onError) onError("Seulement lettres, chiffres, tirets et underscores");
        return false;
    }
    if (roomName.length > 20 || playerName.length > 20){
        if (onError) onError("Le nom est trop long (max 20 caractères)");
        return false;
    }
    return true;
}
