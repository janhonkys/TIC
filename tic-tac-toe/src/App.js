import React, { useState } from 'react'; // Import React and useState hook for state management
import Board from './Board'; // Import the Board component
import { processInput, validateBoard, getRandomEmptyCell } from './boardUtils';  // Import utility functions for game logic
import './App.css'; // Import the CSS file

const App = () => {
    // State variables for game configuration and status
    const [width, setWidth] = useState(3);
    const [height, setHeight] = useState(3);
    const [lineLength, setLineLength] = useState(3);
    const [playerOne, setPlayerOne] = useState('X');
    const [playerTwo, setPlayerTwo] = useState('O');
    const [computerPlaying, setComputerPlaying] = useState(false);
    const [bothPlayersComputer, setBothPlayersComputer] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [jsonInput, setJsonInput] = useState('');
    const [showJsonInput, setShowJsonInput] = useState(false);

    // Validate game configuration
    const isValidConfiguration = () => 
        width >= 3 && width <= 10 && height >= 3 && height <= 10 && lineLength >= 3 && lineLength <= Math.min(width, height);

    // Update game configuration state
    const updateConfig = (updates) => {
        setWidth(updates.width ?? width);
        setHeight(updates.height ?? height);
        setLineLength(updates.lineLength ?? lineLength);
        setPlayerOne(updates.playerOne ?? playerOne);
        setPlayerTwo(updates.playerTwo ?? playerTwo);
        setComputerPlaying(updates.computerPlaying ?? computerPlaying);
        setBothPlayersComputer(updates.bothPlayersComputer ?? bothPlayersComputer);
    };

    // Function to start a new game with given player choices
    const startGame = (playerOneChoice, playerTwoChoice) => {
        // Check if the current configuration is valid
        if (isValidConfiguration()) {
            // Update the game configuration with the chosen players and set computer play to false
            updateConfig({ playerOne: playerOneChoice, playerTwo: playerTwoChoice, computerPlaying: false, bothPlayersComputer: false });
            // Indicate that the game has started
            setGameStarted(true);
            // Reset the game result
            setGameResult(null);
        } else {
            // Alert the user if the configuration is invalid
            alert('Invalid configuration. Please adhere to the rules.');
        }
    };

    // Function to start a new game with computer player(s)
    const startComputerGame = (player, bothPlayers) => {
        // Check if the current configuration is valid
        if (isValidConfiguration()) {
            // Update the game configuration for computer play
            updateConfig({
                playerOne: player,
                playerTwo: player === 'X' ? 'O' : 'X',
                computerPlaying: true,
                bothPlayersComputer: bothPlayers
            });
            // Indicate that the game has started
            setGameStarted(true);
            // Reset the game result
            setGameResult(null);
        } else {
            // Alert the user if the configuration is invalid
            alert('Invalid configuration. Please adhere to the rules.');
        }
    };

    // Handle the end of the game
    const handleGameEnd = (result) => {
        setGameResult(result);
        setGameStarted(false);
    };

    // Restart the game with default settings
    const restartGame = () => {
        updateConfig({ width: 3, height: 3, lineLength: 3, playerOne: 'X', playerTwo: 'O', computerPlaying: false, bothPlayersComputer: false });
        setGameStarted(false);
        setGameResult(null);
    };

    // Handle JSON input change
    const handleJsonChange = (event) => setJsonInput(event.target.value);

    // Function to handle JSON input submission
    const handleJsonSubmit = () => {
        try {
            // Process the JSON input and get the result
            const result = processInput(jsonInput);
            
            // If the result status is 'PLAY', configure and start the game
            if (result.status === 'PLAY') {
                // Parse the JSON input to get game configuration details
                const { board, lineLength, playerOne, playerTwo, computerPlaying, bothPlayersComputer } = JSON.parse(jsonInput);
                
                // Update the game configuration with parsed values or defaults
                updateConfig({
                    width: board[0].length,                     
                    height: board.length,                        
                    lineLength,                                
                    playerOne: playerOne || 'X',               
                    playerTwo: playerTwo || 'O',                
                    computerPlaying: computerPlaying || false,  
                    bothPlayersComputer: bothPlayersComputer || false 
                });
                
                // Indicate that the game has started
                setGameStarted(true);
            } else {
                // If the result status is not 'PLAY', set the game result (e.g., error or other status)
                setGameResult(result);
            }
            
            // Hide the JSON input area after submission
            setShowJsonInput(false);
        } catch (error) {
            // Alert the user if there's an error in JSON input parsing
            alert(`Invalid JSON input: ${error.message}`);
        }
    };


    return (
        <div className="app-container"> {/* Main container for the app */}
            <header className="app-header"> {/* Header section */}
                <h1>Tic-Tac-Toe</h1> {/* App title */}
            </header>
            
            {/* Conditional rendering based on whether the game has started */}
            {!gameStarted ? (
                <div className="config-container"> {/* Container for game configuration */}
                    {/* Show game configuration section if there is no game result */}
                    {!gameResult && (
                        <div className="config-section">
                            <h2>Configure Game</h2> {/* Section title */}
                            <div className="config-fields"> {/* Container for configuration fields */}
                                <label>
                                    Width:
                                    <input 
                                        className="centered-input"
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(parseInt(e.target.value))}
                                        min="3"
                                        max="10"
                                    />
                                </label>
                                <label>
                                    Height:
                                    <input
                                        className="centered-input"
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(parseInt(e.target.value))}
                                        min="3"
                                        max="10"
                                    />
                                </label>
                                <label>
                                    Line Length:
                                    <input
                                        className="centered-input"
                                        type="number"
                                        value={lineLength}
                                        onChange={(e) => setLineLength(parseInt(e.target.value))}
                                        min="3"
                                        max={Math.min(width, height)}
                                    />
                                </label>
                            </div>
                            <div className="button-group"> {/* Container for buttons */}
                                <button onClick={() => startGame('X', 'O')}>Play as Player 1 vs Player 2</button>
                                <button onClick={() => startComputerGame('X', false)}>Play as Player 1 against Computer</button>
                                <button onClick={() => startComputerGame('O', false)}>Play as Player 2 against Computer</button>
                                <button onClick={() => startComputerGame('X', true)}>Play as Computer vs Computer</button>
                            </div>
                            {/* Show JSON input button if JSON input section is not visible */}
                            {!showJsonInput && (
                                <div className="button-group">
                                    <button onClick={() => setShowJsonInput(true)}>Paste JSON Input</button>
                                </div>
                            )}
                            {/* JSON input section */}
                            {showJsonInput && (
                                <div className="json-button">
                                    <h2>Paste JSON Input</h2>
                                    <textarea
                                        className="json-textarea"
                                        value={jsonInput}
                                        onChange={handleJsonChange}
                                        placeholder='Paste JSON input here...'
                                    />
                                    <button onClick={handleJsonSubmit}>Submit JSON</button>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Show game result section if there is a game result */}
                    {gameResult && (
                        <div className="result-section">
                            {/* Show message based on game result status */}
                            {gameResult.status === 'TIE' && <h3>It's a Tie!</h3>}
                            {gameResult.status === 'WIN' && (
                                <div>
                                    <h3>Winner: {gameResult.winner === 'X' ? 'Player 1' : 'Player 2'}</h3>
                                </div>
                            )}
                            {gameResult.status === 'ERROR' && <h3>Error: {gameResult.error}</h3>}
                            <button onClick={restartGame}>Play Again</button> {/* Button to restart the game */}
                        </div>
                    )}
                </div>
            ) : (
                <div className="game-container"> {/* Container for the game board */}
                    <Board
                        width={width}
                        height={height}
                        lineLength={lineLength}
                        onGameEnd={handleGameEnd}
                        onPlayAgain={restartGame}
                        playerOne={playerOne}
                        playerTwo={playerTwo}
                        computerPlaying={computerPlaying}
                        bothPlayersComputer={bothPlayersComputer}
                    />
                </div>
            )}
        </div>
    );
};

export default App;    