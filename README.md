# Red Tetris - Multiplayer Tetris Game

Projet pédagogique Full Stack JavaScript : un Tetris multijoueur en réseau utilisant React, Redux, Node.js et Socket.io.

---

## 🚧 CE QU'IL RESTE À FAIRE (2 éléments)


### 🔴 PRIORITÉ 1 - Tests & Coverage (OBLIGATOIRE pour valider le projet)
**Temps estimé : 12-16 heures**

Le sujet exige **minimum 70%** de coverage (statements, functions, lines) et **50%** branches.

#### Setup initial (Backend & Frontend)
- [ ] Installer Jest : `npm install --save-dev jest @types/jest`
- [ ] Configurer `jest.config.js` dans chaque projet
- [ ] Ajouter scripts dans `package.json` :
  ```json
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
  ```

#### Tests des pure functions (Frontend - PRIORITÉ ABSOLUE)
**Fichier :** [frontend/src/utils/board.test.js](frontend/src/utils/board.test.js) (à créer)
- [ ] `createEmptyBoard()` : vérifier dimensions 10×20 et cellules vides
- [ ] `canPlacePiece()` : collision murs gauche/droite, sol, pièces existantes
- [ ] `placePiece()` : pièce ajoutée aux bonnes coordonnées
- [ ] `clearLines()` : 0, 1, 2, 3, 4 lignes complètes, vérifier auto-refill
- [ ] `calculateSpectrum()` : hauteurs correctes pour chaque colonne

**Fichier :** [frontend/src/utils/movement.test.js](frontend/src/utils/movement.test.js) (à créer)
- [ ] `moveLeft()`, `moveRight()`, `moveDown()` : déplacement correct
- [ ] `rotate()` : rotation dans les 4 états
- [ ] `hardDrop()` : pièce descend jusqu'au premier obstacle

**Fichier :** [frontend/src/utils/pieces.test.js](frontend/src/utils/pieces.test.js) (à créer)
- [ ] `getShape()` : vérifier formes des 7 tetriminos
- [ ] `rotatePiece()` : tester rotations des 7 pièces
- [ ] `getPieceColor()` : couleurs correctes

#### Tests des classes Backend
**Fichier :** [backend/src/models/Player.test.js](backend/src/models/Player.test.js) (à créer)
- [ ] Constructor : propriétés initialisées (id, name, isAlive, linesCleared...)
- [ ] `lose()` : `isAlive = false`
- [ ] `clearLines(count)` : incrémente `linesCleared`
- [ ] `addPenaltyLines(count)` : incrémente `penaltyLines`

**Fichier :** [backend/src/models/Piece.test.js](backend/src/models/Piece.test.js) (à créer)
- [ ] Vérifier les 7 tetriminos (I, O, J, L, S, Z, T)
- [ ] Vérifier les 4 rotations de chaque pièce
- [ ] `getShape(type, rotation)` : retourne la bonne forme

**Fichier :** [backend/src/models/Game.test.js](backend/src/models/Game.test.js) (à créer)
- [ ] Constructor : initialisation correcte
- [ ] `addPlayer(player)` : ajoute au tableau
- [ ] `removePlayer(playerId)` : retire du tableau
- [ ] `start()` : génère `pieceSequence`, change state en 'playing'
- [ ] `generatePieceSequence()` : 1000 pièces aléatoires
- [ ] `getNextPiece(playerId)` : retourne la bonne pièce selon l'index du joueur
- [ ] `checkWinner()` : détecte le dernier joueur vivant

**Fichier :** [backend/src/managers/GameManager.test.js](backend/src/managers/GameManager.test.js) (à créer)
- [ ] `createGame(roomName)` : crée une nouvelle game
- [ ] `getGame(roomName)` : récupère une game existante
- [ ] `deleteGame(roomName)` : supprime une game

#### Tests des composants React (optionnel mais recommandé)
**Setup :** `npm install --save-dev @testing-library/react @testing-library/jest-dom`

**Fichier :** [frontend/src/components/Board.test.jsx](frontend/src/components/Board.test.jsx) (à créer)
- [ ] Affichage de la grille 10×20
- [ ] Affichage d'une pièce
- [ ] Game over visible

#### Vérifier le coverage
```bash
# Frontend
cd frontend
npm run test:coverage

# Backend
cd backend
npm run test:coverage

# Objectif : ≥70% statements/functions/lines, ≥50% branches
```

---

### 🟡 PRIORITÉ 2 - Build de production (optionnel mais recommandé)
**Temps estimé : 2-3 heures**

#### Configuration Backend pour servir le Frontend
**Fichier :** [backend/src/index.js](backend/src/index.js)
- [ ] Ajouter `express.static` pour servir `frontend/dist`
- [ ] Route catch-all pour SPA (retourne `index.html`)

#### Script de build complet
**Fichier racine :** [package.json](package.json) (à créer)
```json
{
  "scripts": {
    "install:all": "cd backend && npm install && cd ../frontend && npm install",
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start"
  }
}
```
