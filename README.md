# tictactoe

TicTacToe game implemented in Javascript with three different computer playing styles:

* Chaotic: Computer chooses his field by random
* Balanced: Computer tries to prevent the player from winning and simultaneously tries to win himself, 
but is not able to recognize dilemma moves
* Strategic: Computer is unbeatable

Main idea of the implementation is the mapping of the fields to a 3x3 magical square, 
where every row, every column and every diagonal add up to 15 and thereby facillitate 
the process of finding the best possible moves.


#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  2  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  9  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  4
#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  7  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  5  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  3
#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  6  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  1  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  8
