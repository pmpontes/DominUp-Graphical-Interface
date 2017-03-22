# DominUp-Graphical-Interface

Developed for a Graphic Programing course - LAIG - this is a graphical interface for the game DominUp. The communication between the game logic - developed in Prolog - and the GUI was achieved through sockets. The graphic interface is WebGL based.

## Game Rules

At each match - which can last from 10 to 30 minutes - starts with the random distribution of the pieces among players, as in the game of Domino. 
In this case, it was considered a set of pieces numbered from 0 to 7, making a total of 36 pieces.
Additionally, it was considered only the existence of 2 or 4 players, although the game can be played by more players.
The player with the double-7 piece will start the game, placing a piece of its choice in the middle of the playing surface.

DominUp's rules provide for two types of placement, both of which imply the alignment of the pieces with an imaginary orthogonal grid:
- Vertical placement - the piece is placed on two adjacent pieces of the same level, so that the piece's symbols correspond to the symbols below;
- Horizontal placement - the piece is placed on the table, orthogonally and adjacent to at least one piece already placed.

The following rounds will be played in turn, until the game ends:
- If it is possible to make a vertical placement with at least one of the parts available, this should be the move made. This action should be repeated until no more vertical placements can be made;
- If there is at least one piece available, it is valid to make a horizontal placement, without prejudice to the previous point, and then the player must give up his turn.

If, after his turn, a player has no pieces, that player has won, and the game ends.

## Interface

The interface allows customization of some game options listed below.

### Pause
To pause the gameplay, to avoid loosing a turn;

### Undo
To undo the last move(s);

### Theme
To choose a theme (Space, Airport, Road);

### Look
To choose the pieces look (Wood, Marble, Plastic);

### Hint
To get a hint for a valid move;

### Game mode
To play, there are three different modes (Human vs. Human/Human vs. Computer/Computer vs Computer);

### Review
To review the gameplay, as an animation;

## Getting Started

### Prerequisites

To run the game, the following software is required:

-SICStus Prolog - to run the game's logic in Prolog;

-Mongoose - web server to connect; save the .exe file in the project folder.

### Installing

To get the game up and running follow these steps:

1. Open SICStus console
2. Go to File->Consult
3. Navigate to the folder dominup\gameEngine and select the file server.pl
4. Write "server." on the console
5. Execute mongoose and navigate to the dominup folder
