
// Function to process JSON input and validate the board structure
export const processInput = (jsonInput) => {
    try {
        // Attempt to parse the JSON string into an object
        const input = JSON.parse(jsonInput);

        // Check if the "board" property exists and is an array
        if (!input.board || !Array.isArray(input.board)) {
            throw new Error('Invalid input: "board" must be an array.');
        }

        // Check if the "lineLength" property exists and is a number
        if (!input.lineLength || typeof input.lineLength !== 'number') {
            throw new Error('Invalid input: "lineLength" must be a number.');
        }

        // Ensure that the line length is at least 3
        if (input.lineLength < 3) {
            throw new Error('Invalid input: "lineLength" must be at least 3.');
        }
        
        // Extract board and its dimensions
        const board = input.board;
        const height = board.length;
        const width = board[0].length;
        
        // Validate that all rows in the board are of equal length
        for (let i = 0; i < height; i++) {
            if (board[i].length !== width) {
                throw new Error('Invalid board: All rows must have the same length.');
            }
        }

        // Call validateBoard to check the board's validity
        const validationResult = validateBoard(board, input.lineLength);
        return validationResult;

    } catch (error) {
        // Return error status and message if any exception occurs
        return { status: 'ERROR', error: error.message };
    }
}

// Function to validate the board state based on game rules
export function validateBoard(board, lineLength, playerOne) {
    // Validate the board structure and dimensions
    if (!board || !Array.isArray(board) || board.length === 0 || !Array.isArray(board[0]) || board[0].length < lineLength) {
        return { status: "ERROR", error: "Invalid board structure or dimensions" };
    }

    const height = board.length;
    const width = board[0].length;

    // Validate the board dimensions and line length constraints
    if (width < 3 || width > 10 || height < 3 || height > 10) {
        return { status: "ERROR", error: "Invalid board dimensions" };
    }

    // Validate the line length against board dimensions
    if (lineLength < 3 || lineLength > Math.min(width, height)) {
        return { status: "ERROR", error: "Invalid line length" };
    }

    let xCount = 0;
    let oCount = 0;

    // Count the number of X's and O's on the board
    for (let row of board) {
        for (let cell of row) {
            if (cell === 'X') xCount++;
            if (cell === 'O') oCount++;
        }
    }

    // Validate move turn order based on playerOne and counts of X and O
    if (playerOne === 'O' && xCount > oCount) {
        return { status: "ERROR", error: "Players take turns making moves" };
    }

    // Ensure that Player One starts the game if it is 'X'
    if (playerOne === 'X') {
        if (oCount > 0 && xCount === 0) {
            return { status: "ERROR", error: "Player one must start the game" };
        }   
        // Validate turn-taking rules
        if (oCount > xCount || xCount > oCount + 1) {
            return { status: "ERROR", error: "Players take turns making moves" }; 
        }
    }

    // Ensure that Player One starts the game if it is not 'X'
    if (playerOne !== 'O') {
        if (oCount > 0 && xCount === 0) {
            return { status: "ERROR", error: "Player one must start the game" };
        }
        // Validate turn-taking rules
        if (oCount > xCount || xCount > oCount + 1) {
            return { status: "ERROR", error: "Players take turns making moves" };
        }
    } 

    // Function to check if a player has won in any direction
    const checkWin = (startRow, startCol, dirRow, dirCol, player) => {
        let count = 0;
        // Iterate in the direction specified to count consecutive player's marks
        for (let i = 0; i < lineLength; i++) {
            let row = startRow + i * dirRow;
            let col = startCol + i * dirCol;
            // Check if the current cell is within bounds and matches the player's mark
            if (row >= 0 && row < height && col >= 0 && col < width && board[row][col] === player) {
                count++;
            } else {
                break;  // Stop counting if the streak is broken
            }
        }
        // Return true if the number of consecutive marks matches the lineLength
        return count === lineLength;
    };

    let xWin = false;
    let oWin = false;

    // Check for winning conditions for both 'X' and 'O'
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            // Check all possible winning directions (horizontal, vertical, diagonal)
            if (board[i][j] === 'X' || board[i][j] === 'O') {
                let player = board[i][j];
                if (checkWin(i, j, 0, 1, player) || 
                    checkWin(i, j, 1, 0, player) || 
                    checkWin(i, j, 1, 1, player) || 
                    checkWin(i, j, 1, -1, player)) {
                    if (player === 'X') xWin = true;
                    if (player === 'O') oWin = true;
                }
            }
        }
    }

    // Return result based on win conditions
    if (xWin && oWin) {
        return { status: "ERROR", error: "Both players cannot win simultaneously" };
    } else if (xWin || oWin) {
        return { status: "WIN", winner: xWin ? 'X' : 'O' };
    }

    // Check if the board is full to determine a tie
    let isBoardFull = board.every(row => row.every(cell => cell !== ""));
    if (isBoardFull) {
        return { status: "TIE" };
    }

    // The game is still ongoing
    return { status: "PLAY" };
}

// Function to get a random empty cell for the computer's move
export function getRandomEmptyCell(board) {
    const emptyCells = [];
    // Collect all empty cells into an array
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (board[row][col] === '') {
                emptyCells.push({ row, col });
            }
        }
    }
    // If there are no empty cells, return null
    if (emptyCells.length === 0) return null;
    // Select a random index from the array of empty cells
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}