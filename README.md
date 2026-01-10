# Red Tetris - Multiplayer Tetris Game

Projet pédagogique Full Stack JavaScript : un Tetris multijoueur en réseau utilisant React, Redux, Node.js et Socket.io.

## 🚧 Ce qu'il reste à faire

### Phase 1 : Compléter le jeu en solo

#### 1.1 - Game Over Detection
- [X] Détecter quand une nouvelle pièce ne peut pas entrer (y=0 et collision)
- [X] Arrêter le game loop
- [X] Afficher "Game Over" à l'écran
- [X] Permettre de restart (nouvelle partie)

#### 1.2 - Next Piece Preview
- [X] Créer un composant `NextPiece.jsx`
- [X] Afficher la prochaine pièce à côté du board
- [X] Stocker `nextPiece` dans le state

#### 1.3 - Spectrum View
- [ ] Créer un composant `Spectrum.jsx`
- [ ] Calculer la hauteur de chaque colonne (fonction pure)
- [ ] Afficher une mini-vue (10 colonnes en barres verticales)
- [ ] Mettre à jour en temps réel

---

### Phase 2 : Lobby et démarrage de partie

#### 2.1 - Page Lobby (avant le start)
- [X] Créer un état `gameStatus` dans Redux : `'waiting'` | `'playing'` | `'finished'`
- [X] Afficher un bouton "Start Game" **uniquement pour le host**
- [X] Liste des joueurs en attente
- [X] Désactiver les entrées de nouveaux joueurs une fois la partie démarrée

#### 2.2 - Backend : Événement `game:start`
- [X] Créer l'événement `game:start` dans `backend/src/index.js`
- [X] Vérifier que l'émetteur est bien le host
- [X] Changer le status de la game en `'playing'`
- [X] Émettre `game:status-update` à tous les clients de la room

#### 2.3 - Frontend : Réception `game:start`
- [ ] Écouter `game:status-update` dans `Game.jsx`
- [ ] Dispatcher `setGameStatus('playing')` dans Redux
- [ ] Afficher le Board uniquement si `gameStatus === 'playing'`

---

### Phase 3 : Synchronisation multiplayer

#### 3.1 - Distribution des pièces par le serveur
**Important** : Tous les joueurs doivent recevoir la **même séquence de pièces** aux **mêmes coordonnées**.

**Backend :**
- [ ] Créer événement `piece:request` (client demande la prochaine pièce)
- [ ] Répondre avec `piece:next` contenant `{ type, x, y, rotation }`
- [ ] Utiliser `Game.pieceSequence` et `Game.currentPieceIndex`
- [ ] Incrémenter l'index à chaque distribution

**Frontend :**
- [ ] Supprimer `generateRandomPiece()` du Board
- [ ] Demander la pièce au serveur via `socket.emit('piece:request')`
- [ ] Recevoir la pièce via `socket.on('piece:next', (piece) => ...)`
- [ ] Utiliser cette pièce dans le state

#### 3.2 - Envoi du spectrum en temps réel
**Backend :**
- [ ] Créer événement `player:spectrum-update`
- [ ] Stocker le spectrum du joueur dans `Player.spectrum`
- [ ] Émettre à tous les joueurs de la room : `game:spectrums-update`

**Frontend :**
- [ ] Calculer le spectrum du board actuel (fonction pure)
- [ ] Envoyer `socket.emit('player:spectrum-update', spectrum)` après chaque lock
- [ ] Écouter `game:spectrums-update` et l'afficher

#### 3.3 - Affichage des spectres des adversaires
- [ ] Créer composant `OpponentSpectrum.jsx`
- [ ] Afficher un spectrum miniature pour chaque adversaire
- [ ] Indiquer le nom du joueur
- [ ] Mettre à jour en temps réel

---

### Phase 4 : Lignes de pénalité

#### 4.1 - Détection de clear lines
- [ ] Après `clearLines()`, compter le nombre de lignes supprimées
- [ ] Envoyer au serveur : `socket.emit('player:line-clear', { count })`

#### 4.2 - Backend : Distribution des pénalités
- [ ] Événement `player:line-clear`
- [ ] Calculer pénalité : `n - 1` lignes (si n lignes clearées)
- [ ] Émettre `game:penalty-lines` aux **adversaires** (pas à l'émetteur)

#### 4.3 - Frontend : Réception des pénalités
- [ ] Écouter `game:penalty-lines`
- [ ] Créer fonction `addPenaltyLines(board, count)` dans `board.js`
- [ ] Ajouter `count` lignes indestructibles en bas du board
- [ ] Décaler tout le board vers le haut

---

### Phase 5 : Win/Lose et fin de partie

#### 5.1 - Événement `player:lose`
**Frontend :**
- [ ] Détecter le game over local
- [ ] Envoyer `socket.emit('player:lose')`
- [ ] Arrêter le game loop
- [ ] Continuer à afficher le board (mode spectateur)

**Backend :**
- [ ] Événement `player:lose`
- [ ] Marquer `player.isAlive = false`
- [ ] Émettre `game:player-lost` à tous
- [ ] Vérifier s'il reste 1 seul joueur vivant
- [ ] Si oui, émettre `game:end` avec le vainqueur

#### 5.2 - Affichage de la fin de partie
- [ ] Écouter `game:player-lost` et mettre à jour la liste des joueurs (barré/grisé)
- [ ] Écouter `game:end` et afficher "Winner: <name>"
- [ ] Bouton "Restart" pour le host

#### 5.3 - Restart
**Backend :**
- [ ] Événement `game:restart` (réservé au host)
- [ ] Réinitialiser la game (reset pieceSequence, players)
- [ ] Émettre `game:status-update` avec status `'waiting'`

**Frontend :**
- [ ] Bouton "Restart" pour le host
- [ ] Réinitialiser le board, les states
- [ ] Retour au lobby

---

### Phase 6 : Tests (Coverage minimum requis)

**Requis du projet :**
- Statements : ≥ 70%
- Functions : ≥ 70%
- Lines : ≥ 70%
- Branches : ≥ 50%

#### 6.1 - Tests des pure functions (Frontend)
- [ ] Tester `createEmptyBoard()`
- [ ] Tester `canPlacePiece()` (collisions murs, sol, autres pièces)
- [ ] Tester `placePiece()`
- [ ] Tester `clearLines()` (0, 1, 2, 3, 4 lignes)
- [ ] Tester `rotatePiece()`
- [ ] Tester `moveLeft()`, `moveRight()`, `moveDown()`
- [ ] Tester `hardDrop()`

#### 6.2 - Tests des classes serveur (Backend)
- [ ] Tester `Player` (constructor, méthodes)
- [ ] Tester `Piece` (rotations, formes)
- [ ] Tester `Game` (start, join, pieceSequence)
- [ ] Tester `GameManager` (createGame, getGame, deleteGame)

#### 6.3 - Tests des composants React
- [ ] Installer `@testing-library/react`
- [ ] Tester `Board` rendering
- [ ] Tester keyboard events

#### 6.4 - Vérifier le coverage
```bash
# Frontend
cd frontend
npm run coverage

# Backend
cd backend
npm run coverage
```

---

### Phase 7 : Polish et Production

#### 7.1 - CSS et UI
- [ ] Améliorer le design du board (ombres, bordures)
- [ ] Styliser le lobby
- [ ] Animations de clear lines
- [ ] Responsive design (optional)

#### 7.2 - Gestion d'erreurs
- [ ] Gérer la déconnexion socket (reconnexion ?)
- [ ] Gérer les noms de joueurs en doublon
- [ ] Messages d'erreur clairs
- [ ] Validation des inputs

#### 7.3 - Build de production
```bash
# Build frontend
cd frontend
npm run build

# Le backend doit servir le build
# Configurer backend/src/index.js pour servir frontend/dist
```

#### 7.4 - Documentation finale
- [ ] Instructions de lancement
- [ ] Protocole socket (événements)
- [ ] Captures d'écran

---

## 🎯 Priorités pour les prochaines sessions

### Session 1 : Game Over + Next Piece
1. Détecter game over (pièce ne peut pas spawn)
2. Afficher "Game Over"
3. Créer composant NextPiece

### Session 2 : Lobby et Start Game
1. État gameStatus dans Redux
2. Backend : événement `game:start`
3. Bouton "Start" pour le host
4. Cacher le Board avant le start

### Session 3 : Synchronisation des pièces
1. Backend : `piece:request` et `piece:next`
2. Frontend : demander pièces au serveur
3. Tester avec 2 navigateurs

### Session 4 : Spectrum
1. Fonction `calculateSpectrum(board)`
2. Composant Spectrum
3. Envoi en temps réel

### Session 5 : Pénalités
1. Compter les lignes clearées
2. Backend : distribution aux adversaires
3. Frontend : `addPenaltyLines()`

### Session 6 : Win/Lose
1. Événement `player:lose`
2. Détection du vainqueur
3. Affichage de fin de partie

### Session 7+ : Tests
1. Tests pure functions (priorité absolue)
2. Tests backend
3. Coverage ≥ 70%

---

## 📚 Ressources

- [Tetris Wiki](https://tetris.wiki/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Documentation](https://react.dev/)

---

## 🔍 Contraintes techniques (rappel)

### Client (Browser)
- ✅ Programmation fonctionnelle (PAS de `this`)
- ✅ Pure functions pour la logique de jeu
- ✅ Framework moderne (React)
- ✅ Single Page Application
- ✅ Socket.io pour communication
- ✅ Grid/Flexbox pour layouts
- ❌ jQuery, Canvas, SVG, `<table>` interdits

### Server (Node.js)
- ✅ OOP avec prototypes
- ✅ Classes minimum : Player, Piece, Game
- ✅ Socket.io pour communication
- ✅ Serve index.html et bundle.js

### Règles du jeu
- ✅ Grille 10×20
- ✅ 7 Tetriminos avec rotations
- ⏳ Même séquence de pièces pour tous (à implémenter)
- ⏳ Lignes de pénalité (n-1) (à implémenter)
- ⏳ Spectrum temps réel (à implémenter)
- ✅ URL : `http://server:port/<room>/<player>`
- ✅ Premier joueur = hôte
- ✅ Solo et multiplayer

---

## 🐛 Bugs connus et corrigés

### ✅ Bugs résolus
- ✅ Rotation du J incorrecte (rotation 2 corrigée)
- ✅ Duplication visuelle après hard drop (timeout retiré)
- ✅ Changement de couleur pendant la chute (utilisation de `newPiece.type` au lieu de `currentPiece.type`)
- ✅ Game loop se réinitialisait à chaque touche (utilisation de `useRef` avec dépendances vides)
- ✅ Race condition pendant le lock (état `isLocked` ajouté)

---

**Bon courage pour la suite ! 🚀**
