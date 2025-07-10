import { useEffect, useRef, useState } from "react";
import './snake_and_ladder.css';
import d1 from './assets/icons8-dice-one-32.png';
import d2 from './assets/icons8-dice-two-32.png';
import d3 from './assets/icons8-dice-three-32.png';
import d4 from './assets/icons8-dice-four-32.png';
import d5 from './assets/icons8-dice-five-32.png';
import d6 from './assets/icons8-dice-six-32.png';
import dg from './assets/dice_gif.gif';
import rollSound from "./assets/snake.mp3";
import winSound from "./assets/win-176035.mp3";
import lossSound from "./assets/loss_sound.mp3";
import plr1 from './assets/player1img.png';
import plr2 from './assets/player2img.png';
import snake_main from './assets/snake_main.jpg';
import s_l_i from './assets/snk1.png';

function Snake_and_ladder() {
    const winsound = useRef(new Audio(winSound));
    const losssound = useRef(new Audio(lossSound));
    const dicesound = useRef(new Audio(rollSound));
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const roll_play = useRef(null);
    const roll_btn = useRef(null);
    const pl1 = useRef(null);
    const pl2 = useRef(null);
    const img_s = useRef(null);
    const player1Ref = useRef(null);
    const player2Ref = useRef(null);
    const [player1Pos, setPlayer1Pos] = useState(0);
    const [player2Pos, setPlayer2Pos] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [winner, setWinner] = useState(null);

    const images = ["", d1, d2, d3, d4, d5, d6];

    useEffect(() => {
        if (gameStarted) {
            createBoard();
            initializePlayers();
        }
    }, [gameStarted]);

    useEffect(() => {
        return () => {
            const alldiv = document.getElementById('snake_box');
            if (alldiv) {
                alldiv.innerHTML = "";
            }
        };
    }, []);

    function createBoard() {
        const alldiv = document.getElementById('snake_box');
        if (!alldiv) return; 

        alldiv.innerHTML = "";

        for (let i = 10; i >= 1; i--) {
            let new_div = document.createElement('div');
            new_div.setAttribute('id', `divcls${i}`);
            new_div.setAttribute('class', `row`);
            new_div.style.display = 'flex';
            alldiv.appendChild(new_div);
            let parent = new_div;
            
            if (i % 2 === 0) {
                let x = i * 10;
                let y = x - 10;
                for (let j = x; j > y; j--) {
                    createCell(parent, j);
                }
            } else {
                let y = i * 10;
                let x = y - 10;
                for (let j = x + 1; j <= y; j++) {
                    createCell(parent, j);
                }
            }
        }
    }

    function createCell(parent, j) {
        let new_child = document.createElement('div');
        new_child.setAttribute('class', `cell childcls${j}`);
        new_child.setAttribute('id', `childid${j}`);
        new_child.style.width = '70px';
        new_child.style.height = '60px';

        const cellNumber = document.createElement('span');
        cellNumber.className = 'cell-number';
        new_child.appendChild(cellNumber);
        parent.appendChild(new_child);
    }

    function initializePlayers() {
        if (!player1Ref.current) {
            player1Ref.current = document.createElement('div');
            player1Ref.current.className = 'player-piece player1-piece';
            player1Ref.current.style.backgroundImage = `url(${plr1})`;
        }
        if (!player2Ref.current) {
            player2Ref.current = document.createElement('div');
            player2Ref.current.className = 'player-piece player2-piece';
            player2Ref.current.style.backgroundImage = `url(${plr2})`;
        }

        const startCell = document.getElementById('childid1');
        if (startCell) {
            startCell.appendChild(player1Ref.current);
            startCell.appendChild(player2Ref.current);
            setPlayer1Pos(1);
            setPlayer2Pos(1);
        }
    }

    function startGame() {
        if (player1.trim() && player2.trim()) {
            setGameStarted(true);
        } else {
            alert("Please enter both player names");
        }
    }

    function rollDice() {
        dice_sound();
        roll_btn.current.disabled = true;
        img_s.current.src = dg;
        
        setTimeout(() => {
            const random_number = Math.ceil(Math.random() * 6);
            img_s.current.src = images[random_number];
            
            if (currentPlayer === 1) {
                movePlayer(1, random_number);
            } else {
                movePlayer(2, random_number);
            }
        }, 2000);
    }

    function movePlayer(player, steps) {
        let newPos;
        let currentPos;

        if (player === 1) {
            currentPos = player1Pos;
        } else {
            currentPos = player2Pos;
        }

        newPos = currentPos + steps;

        if (newPos > 100) {
            newPos = 100 - (newPos - 100);
        }

        let intermediatePos = currentPos;
        const interval = setInterval(() => {
            intermediatePos += (newPos > currentPos ? 1 : -1);
            
            if ((newPos > currentPos && intermediatePos >= newPos) || 
                (newPos < currentPos && intermediatePos <= newPos) || 
                intermediatePos === newPos) {
                
                clearInterval(interval);
                const finalPos = checkSnakesAndLadders(newPos);
                
                if (player === 1) {
                    setPlayer1Pos(finalPos);
                } else {
                    setPlayer2Pos(finalPos);
                }
                
                updatePlayerPosition(player, finalPos);

                if (finalPos === 100) {
                    winsound.current.play();
                    setWinner(player === 1 ? player1 : player2);
                    return;
                }
                
                setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
                roll_btn.current.disabled = false;
            } else {
                updatePlayerPosition(player, intermediatePos);
            }
        }, 500);
    }

    function updatePlayerPosition(player, position) {
        const cell = document.getElementById(`childid${position}`);
        if (cell) {
            const playerPiece = player === 1 ? player1Ref.current : player2Ref.current;
            cell.appendChild(playerPiece);
        }
    }

    function checkSnakesAndLadders(pos) {
        const snakesLadders = {
            4: 25,   
            13: 46,   
            33: 49,   
            50: 69,   
            42: 63,   
            62: 81,   
            74: 92,   
            27: 5,     
            40: 3,     
            43: 8,     
            66: 45,    
            76: 58,    
            89: 53,    
            54: 31,    
            99: 41     
        };

        if (snakesLadders[pos]) {
            if (pos < snakesLadders[pos]) {
                win_sound();   
            } else {
                loss_sound();   
            }
            return snakesLadders[pos];
        }
        return pos;
    }

    function resetGame() {
        setPlayer1Pos(1);
        setPlayer2Pos(1);
        setCurrentPlayer(1);
        setWinner(null);
        initializePlayers();
        roll_btn.current.disabled = false;
        img_s.current.src = dg;
    }

    const win_sound = () => {
        winsound.current.currentTime = 0;
        winsound.current.play();
    };

    const loss_sound = () => {
        losssound.current.currentTime = 0;
        losssound.current.play();
    };

    const dice_sound = () => {
        dicesound.current.currentTime = 0;
        dicesound.current.play();
    };

    return (
        <div className="game-container">
            {!gameStarted ? (
                <div className="login-page">
                    <div className="welcome-section">
                        <div className="welcome-text">
                            <h1 className="animated-welcome">Welcome to Snake and Ladder!</h1>
                        </div>
                        <div className="s_l"><img src={s_l_i} alt="Snake and Ladder Logo" /></div>
                    </div>
                    
                    <div className="login-card">
                        <span className="spans">Start Your Journey</span>
                        <form onSubmit={(e) => { e.preventDefault(); startGame(); }}>
                            <div className="input-group">
                                <label>Player 1</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Player 1 name" 
                                    value={player1} 
                                    onChange={(e) => setPlayer1(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Player 2</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Player 2 name" 
                                    value={player2} 
                                    onChange={(e) => setPlayer2(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="btn" type="submit">Start Game</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="game-content">
                    <div className="snake_and_ladder_img">
                        <img src={snake_main} alt="Snake and Ladder Title" />
                    </div>
                    <div className="game-header">
                        <div className={`player-info ${currentPlayer === 1 ? 'active' : ''}`}>
                            <div className="player-avatar-container">
                                <img src={plr1} alt="Player 1" className="player-icon" />
                            </div>
                            <span className="player-name">{player1}</span>
                            <div className="player-position">Position: {player1Pos}</div>
                        </div>
                        
                        <div className="dice-container">
                            <div className="dice-wrapper">
                                <img src={dg} alt="Dice" ref={img_s} className="dice-image" />
                                <button 
                                    ref={roll_btn} 
                                    onClick={rollDice}
                                    className="roll-btn"
                                >
                                    Roll Dice
                                </button>
                            </div>
                        </div>
                        
                        <div className={`player-info ${currentPlayer === 2 ? 'active' : ''}`}>
                            <div className="player-avatar-container">
                                <img src={plr2} alt="Player 2" className="player-icon" />
                            </div>
                            <span className="player-name">{player2}</span>
                            <div className="player-position">Position: {player2Pos}</div>
                        </div>
                    </div>
                    
                    <div className="game-board">
                        <div className="snake">
                            <div id="snake_box"></div>
                        </div>
                    </div>
                    
                    {winner && (
                        <div className="winner-modal">
                            <div className="winner-content">
                                <h2>{winner} Wins!</h2>
                                <button onClick={resetGame}>Play Again</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Snake_and_ladder;