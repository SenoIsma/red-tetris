# Red Tetris - Multiplayer Tetris Game

Projet pédagogique Full Stack JavaScript : un Tetris multijoueur en réseau utilisant React, Redux, Node.js et Socket.io.

## 📋 Prérequis

- Node.js >= 18.x
- npm >= 9.x
- Navigateur moderne (Chrome, Firefox, Edge)

## 🚀 Installation

```bash
# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

## 🎮 Lancement du projet
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Le jeu sera accessible sur http://localhost:5173

#📚 Plan de développement - Étape par étape

## Phase 1 : Backend - Fondations (Server Node.js)

### Étape 1.1 : Structure de base du serveur ✅

- Créer backend/src/index.js
- Setup Express pour servir les fichiers statiques
- Setup Socket.io sur le serveur
- Tester la connexion avec un console.log

console : ``Server started on port 3000``

### Étape 1.2 : Classes de base (OOP avec prototypes) ✅

- Créer backend/src/models/Player.js (classe avec prototype)
- Créer backend/src/models/Piece.js (classe avec prototype)
- Créer backend/src/models/Game.js (classe avec prototype)
- Rappel : Server = OOP avec prototypes obligatoire

### Étape 1.3 : Gestion des pièces Tetris ✅

- Définir les 7 types de Tetriminos (I, O, T, S, Z, J, L)
- Implémenter les 4 rotations pour chaque pièce
- Créer un générateur de pièces aléatoires
- Important : Même séquence pour tous les joueurs d'une partie

Piece I avec toutes les rotations:
```javascript
    I:             
      [[0,1], [1,1], [2,1], [3,1]]  
      [[2,0], [2,1], [2,2], [2,3]]
      [[0,2], [1,2], [2,2], [3,2]]
      [[1,0], [1,1], [1,2], [1,3]]   
```
    
### Étape 1.4 : Gestion des rooms/games ✅

- Créer un Game Manager (gérer plusieurs parties simultanées)
- Implémenter la création d'une room
- Implémenter la jointure d'une room
- Gérer le rôle d'hôte (premier joueur)

### Étape 1.5 : Socket.io - Événements serveur

- Événement : player:join (joueur rejoint) ✅
- Événement : game:start (hôte démarre)
- Événement : piece:next (distribuer la pièce suivante)
- Événement : player:update (mouvement pièce)
- Événement : player:line-clear (lignes complétées)
- Événement : player:lose (joueur éliminé)
- Événement : game:end (fin de partie)

## Phase 2 : Frontend - Fondations (Client React)

### Étape 2.1 : Structure React de base

- Nettoyer le template Vite (supprimer le code exemple)
- Créer src/App.jsx (composant principal)
- Créer src/pages/Home.jsx (page d'accueil)
- Créer src/pages/Game.jsx (page de jeu)

### Étape 2.2 : Routing et URL

- Installer react-router-dom
- Setup du router : /#<room>/<player_name>
- Parser l'URL pour extraire room et player name
- Rediriger vers Home si URL invalide

### Étape 2.3 : Redux Store (state management)

- Setup Redux Toolkit store
- Créer slice gameSlice (état de la partie)
- Créer slice playerSlice (état du joueur local)
- Créer slice boardSlice (grille de jeu)
- Rappel : Client = Programmation fonctionnelle, PAS de this

### Étape 2.4 : Socket.io Client

- Créer src/services/socket.js
- Connecter au serveur backend
- Créer les listeners pour les événements serveur
- Dispatcher les actions Redux depuis les événements socket

## Phase 3 : Logique du jeu Tetris (Pure Functions)

### Étape 3.1 : Logique de la grille

- Créer src/utils/board.js (fonctions pures)
- Fonction : createEmptyBoard() (grille 10×20)
- Fonction : canPlacePiece(board, piece, x, y) (collision)
- Fonction : placePiece(board, piece, x, y) (figer la pièce)
- Fonction : clearLines(board) (supprimer lignes complètes)
- IMPORTANT : Pure functions uniquement (pas de side effects)

### Étape 3.2 : Logique des pièces

- Créer src/utils/pieces.js (fonctions pures)
- Fonction : rotatePiece(piece) (rotation horaire)
- Fonction : movePiece(piece, dx, dy) (déplacement)
- Fonction : getPieceColor(type) (couleur par type)

### Étape 3.3 : Logique de mouvement

- Fonction : moveLeft() (tester collision)
- Fonction : moveRight() (tester collision)
- Fonction : softDrop() (descente accélérée)
- Fonction : hardDrop() (chute instantanée)
- Fonction : rotate() (rotation avec validation)

### Étape 3.4 : Game loop

- Setup setInterval pour la chute automatique
- Implémenter la "grace frame" (pièce devient fixe au prochain frame)
- Gérer la vitesse de chute constante

## Phase 4 : Interface utilisateur (React Components)

### Étape 4.1 : Composant Board (Grille de jeu)

- Créer src/components/Board.jsx
- Afficher la grille 10×20 avec Grid/Flexbox CSS
- Afficher les blocs fixés
- Afficher la pièce actuelle en mouvement
- Rappel : PAS de Canvas/SVG/Table, uniquement HTML/CSS

### Étape 4.2 : Composant Controls

- Gérer les touches clavier (Arrows, Space)
- Mapper les touches aux actions Redux
- Afficher les instructions à l'écran

### Étape 4.3 : Composant Spectrum

- Créer src/components/Spectrum.jsx
- Afficher la hauteur de chaque colonne (mini vue)
- Mettre à jour en temps réel

### Étape 4.4 : Composant Player List

- Afficher la liste des joueurs dans la room
- Afficher leur spectrum
- Indiquer qui est l'hôte
- Indiquer qui a perdu (game over)

### Étape 4.5 : Composant Lobby

- Page d'attente avant le start
- Bouton "Start" (uniquement pour l'hôte)
- Liste des joueurs connectés

## Phase 5 : Fonctionnalités multijoueur

### Étape 5.1 : Synchronisation des pièces

- Vérifier que tous les joueurs reçoivent la même séquence
- Même position initiale (même coordonnées X,Y)
- Tester avec 2 navigateurs en parallèle

### Étape 5.2 : Lignes de pénalité

- Détecter quand un joueur clear n lignes
- Envoyer n-1 lignes de pénalité aux adversaires
- Ajouter les lignes indestructibles en bas de grille
- Décaler la grille vers le haut

### Étape 5.3 : Gestion de la victoire/défaite

- Détecter le game over (pièce ne peut plus entrer)
- Notifier le serveur
- Continuer à afficher le spectrum (spectateur)
- Détecter le dernier joueur restant = vainqueur

### Étape 5.4 : Restart et host transfer

- Bouton "Restart" pour l'hôte
- Si l'hôte part, transférer le rôle à un autre joueur
- Bloquer les nouveaux joueurs pendant une partie

## Phase 6 : Tests (Coverage minimum requis)

### Étape 6.1 : Setup des tests

- Installer Vitest (test runner)
- Configurer coverage avec c8 ou vitest coverage
- Créer frontend/src/__tests__/ et backend/src/__tests__/

### Étape 6.2 : Tests des pure functions

- Tester createEmptyBoard()
- Tester canPlacePiece()
- Tester placePiece()
- Tester clearLines()
- Tester rotatePiece()

### Étape 6.3 : Tests des classes serveur

- Tester Player (constructor, méthodes)
- Tester Piece (rotations, positions)
- Tester Game (start, join, end)

### Étape 6.4 : Tests React (composants)

- Installer @testing-library/react
- Tester Board rendering
- Tester Controls (keyboard events)
- Tester Spectrum

### Étape 6.5 : Vérifier le coverage

- Lancer npm run coverage
- Vérifier : Statements ≥70%
- Vérifier : Functions ≥70%
- Vérifier : Lines ≥70%
- Vérifier : Branches ≥50%
- Ajouter des tests si coverage insuffisant

## Phase 7 : Polish et Production

### Étape 7.1 : CSS et UI

- Styliser le board (couleurs des Tetriminos)
- Styliser le lobby
- Styliser les spectres des autres joueurs
- Rendre responsive (mobile optional)

### Étape 7.2 : Gestion d'erreurs

- Gérer la déconnexion socket
- Gérer les rooms pleines
- Gérer les noms de joueurs en doublon
- Afficher des messages d'erreur clairs

### Étape 7.3 : Build de production

- Build frontend : npm run build (dans frontend/)
- Configurer backend pour servir le frontend build
- Tester en mode production

### Étape 7.4 : Documentation finale

- Ajouter les instructions de lancement dans README
- Documenter le protocole socket (événements)
- Ajouter des captures d'écran

## Phase 8 : Bonus (optionnel)

- Système de score
- Persistance des scores (DB)
- Mode "pièces invisibles"
- Mode "gravité augmentée"
- Leaderboard

# 🔍 Critères de validation

## Contraintes techniques

- Full Stack JavaScript
- Client : Programmation fonctionnelle (PAS de this)
- Server : OOP avec prototypes (classes Player, Piece, Game)
- Pure functions pour la logique de jeu
- Pas de jQuery/Canvas/SVG/Table
- Layout Grid/Flexbox
- SPA (Single Page Application)
- Socket.io pour la communication

## Contraintes fonctionnelles

- Grille 10×20
- 7 Tetriminos avec rotations
- Même séquence de pièces pour tous les joueurs
- Lignes de pénalité (n-1)
- Spectrum temps réel
- URL : http://server:port/<room>/<player>
- Premier joueur = hôte
- Solo et multiplayer

## Tests

- Coverage ≥ 70% (statements, functions, lines)
- Coverage ≥ 50% (branches)



# 📚 Ressources

- https://tetris.wiki/
- https://socket.io/docs/
- https://redux-toolkit.js.org/
- https://react.dev/

---