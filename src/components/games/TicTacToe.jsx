import React, { useState, useEffect } from "react";
import "../../styles/Games.css";

const lines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board) {
  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

// simple AI: win if possible, block if necessary, pick center, then corners, then sides
function computeAIMove(board, ai = "O", human = "X"){
  // try to win
  for (let i=0;i<9;i++){
    if (!board[i]){
      const nb = board.slice(); nb[i] = ai;
      if (checkWinner(nb) === ai) return i;
    }
  }
  // block human
  for (let i=0;i<9;i++){
    if (!board[i]){
      const nb = board.slice(); nb[i] = human;
      if (checkWinner(nb) === human) return i;
    }
  }
  // center
  if (!board[4]) return 4;
  // corners
  const corners = [0,2,6,8].filter(i=>!board[i]);
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
  // sides
  const sides = [1,3,5,7].filter(i=>!board[i]);
  if (sides.length) return sides[Math.floor(Math.random()*sides.length)];
  return -1;
}

export default function TicTacToe(){
  const [showRoundSelect, setShowRoundSelect] = useState(true);
  const [totalRounds, setTotalRounds] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [draws, setDraws] = useState(0);
  
  const [board, setBoard] = useState(Array(9).fill(null));
  const [message, setMessage] = useState("Your turn — you're X");
  const [bannerVisible, setBannerVisible] = useState(false);
  const [turn, setTurn] = useState("X");
  const [finished, setFinished] = useState(false);
  const [gameSeriesComplete, setGameSeriesComplete] = useState(false);

  function selectRounds(rounds){
    setTotalRounds(rounds);
    setCurrentRound(1);
    setUserScore(0);
    setBotScore(0);
    setDraws(0);
    setShowRoundSelect(false);
    setGameSeriesComplete(false);
    reset();
  }

  function handleGameEnd(winner) {
    if (winner === "X") {
      setUserScore(prev => prev + 1);
    } else if (winner === "O") {
      setBotScore(prev => prev + 1);
    } else if (winner === "draw") {
      setDraws(prev => prev + 1);
    }
    setFinished(true);
  }

  function nextRound(){
    if (currentRound < totalRounds){
      setCurrentRound(currentRound + 1);
      reset();
    } else {
      setGameSeriesComplete(true);
    }
  }

  function playAgain(){
    setShowRoundSelect(true);
    setTotalRounds(null);
    setCurrentRound(0);
    setUserScore(0);
    setBotScore(0);
    setDraws(0);
    setGameSeriesComplete(false);
    reset();
  }

  function reset(){
    setBoard(Array(9).fill(null));
    setMessage("Your turn — you're X");
    setTurn("X");
    setFinished(false);
    setBannerVisible(false);
  }

  useEffect(()=>{
    const winner = checkWinner(board);
    if (winner) {
      if (winner === "draw") setMessage("It's a draw — nice work! Try again.");
      else if (winner === "X") setMessage("You win! Amazing move 🎉");
      else setMessage("AI wins — good practice! You learned something new.");
      handleGameEnd(winner);
    }
  }, [board]);

  // show banner when message changes briefly
  useEffect(()=>{
    if (!message) return;
    setBannerVisible(true);
    const t = setTimeout(()=> setBannerVisible(false), 1800);
    return () => clearTimeout(t);
  }, [message]);

  const onCell = (i) => {
    if (finished || board[i]) return;
    const nb = board.slice();
    nb[i] = "X";
    setBoard(nb);
    // check immediate effects
    const winner = checkWinner(nb);
    if (winner) return; // effect handled by useEffect

    // simple evaluation for encouragement: if this move creates two-in-a-row (threat) or blocks
    let good = false;
    // if this move causes a forced win next turn, encourage
    const aiMove = computeAIMove(nb);
    // if AI would win immediately on its move (bad), motivate
    const nbAfterAI = nb.slice(); if (aiMove>=0) nbAfterAI[aiMove] = "O";
    const aiWinner = checkWinner(nbAfterAI);
    if (aiWinner === "O") {
      setMessage("Tough move — keep trying, you'll get it next time 💪");
    } else {
      // if move created potential (two in row for X)
      for (let [a,b,c] of lines){
        const vals = [nb[a], nb[b], nb[c]];
        if (vals.filter(v=>v==="X").length===2 && vals.includes(null)) { good = true; break; }
      }
      if (good) setMessage("Great! You're building a winning position — keep going ✅");
      else setMessage("Nice move — stay focused! 🌟");
    }

    // AI move after short delay
    setTimeout(()=>{
      const ai = computeAIMove(nb);
      if (ai>=0){
        const nb2 = nb.slice(); nb2[ai] = "O"; setBoard(nb2);
      }
    }, 500);
  };

  // Round selection modal
  if (showRoundSelect) {
    return (
      <div className="game-card">
        <h3 style={{ color: "#000" }}>Tic-Tac-Toe</h3>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ marginBottom: "30px", fontSize: "16px", fontWeight: "500", color: "#000" }}>
            How many rounds would you like to play?
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button 
              onClick={() => selectRounds(3)} 
              style={{ padding: "10px 20px", fontSize: "14px", cursor: "pointer", borderRadius: "6px", color: "#000" }}
            >
              3 Rounds
            </button>
            <button 
              onClick={() => selectRounds(5)} 
              style={{ padding: "10px 20px", fontSize: "14px", cursor: "pointer", borderRadius: "6px", color: "#000" }}
            >
              5 Rounds
            </button>
            <button 
              onClick={() => selectRounds(7)} 
              style={{ padding: "10px 20px", fontSize: "14px", cursor: "pointer", borderRadius: "6px", color: "#000" }}
            >
              7 Rounds
            </button>
            <button 
              onClick={() => selectRounds(10)} 
              style={{ padding: "10px 20px", fontSize: "14px", cursor: "pointer", borderRadius: "6px", color: "#000" }}
            >
              10 Rounds
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game series complete — show final results
  if (gameSeriesComplete) {
    return (
      <div className="game-card">
        <h3 style={{ color: "#000" }}>Tic-Tac-Toe</h3>
        <div style={{ textAlign: "center", padding: "30px 20px" }}>
          <h4 style={{ marginBottom: "20px", fontSize: "18px", color: "#000" }}>🏆 Series Complete!</h4>
          <div style={{ fontSize: "16px", marginBottom: "25px", lineHeight: "1.8", color: "#000" }}>
            <div><strong>Final Score ({totalRounds} rounds)</strong></div>
            <div style={{ marginTop: "10px" }}>
              <div>You: <span style={{ fontSize: "24px", fontWeight: "bold", color: "#000" }}>{userScore}</span></div>
              <div>AI: <span style={{ fontSize: "24px", fontWeight: "bold", color: "#000" }}>{botScore}</span></div>
              <div>Draws: <span style={{ fontSize: "24px", fontWeight: "bold", color: "#000" }}>{draws}</span></div>
            </div>
          </div>
          <div style={{ marginBottom: "20px", fontSize: "14px", color: "#000" }}>
            {userScore > botScore ? "🎉 You're the champion! Great play!" : userScore === botScore ? "⚖️ It's a tie! Well balanced!" : "💪 Well played! Try again to win!"}
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button 
              onClick={playAgain} 
              style={{ padding: "10px 20px", fontSize: "14px", cursor: "pointer", borderRadius: "6px", fontWeight: "bold", color: "#000" }}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active game round
  return (
    <div className="game-card">
      <h3 style={{ color: "#000" }}>Tic-Tac-Toe</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", fontSize: "13px", fontWeight: "500", color: "#000" }}>
        <span>Round {currentRound}/{totalRounds}</span>
        <span>You: {userScore} | AI: {botScore} | Draw: {draws}</span>
      </div>
      <div className="ttt-message">{message}</div>
      <div className="ttt-board">
        {board.map((v,i)=>(
          <button key={i} className={`ttt-cell ${v?"filled":""}`} onClick={()=>onCell(i)}>
            {v}
          </button>
        ))}
      </div>
      {bannerVisible && <div className="game-banner">{message}</div>}
      <div className="game-actions">
        {!finished ? (
          <button onClick={reset}>Restart</button>
        ) : (
          <button onClick={nextRound}>
            {currentRound < totalRounds ? "Next Round" : "See Results"}
          </button>
        )}
      </div>
    </div>
  );
}
