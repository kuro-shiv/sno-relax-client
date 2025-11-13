import React, { useState } from "react";
import "../../styles/Games.css";

const choices = ["Rock","Paper","Scissors"];

function decide(a,b){
  if (a===b) return "draw";
  if ((a==="Rock"&&b==="Scissors")||(a==="Scissors"&&b==="Paper")||(a==="Paper"&&b==="Rock")) return "win";
  return "lose";
}

export default function RockPaperScissors(){
  const [showRoundSelect, setShowRoundSelect] = useState(true);
  const [totalRounds, setTotalRounds] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [draws, setDraws] = useState(0);

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("Make your move — beat the computer!");
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
    setFinished(false);
  }

  const play = (choice) => {
    if (finished) return;
    const comp = choices[Math.floor(Math.random()*3)];
    const r = decide(choice, comp);
    
    if (r === "win") {
      setMessage(`You win! ${choice} beats ${comp} — well played 🎉`);
      setUserScore(prev => prev + 1);
    }
    else if (r === "lose") {
      setMessage(`Not this time — ${comp} beats ${choice}. Keep going, you got this 💪`);
      setBotScore(prev => prev + 1);
    }
    else {
      setMessage(`It's a draw: ${choice} vs ${comp}. Try another move!`);
      setDraws(prev => prev + 1);
    }
    setResult({ you: choice, comp, r });
    setFinished(true);
  };

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

  const reset = () => {
    setResult(null);
    setMessage("Make your move — beat the computer!");
    setFinished(false);
  };

  // Round selection modal
  if (showRoundSelect) {
    return (
      <div className="game-card">
        <h3 style={{ color: "#000" }}>Rock · Paper · Scissors</h3>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ marginBottom: "30px", fontSize: "16px", fontWeight: "500", color: "#000" }}>
            How many rounds would you like to play?
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button 
              onClick={() => selectRounds(2)} 
              style={{ padding: "10px 20px", fontSize: "14px", cursor: "pointer", borderRadius: "6px", color: "#000" }}
            >
              2 Rounds
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
        <h3 style={{ color: "#000" }}>Rock · Paper · Scissors</h3>
        <div style={{ textAlign: "center", padding: "30px 20px" }}>
          <h4 style={{ marginBottom: "20px", fontSize: "18px", color: "#000" }}>🏆 Series Complete!</h4>
          <div style={{ fontSize: "16px", marginBottom: "25px", lineHeight: "1.8", color: "#000" }}>
            <div><strong>Final Score ({totalRounds} rounds)</strong></div>
            <div style={{ marginTop: "10px" }}>
              <div>You: <span style={{ fontSize: "24px", fontWeight: "bold", color: "#000" }}>{userScore}</span></div>
              <div>Bot: <span style={{ fontSize: "24px", fontWeight: "bold", color: "#000" }}>{botScore}</span></div>
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
      <h3 style={{ color: "#000" }}>Rock · Paper · Scissors</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", fontSize: "13px", fontWeight: "500", color: "#000" }}>
        <span>Round {currentRound}/{totalRounds}</span>
        <span>You: {userScore} | Bot: {botScore} | Draw: {draws}</span>
      </div>
      <div className="rps-message">{message}</div>
      <div className="rps-controls">
        {choices.map(c => (
          <button key={c} onClick={() => play(c)} className="rps-btn" disabled={finished}>{c}</button>
        ))}
      </div>
      {result && (
        <div className="rps-result">You: {result.you} — CPU: {result.comp}</div>
      )}
      <div className="game-actions">
        {!finished ? (
          <button onClick={reset}>Reset</button>
        ) : (
          <button onClick={nextRound}>
            {currentRound < totalRounds ? "Next Round" : "See Results"}
          </button>
        )}
      </div>
    </div>
  );
}
