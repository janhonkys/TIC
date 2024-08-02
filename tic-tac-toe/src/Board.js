import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import { processInput, validateBoard, getRandomEmptyCell } from './boardUtils'; // Import utility functions
import './Board.css'; // Import the CSS file for styling

// Board Component
const Board = ({ width, height, lineLength, onGameEnd, onPlayAgain, playerOne, playerTwo, computerPlaying, bothPlayersComputer }) => {
    // Initialize state variables
    const [board, setBoard] = useState(Array.from({ length: height }, () => Array(width).fill('')));
    const [currentPlayer, setCurrentPlayer] = useState(playerOne);
    const [gameStatus, setGameStatus] = useState('PLAY');
    const [error, setError] = useState(null);

    // Reset the board and game state when configuration changes
    useEffect(() => {
        setBoard(Array.from({ length: height }, () => Array(width).fill('')));
        setCurrentPlayer(playerOne);
        setGameStatus('PLAY');
        setError(null);
    }, [width, height, lineLength, playerOne, playerTwo]);

    // Handle computer moves if a computer is playing
    useEffect(() => {
        if (computerPlaying && (bothPlayersComputer || currentPlayer !== playerOne) && gameStatus === 'PLAY') {
            const { row, col } = getRandomEmptyCell(board) || {};
            if (row !== undefined && col !== undefined) {
                // Delay computer's move to simulate thinking (1 s)
                setTimeout(() => handleClick(row, col), 1000);
            }
        }
    }, [currentPlayer, gameStatus, computerPlaying, bothPlayersComputer]);

    // Handle cell click
    const handleClick = (row, col) => {
        // Ignore invalid or occupied cells and non-active game status
        if (row < 0 || row >= height || col < 0 || col >= width || board[row][col] !== '' || gameStatus !== 'PLAY') return;

        // Update the board with the current player's move
        const newBoard = board.map((r, rowIndex) =>
            r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? currentPlayer : cell))
        );

        // Validate the updated board
        const validationResult = validateBoard(newBoard, lineLength, playerOne);
        setBoard(newBoard);
        setGameStatus(validationResult.status);

        // Handle different game statuses
        if (validationResult.status === 'ERROR') {
            setError(validationResult.error);
        } else if (validationResult.status === 'WIN' || validationResult.status === 'TIE') {
            onGameEnd(validationResult);
        } else {
            setCurrentPlayer(currentPlayer === playerOne ? playerTwo : playerOne);
        }
    };

     // Trigger the `onPlayAgain` callback to restart the game
    const playAgain = () => {
        onPlayAgain();
    };

    return (
        <div className="board-container">
            {/* Display the current game status and player */}
            <div style={{ marginBottom: '10px' }}>
                <h3>Status: {gameStatus}</h3>
                <h3>
                    Current Player: 
                    {computerPlaying ? 
                        bothPlayersComputer ? 
                            ' Computer' : 
                            (currentPlayer === playerOne ? (playerOne === 'O' ? ' Player 2' : ' Player 1') : ' Computer') 
                        : 
                        (currentPlayer === playerOne ? (playerOne === 'O' ? ' Player 2' : ' Player 1') : ' Player 2')}
                </h3>
            </div>

            {/* Render the board grid */}
            <div className="grid-container">
                <div className="board">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} style={{ display: 'flex' }}>
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    onClick={() => handleClick(rowIndex, colIndex)} // Handle cell clicks
                                    className="cell"
                                >
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Display player selection buttons if not playing against computer */}
            <div className="button-spaceTop">
                {!computerPlaying && !bothPlayersComputer && (
                    <>
                        <button onClick={() => setCurrentPlayer(playerOne)} disabled={gameStatus !== 'PLAY'} className="button-spaced">
                            Player 1
                        </button>
                        <button onClick={() => setCurrentPlayer(playerTwo)} disabled={gameStatus !== 'PLAY'}>
                            Player 2
                        </button>
                    </>
                )}
            </div>
            {/* Display game over information and restart button */}
            {gameStatus !== 'PLAY' && (
                <div className="game-over">
                    <h2>Game Over</h2>
                    {gameStatus === 'WIN' && <h3>Winner: {currentPlayer === playerOne ? 'Player 1' : 'Player 2'}</h3>}
                    {gameStatus === 'TIE' && <h3>It's a Tie!</h3>}
                    {error && <h3>Error: {error}</h3>}
                    <button onClick={playAgain}>Play Again</button>
                </div>
            )}
        </div>
    );
};

export default Board;