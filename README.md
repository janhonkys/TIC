# TIC - TAC - TOE

Create Tic-Tac-Toe board with variable width and height (number of rows and columns). Each cell is a square, that can be either empty (""), or contain "O" or "X" based on player's / computer choice.

The width and height will be chosen at the start of the game and cannot be changed during the game. 
The same is true for line length ('lineLength'), which represents length of the winning line (uninterrupted line of same symbols). 

### Board is represented as String[width][height] 
    [["X","O","X"],["","X",""],["","",""]]

### Rules for width and height of the board are as follows:
    3 <= board.length <= 10

### Rule for the line length:
    3 <= lineLength <= Min(height, width)


## General Game Rules:
  Players take turns placing characters into empty squares ''.
  The first player always places 'X' characters, while the second player always places 'O' characters.
  'X' and 'O' characters are always placed into empty squares, never filled ones.
  The game ends when there are three of the same (non-empty) character filling any row, column, or diagonal.
  The game also ends if all squares are non-empty.
  No more moves can be played if the game is over.

    
# Part 1 (Board Validation): 
### 1. Task
Based on given rules above, create function, that takes array that represents board as parameter, lineLength as second parameter and returns one of the following results. 

Return:

    {
      status: "PLAY|WIN|TIE|ERROR",
      error?: "error message"
    }
   
Result explanation:

    - status: Reresents current status of the game 
         1. If it ended with one of the the players winning (WIN)
         2. If the game is still on (PLAY)
         3. If there is no valid move left but the players did not met winnning criteria (TIE)
         4. Board is not valid (ERROR)
    - error:
         - If status is ERROR, then in this property will be message explaining what caused it
           eg: Player two started the game



### 2. Task 
Create input or file reader that will call the function 

the file or string will be a JSON in format:

    {
      lineLength: <Integer>,
      board: <String[][]>
    }



    
Sometimes it cannot be determined what caused the error, fpr example on board  [["O","O",""],["X","",""],["","",""]] we cannot know, if player two started or if player two played twice in a row, in that case it is up to you to what to chose or how to handle the message

# Examples:


## Example 1:
    
    Input: 
     board = [["O","",""],["","",""],["","",""]],
     lineLength = 3
    Output: {
      status: "ERROR",
      error: "Player one must start the game"
    }
    Explanation: The first player always plays "X".


## Example 2:

    Input: 
     board =  [["X","O","X"],["","X",""],["","",""]],
     lineLength = 3
    Output: Output: {
      status: "ERROR",
      error: "Players take turns making moves"
    }
    Explanation: Player one did move twice in a row.


## Example 3:

    Input: 
     board = [["X","O","X"],["O","","O"],["X","O","X"]],
     lineLength = 3
    Output: Output: {
      status: "PLAY"
    }


## Example 4:

    Input: 
     board = [["X","X","X"],["","",""],["O","O","O"]],
     lineLength = 3
    Output: Output: Output: {
      status: "ERROR",
      error: "Player two played after game was already won"
    }
    Explanation: Player X has already won before Player O could make third move


## Example 5:

    Input: board = [["X","X","O"],
                    ["O","O","X"],
                    ["X","O","X"]],
           lineLength = 3
    Output: Output: Output: {
      status: "TIE",
    }


    NOTE: The board can be in various widths / heights, if it not meets any criterie, it is also considered as ERROR

-----------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------


# PART 2:

Implement game logic.

    Message with the winner will be displayed.
    Player on turn will be displayed.
    Follow the rules from step 1

Game ends with all cells filled or when one of the players wins.

 
    1. Aim for the most reusable (general) solution (Helps with bonus part)
    2. Both front end and backend matters (js part is meant by BE in this case)
        - Clean code, commenting the code (not over commenting)
        - User experience (UX) - Player should always know what is happening and design should be responsive and enjoyable

### Minimum:
      1. The game will be playable by user, the virtual players will be switching each turn but both will be controlled by the user
      2. The game will be playable by user, player will be either player one or two (randomly or selectable at start), the second player will be played by computer     (randomly)
 
### Recommended:
      1. The game will be played by computer, each turn will be visible and played on turn per second
      
### Bonus:      
      1. Implement some sort of BOT, that will not select the squares randomly, but somehow reacts on the current board and game progression (many approaches, does not matter what will be chosen, if at least some sort of logic will be present)
 
